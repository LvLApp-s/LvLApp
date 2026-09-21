"""A community name belongs to one community.

Two communities called "AI" already exist in production, which is how this
was noticed. The application compared names before inserting, but renaming an
existing community skipped that check completely, and two people creating at
the same moment could both pass it. The unique index added in migration 019
is the authority; these tests cover the paths that reach it.
"""
import unittest
from unittest.mock import patch

import app as zapp


class Recorder:
    """Stands in for the query builder, remembering the filters it was given."""

    def __init__(self, calls, rows):
        self.calls = calls
        self.rows = rows

    def ilike(self, column, pattern):
        self.calls.append((column, pattern))
        return self

    def __getattr__(self, name):
        def chain(*args, **kwargs):
            return self
        return chain

    def execute(self):
        return type('Res', (), {'data': list(self.rows)})()


class FakeDB:
    def __init__(self, calls, rows):
        self.calls = calls
        self.rows = rows

    def table(self, name):
        return Recorder(self.calls, self.rows)


class NameLookupTests(unittest.TestCase):
    def setUp(self):
        self.calls = []

    def lookup(self, name, rows, **kwargs):
        with zapp.app.test_request_context('/'), \
             patch.object(zapp, 'supabase', FakeDB(self.calls, rows)):
            return zapp.community_name_is_taken(name, **kwargs)

    def test_an_existing_name_is_taken(self):
        self.assertTrue(self.lookup('AI', [{'id': 3}]))

    def test_a_free_name_is_not(self):
        self.assertFalse(self.lookup('Chess Club', []))

    def test_case_does_not_matter(self):
        """ilike is case-insensitive, so "ai" must find "AI"."""
        self.lookup('ai', [{'id': 3}])
        self.assertEqual(self.calls[0][0], 'name')

    def test_a_community_does_not_clash_with_itself(self):
        """Saving the edit form without touching the name must not fail."""
        self.assertFalse(self.lookup('AI', [{'id': 7}], exclude_id=7))
        self.assertTrue(self.lookup('AI', [{'id': 7}, {'id': 9}], exclude_id=7))

    def test_wildcards_in_a_name_are_escaped(self):
        """% and _ are wildcards to ilike. Unescaped, a community called "A_"
        would report every two-letter name starting with A as taken."""
        self.lookup('A_B', [])
        self.assertEqual(self.calls[0][1], r'A\_B')
        self.calls.clear()
        self.lookup('100%', [])
        self.assertEqual(self.calls[0][1], r'100\%')

    def test_blank_names_never_query(self):
        self.assertFalse(self.lookup('   ', []))
        self.assertEqual(self.calls, [])

    def test_a_lookup_failure_does_not_block_the_form(self):
        """The index still protects the database, so a flaky read must not
        stop someone creating a community."""
        class Broken:
            def table(self, name):
                raise RuntimeError('offline')

        with zapp.app.test_request_context('/'), patch.object(zapp, 'supabase', Broken()):
            self.assertFalse(zapp.community_name_is_taken('AI'))


class ConflictDetectionTests(unittest.TestCase):
    """A race is settled by the database; the message must still read right."""

    def test_the_index_violation_is_recognised(self):
        self.assertTrue(zapp.community_name_conflict(
            Exception('duplicate key value violates unique constraint '
                      '"idx_communities_name_lower"')))

    def test_an_unrelated_failure_is_not(self):
        self.assertFalse(zapp.community_name_conflict(Exception('connection reset')))
        self.assertFalse(zapp.community_name_conflict(
            Exception('relation "communities" does not exist')))


class MigrationTests(unittest.TestCase):
    def test_the_index_exists_in_a_migration(self):
        from pathlib import Path
        root = Path(zapp.__file__).resolve().parent
        sql = "\n".join(
            path.read_text(encoding='utf-8')
            for path in (root / 'database' / 'migrations').glob('*.sql')
        )
        self.assertIn('idx_communities_name_lower', sql)
        self.assertIn('lower(name)', sql)

    def test_the_migration_warns_about_existing_duplicates(self):
        """Creating the index fails while two AIs exist, so the file has to
        say so rather than leaving someone with a confusing error."""
        from pathlib import Path
        root = Path(zapp.__file__).resolve().parent
        text = (root / 'database' / 'migrations'
                / '019_unique_community_name.sql').read_text(encoding='utf-8')
        self.assertIn('having count(*) > 1', text)


class FormWiringTests(unittest.TestCase):
    def test_both_routes_check_the_name(self):
        from pathlib import Path
        source = Path(zapp.__file__).read_text(encoding='utf-8')
        for route in ('create_community', 'edit_community'):
            body = source.split(f"def {route}(")[1].split('\ndef ')[0]
            with self.subTest(route=route):
                self.assertIn('community_name_is_taken', body)
                self.assertIn('community_name_conflict', body)

    def test_the_edit_form_excludes_the_community_being_edited(self):
        from pathlib import Path
        source = Path(zapp.__file__).read_text(encoding='utf-8')
        body = source.split("def edit_community(")[1].split('\ndef ')[0]
        self.assertIn("exclude_id=community_item['id']", body)

    def test_the_form_asks_before_the_reader_submits(self):
        from pathlib import Path
        root = Path(zapp.__file__).resolve().parent
        form = (root / 'templates' / 'community_form.html').read_text(encoding='utf-8')
        self.assertIn('data-community-name-check', form)
        self.assertIn('data-community-name-status', form)

    def test_the_availability_endpoint_requires_a_signed_in_reader(self):
        zapp.app.config.update(TESTING=True)
        client = zapp.app.test_client()
        response = client.get('/api/community-name-available?name=AI')
        self.assertEqual(response.status_code, 401)


if __name__ == '__main__':
    unittest.main()

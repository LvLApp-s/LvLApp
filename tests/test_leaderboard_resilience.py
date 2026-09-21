"""The leaderboard must not report an empty community because of a side query.

The panel is built in three steps: fetch the people, hide the ones the viewer
blocked, and mark who they follow. Only the first produces the list. A single
handler around all three meant a failure in either of the last two returned
an empty list, and the rail then said "no community members yet" -- which is
what someone sees on a page where the members plainly exist.
"""
import unittest
from unittest.mock import patch

import app as zapp

PEOPLE = [
    {'id': 1, 'username': 'a', 'display_name': 'A', 'level': 3, 'badge_color': '#888'},
    {'id': 2, 'username': 'b', 'display_name': 'B', 'level': 2, 'badge_color': '#888'},
]


class FakeDB:
    def table(self, name):
        rows = [dict(p) for p in PEOPLE] if name == 'users' else []

        class Q:
            def __getattr__(self, attr):
                def chain(*args, **kwargs):
                    return self
                return chain

            def execute(inner):
                return type('R', (), {'data': rows, 'count': len(rows)})()

        return Q()


class LeaderboardResilienceTests(unittest.TestCase):
    def setUp(self):
        zapp._forced_level_users_cache.update({'at': 0.0, 'users': None})

    def highlights(self, **patches):
        with zapp.app.test_request_context('/settings'), \
             patch.object(zapp, 'supabase', FakeDB()):
            from flask import session
            session['user_id'] = 1
            with patch.multiple(zapp, **patches) if patches else _null():
                return zapp.get_community_highlights()

    def test_it_lists_people_normally(self):
        self.assertEqual(len(self.highlights()), 2)

    def test_a_failing_follow_lookup_still_shows_the_people(self):
        """This is the regression: the panel went blank instead of dropping
        the follow state."""
        def boom(users, viewer_id):
            raise RuntimeError('follows table unavailable')

        people = self.highlights(mark_following_state=boom)
        self.assertEqual(len(people), 2, "a side query emptied the leaderboard")
        for person in people:
            with self.subTest(person=person['username']):
                self.assertIs(person['is_following'], False)

    def test_a_failing_block_filter_shows_nobody(self):
        """The opposite call: if we cannot tell who is blocked, showing them
        anyway is worse than showing an empty panel."""
        def boom(users, viewer_id, include_mutes=True):
            raise RuntimeError('safety table unavailable')

        self.assertEqual(self.highlights(filter_blocked_users=boom), [])

    def test_a_failing_people_query_is_empty(self):
        class Broken:
            def table(self, name):
                raise RuntimeError('offline')

        with zapp.app.test_request_context('/settings'), \
             patch.object(zapp, 'supabase', Broken()):
            self.assertEqual(zapp.get_community_highlights(), [])

    def test_a_signed_out_reader_still_gets_the_list(self):
        with zapp.app.test_request_context('/'), patch.object(zapp, 'supabase', FakeDB()):
            self.assertEqual(len(zapp.get_community_highlights()), 2)

    def test_every_page_with_a_leaderboard_passes_one(self):
        """show_highlights without highlights renders the empty state."""
        from pathlib import Path
        root = Path(zapp.__file__).resolve().parent
        source = (root / 'app.py').read_text(encoding='utf-8')
        for template in sorted((root / 'templates').glob('*.html')):
            text = template.read_text(encoding='utf-8')
            if 'set show_highlights = True' not in text:
                continue
            name = template.name
            with self.subTest(template=name):
                rendered = [chunk for chunk in source.split("render_template(")[1:]
                            if chunk.lstrip().startswith(f"'{name}'")]
                self.assertTrue(rendered, f"no route renders {name}")
                for chunk in rendered:
                    call = chunk.split('\n\n')[0]
                    self.assertIn('highlights=', call,
                                  f"{name} shows a leaderboard but is given no highlights")


class _null:
    def __enter__(self):
        return None

    def __exit__(self, *args):
        return False


if __name__ == '__main__':
    unittest.main()

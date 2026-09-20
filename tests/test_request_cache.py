"""The per-request query cache must save round trips without serving stale rows.

Rendering one page asks Supabase the same questions repeatedly. Memoising the
answers is only safe while the cache is scoped to a single request and a write
inside that request invalidates what it changed -- both of which fail silently
if broken, so they are pinned here.
"""
import time
import unittest
from unittest.mock import patch

import app as zapp


class FakeExecute:
    """Records every .execute() and returns whatever rows it was given."""

    def __init__(self, counter, rows):
        self.counter = counter
        self.rows = rows

    def __getattr__(self, name):
        def chain(*args, **kwargs):
            return self
        return chain

    def execute(self):
        self.counter['n'] += 1
        return type('Res', (), {'data': list(self.rows)})()


class FakeSupabase:
    def __init__(self, counter, rows):
        self.counter = counter
        self.rows = rows

    def table(self, name):
        return FakeExecute(self.counter, self.rows)


BLOCK_ROWS = [{'actor_id': 1, 'target_user_id': 9, 'action_type': 'block'}]


class RequestCacheTests(unittest.TestCase):
    def setUp(self):
        self.counter = {'n': 0}
        self.fake = FakeSupabase(self.counter, BLOCK_ROWS)
        # The forced-level cache is module state; keep tests independent.
        zapp._forced_level_users_cache.update({'at': 0.0, 'users': None})

    def test_repeat_lookups_in_one_request_hit_the_database_once(self):
        with zapp.app.test_request_context('/'), patch.object(zapp, 'supabase', self.fake):
            first = zapp.blocked_user_ids_for_viewer(1)
            second = zapp.blocked_user_ids_for_viewer(1)
            third = zapp.blocked_user_ids_for_viewer(1, candidate_ids=[9])
        self.assertEqual(self.counter['n'], 1)
        self.assertEqual(first, {9})
        self.assertEqual(second, {9})
        self.assertEqual(third, {9})

    def test_candidate_filtering_still_applies_per_call(self):
        """The cache holds the rows, not the filtered answer."""
        with zapp.app.test_request_context('/'), patch.object(zapp, 'supabase', self.fake):
            everyone = zapp.blocked_user_ids_for_viewer(1)
            narrowed = zapp.blocked_user_ids_for_viewer(1, candidate_ids=[42])
        self.assertEqual(everyone, {9})
        self.assertEqual(narrowed, set(), "a candidate list must still narrow the result")

    def test_mutes_and_blocks_are_cached_separately(self):
        with zapp.app.test_request_context('/'), patch.object(zapp, 'supabase', self.fake):
            zapp.blocked_user_ids_for_viewer(1, include_mutes=True)
            zapp.blocked_user_ids_for_viewer(1, include_mutes=False)
        self.assertEqual(self.counter['n'], 2, "the two queries differ, so both must run")

    def test_each_request_starts_from_a_cold_cache(self):
        with zapp.app.test_request_context('/'), patch.object(zapp, 'supabase', self.fake):
            zapp.blocked_user_ids_for_viewer(1)
        with zapp.app.test_request_context('/'), patch.object(zapp, 'supabase', self.fake):
            zapp.blocked_user_ids_for_viewer(1)
        self.assertEqual(self.counter['n'], 2, "a cache that outlives a request would serve stale rows")

    def test_a_write_invalidates_what_it_changed(self):
        with zapp.app.test_request_context('/'), patch.object(zapp, 'supabase', self.fake):
            zapp.blocked_user_ids_for_viewer(1)
            zapp.clear_request_cache('safety_actions')
            zapp.blocked_user_ids_for_viewer(1)
        self.assertEqual(self.counter['n'], 2, "a read after a write must not use the old answer")

    def test_every_safety_write_clears_the_cache(self):
        """A write site added later without invalidation would serve stale blocks."""
        import re
        source = (zapp.__file__ and open(zapp.__file__, encoding='utf-8').read()) or ''
        lines = source.split('\n')
        for i, line in enumerate(lines):
            if "table('user_safety_actions')" not in line:
                continue
            if not re.search(r'\.(insert|delete|update|upsert)\(', line):
                continue
            following = '\n'.join(lines[i + 1:i + 3])
            with self.subTest(line=i + 1):
                self.assertIn('clear_request_cache', following,
                              f"app.py:{i + 1} writes safety actions without clearing the cache")

    def test_cache_is_a_no_op_outside_a_request(self):
        """Scripts and jobs import app.py without a request context."""
        calls = {'n': 0}

        def produce():
            calls['n'] += 1
            return 'value'

        self.assertEqual(zapp.request_cached(('k',), produce), 'value')
        self.assertEqual(zapp.request_cached(('k',), produce), 'value')
        self.assertEqual(calls['n'], 2, "without a request there is nothing to scope a cache to")
        zapp.clear_request_cache()  # must not raise


class ForcedLevelCacheTests(unittest.TestCase):
    def setUp(self):
        self.counter = {'n': 0}
        self.fake = FakeSupabase(self.counter, [])
        zapp._forced_level_users_cache.update({'at': 0.0, 'users': None})

    def tearDown(self):
        zapp._forced_level_users_cache.update({'at': 0.0, 'users': None})

    def test_a_warm_instance_skips_the_alias_lookups(self):
        with zapp.app.test_request_context('/'), patch.object(zapp, 'supabase', self.fake):
            zapp.get_forced_level_users()
        first = self.counter['n']
        self.assertGreater(first, 0)
        with zapp.app.test_request_context('/'), patch.object(zapp, 'supabase', self.fake):
            zapp.get_forced_level_users()
        self.assertEqual(self.counter['n'], first, "a second request should reuse the cached list")

    def test_the_cache_expires(self):
        with zapp.app.test_request_context('/'), patch.object(zapp, 'supabase', self.fake):
            zapp.get_forced_level_users()
        first = self.counter['n']
        zapp._forced_level_users_cache['at'] = time.time() - zapp.FORCED_LEVEL_USERS_TTL - 1
        with zapp.app.test_request_context('/'), patch.object(zapp, 'supabase', self.fake):
            zapp.get_forced_level_users()
        self.assertGreater(self.counter['n'], first, "a rename must show up once the TTL passes")

    def test_callers_cannot_mutate_the_cached_list(self):
        with zapp.app.test_request_context('/'), patch.object(zapp, 'supabase', self.fake):
            got = zapp.get_forced_level_users()
            got.append({'id': 999})
            again = zapp.get_forced_level_users()
        self.assertEqual(again, [], "the cache handed out its own list")

    def test_ttl_is_short_enough_to_stay_current(self):
        self.assertLessEqual(zapp.FORCED_LEVEL_USERS_TTL, 900)


if __name__ == '__main__':
    unittest.main()


class ReelViewerStateTests(unittest.TestCase):
    """The side rail prints public counts, so it must not pay for private ones."""

    def setUp(self):
        self.tables = []

        class Recorder:
            def __init__(self, tables, name):
                self.tables = tables
                self.name = name

            def __getattr__(self, attr):
                def chain(*args, **kwargs):
                    return self
                return chain

            def execute(inner):
                inner.tables.append(inner.name)
                return type('Res', (), {'data': []})()

        class FakeDB:
            def __init__(self, tables):
                self.tables = tables

            def table(self, name):
                return Recorder(self.tables, name)

        self.db = FakeDB(self.tables)
        self.reels = [{'id': 1, 'user_id': 2, 'user': {'id': 2}, 'view_count': 0}]

    def enrich(self, **kwargs):
        with zapp.app.test_request_context('/'), patch.object(zapp, 'supabase', self.db):
            return zapp.enrich_reels([dict(r) for r in self.reels], viewer_id=1, **kwargs)

    def test_opting_out_skips_the_viewer_lookups(self):
        self.enrich(include_viewer_state=True)
        with_state = list(self.tables)
        self.tables.clear()
        self.enrich(include_viewer_state=False)
        without_state = list(self.tables)
        self.assertLess(len(without_state), len(with_state),
                        "opting out saved nothing")
        self.assertNotIn('reel_bookmarks', without_state)
        self.assertNotIn('follows', without_state)

    def test_public_counts_are_still_fetched(self):
        self.enrich(include_viewer_state=False)
        self.assertIn('reel_likes', self.tables, "the rail still shows a like count")
        self.assertIn('reel_comments', self.tables, "the rail still shows a comment count")

    def test_a_clip_keeps_the_same_shape_either_way(self):
        """Templates read these keys unconditionally; a missing one is a 500."""
        rich = self.enrich(include_viewer_state=True)[0]
        plain = self.enrich(include_viewer_state=False)[0]
        self.assertEqual(set(rich), set(plain))
        for key in ('viewer_liked', 'viewer_bookmarked', 'author_followed'):
            with self.subTest(key=key):
                self.assertIs(plain[key], False)

    def test_viewer_state_is_on_by_default(self):
        """Every other caller -- the clips page above all -- must keep it."""
        import inspect
        signature = inspect.signature(zapp.enrich_reels)
        self.assertIs(signature.parameters['include_viewer_state'].default, True)
        self.assertIs(inspect.signature(zapp.get_reels)
                      .parameters['include_viewer_state'].default, True)

    def test_the_rail_template_reads_no_viewer_state(self):
        """If the rail ever starts showing a like or follow state, this opt-out
        becomes wrong -- fail here rather than render it blank."""
        from pathlib import Path
        panel = (Path(zapp.__file__).parent / 'templates' / '_home_reel_panel.html')
        markup = panel.read_text(encoding='utf-8')
        for key in ('viewer_liked', 'viewer_bookmarked', 'author_followed', 'is_owner'):
            with self.subTest(key=key):
                self.assertNotIn(key, markup)

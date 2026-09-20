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

"""Blocks and mutes are one lookup per request, not two.

include_mutes used to be part of the cache key, so a page that rendered one
list with mutes hidden and another without paid two round trips for the same
table. Blocks are a subset of blocks-and-mutes: the superset is fetched once
and the blocks-only caller filters it.

What must not change is who ends up hidden, so that is pinned both ways.
"""
import unittest
from unittest.mock import patch

import app as zapp

ROWS = [
    {'actor_id': 1, 'target_user_id': 2, 'action_type': 'block'},
    {'actor_id': 3, 'target_user_id': 1, 'action_type': 'block'},
    {'actor_id': 1, 'target_user_id': 4, 'action_type': 'mute'},
    {'actor_id': 5, 'target_user_id': 1, 'action_type': 'mute'},
]


class CountingDB:
    def __init__(self):
        self.queries = 0

    def table(self, name):
        outer = self

        class Q:
            def __getattr__(self, attr):
                def chain(*args, **kwargs):
                    return self
                return chain

            def execute(self):
                outer.queries += 1
                return type('R', (), {'data': list(ROWS), 'count': len(ROWS)})()
        return Q()


class SingleFetchTests(unittest.TestCase):
    def setUp(self):
        zapp.app.config.update(TESTING=True)
        self.db = CountingDB()

    def test_both_callers_share_one_round_trip(self):
        with zapp.app.test_request_context('/'), patch.object(zapp, 'supabase', self.db):
            zapp.safety_action_rows(1, include_mutes=True)
            zapp.safety_action_rows(1, include_mutes=False)
            zapp.safety_action_rows(1, include_mutes=True)
        self.assertEqual(self.db.queries, 1)

    def test_a_different_viewer_is_its_own_lookup(self):
        with zapp.app.test_request_context('/'), patch.object(zapp, 'supabase', self.db):
            zapp.safety_action_rows(1)
            zapp.safety_action_rows(2)
        self.assertEqual(self.db.queries, 2)

    def test_blocks_only_really_is_blocks_only(self):
        with zapp.app.test_request_context('/'), patch.object(zapp, 'supabase', self.db):
            rows = zapp.safety_action_rows(1, include_mutes=False)
        self.assertEqual([r['action_type'] for r in rows], ['block', 'block'])

    def test_with_mutes_keeps_everything(self):
        with zapp.app.test_request_context('/'), patch.object(zapp, 'supabase', self.db):
            rows = zapp.safety_action_rows(1, include_mutes=True)
        self.assertEqual(len(rows), 4)


class WhoIsHiddenIsUnchangedTests(unittest.TestCase):
    """The point of the lookup, pinned either way."""

    def setUp(self):
        zapp.app.config.update(TESTING=True)
        self.db = CountingDB()

    def hidden(self, include_mutes):
        with zapp.app.test_request_context('/'), patch.object(zapp, 'supabase', self.db):
            return zapp.blocked_user_ids_for_viewer(1, [2, 3, 4, 5],
                                                    include_mutes=include_mutes)

    def test_blocks_hide_both_directions(self):
        self.assertEqual(self.hidden(False), {2, 3})

    def test_mutes_hide_only_the_ones_the_viewer_made(self):
        """Being muted by someone else does not hide them from the viewer."""
        self.assertEqual(self.hidden(True), {2, 3, 4})


if __name__ == '__main__':
    unittest.main()

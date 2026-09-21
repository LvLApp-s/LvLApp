"""The rail's leaderboard repairs itself rather than sitting dead.

The panel has been rendering its failure state on pages where the very same
query answers a moment later. Reloading fixed it, which is not a fix. The
failure state now carries a marker, and the script asks the API once for the
rows the server could not get -- from the same partial the page renders, so
there is never a second copy of this list to drift out of step. A second
failure leaves the honest message alone.

Also pinned: the ranking's tie-break. Without one, Postgres is free to return
equal levels in any order, and it does so differently from request to request.
"""
import re
import unittest
from unittest.mock import patch
from pathlib import Path

import app as zapp

ROOT = Path(zapp.__file__).resolve().parent
SCRIPT = (ROOT / "static" / "js" / "script.js").read_text(encoding="utf-8")


def template(name):
    return (ROOT / "templates" / name).read_text(encoding="utf-8")


def repair_handler():
    start = SCRIPT.index("function initLeaderboardRepair()")
    return SCRIPT[start:SCRIPT.index("initLeaderboardRepair();", start)]


class FakeDB:
    def __init__(self, people=3):
        self.people = people
        self.orders = []

    def table(self, name):
        orders = self.orders
        rows = [{'id': i, 'username': f'u{i}', 'display_name': f'User {i}',
                 'level': 1, 'badge_color': '#888', 'profile_photo_url': None,
                 'gender': 'Male', 'bio': ''}
                for i in range(1, self.people + 1)] if name == 'users' else []

        class Q:
            def __init__(self):
                self.stop = None

            def order(self, column, **kwargs):
                orders.append((column, bool(kwargs.get('desc'))))
                return self

            def limit(self, n):
                self.stop = n
                return self

            def __getattr__(self, attr):
                def chain(*args, **kwargs):
                    return self
                return chain

            def execute(inner):
                data = rows[:inner.stop] if rows else []
                return type('R', (), {'data': data, 'count': len(data)})()

        return Q()


class RankingOrderTests(unittest.TestCase):
    def setUp(self):
        zapp.app.config.update(TESTING=True)
        zapp._forced_level_users_cache.update({'at': 0.0, 'users': None})

    def test_equal_levels_are_broken_by_a_stable_column(self):
        db = FakeDB()
        client = zapp.app.test_client()
        with client.session_transaction() as session:
            session['user_id'] = 1
        with patch.object(zapp, 'supabase', db), \
             patch.object(zapp, 'get_home_reel_preview', return_value=[]):
            client.get('/leaderboard')
        self.assertIn(('level', True), db.orders)
        self.assertIn(('id', False), db.orders,
                      "without a tie-break the same person can appear on two "
                      "pages of the list, or on neither")


class LeaderboardApiTests(unittest.TestCase):
    def setUp(self):
        zapp.app.config.update(TESTING=True)
        zapp._forced_level_users_cache.update({'at': 0.0, 'users': None})
        self.client = zapp.app.test_client()
        with self.client.session_transaction() as session:
            session['user_id'] = 1

    def get(self, db):
        with patch.object(zapp, 'supabase', db):
            return self.client.get('/api/leaderboard')

    def test_it_answers_with_the_rows(self):
        response = self.get(FakeDB())
        self.assertEqual(response.status_code, 200)
        body = response.get_json()
        self.assertTrue(body['success'])
        self.assertIn('lb-row', body['html'])

    def test_it_renders_the_same_partial_the_page_does(self):
        """Two copies of this list would drift apart."""
        self.assertIn('{% include "_leaderboard_rows.html" %}', template('layout.html'))
        html = self.get(FakeDB()).get_json()['html']
        self.assertIn('lb-person', html)
        self.assertIn('lb-level-badge', html)

    def test_a_second_failure_is_reported_rather_than_faked(self):
        class Broken:
            def table(self, name):
                raise RuntimeError('still down')

        body = self.get(Broken()).get_json()
        self.assertFalse(body['success'])
        self.assertNotIn('html', body)

    def test_a_signed_out_reader_gets_nothing(self):
        client = zapp.app.test_client()
        with patch.object(zapp, 'supabase', FakeDB()), \
             patch.object(zapp, 'get_current_user', return_value=None):
            self.assertEqual(client.get('/api/leaderboard').status_code, 401)


class RepairMarkupTests(unittest.TestCase):
    def test_the_failure_state_carries_the_marker(self):
        markup = template('layout.html')
        self.assertIn('data-leaderboard-retry', markup)
        self.assertIn('data-leaderboard-panel', markup)
        self.assertIn('data-leaderboard-body', markup)

    def test_only_the_failure_state_carries_it(self):
        """An empty community is not a failure, and asking again would not
        make people appear."""
        markup = template('layout.html')
        empty = markup[markup.index('leaderboard_empty'):]
        self.assertNotIn('data-leaderboard-retry', empty[:400])


class RepairScriptTests(unittest.TestCase):
    def test_it_only_runs_on_the_failure_state(self):
        body = repair_handler()
        self.assertIn("body.querySelector('[data-leaderboard-retry]')", body)

    def test_it_asks_once(self):
        self.assertEqual(repair_handler().count('fetch('), 1)

    def test_a_second_failure_leaves_the_message_alone(self):
        body = repair_handler()
        catch = body[body.index('.catch('):]
        self.assertNotIn('innerHTML', catch)

    def test_the_repaired_rows_get_their_follow_handlers(self):
        """They arrive after load, so nothing would have bound them."""
        self.assertIn('bindAjaxActionForms(body)', repair_handler())

    def test_binding_the_same_form_twice_is_refused(self):
        start = SCRIPT.index('function bindAjaxActionForms(')
        body = SCRIPT[start:start + 400]
        self.assertIn("dataset.ajaxBound === '1'", body)


if __name__ == '__main__':
    unittest.main()

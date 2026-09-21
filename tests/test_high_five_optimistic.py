"""The high-five answers on the click, not after a redirect.

It used to be a plain form post: the browser submitted, the server wrote the
streak, redirected, and the whole profile rendered again before anything on
screen moved. Five or six seconds in which the click looked ignored -- so
people clicked again.

Two halves are pinned here. The route must answer JSON when the page asks for
it, so there is a fast path at all, and it must still redirect for a form post
so the control keeps working without JavaScript. The script must flip the
button before the request goes out, refuse a second send while one is in
flight, and put the button back when the server refuses.
"""
import re
import unittest
from unittest.mock import patch
from pathlib import Path

import app as zapp

ROOT = Path(zapp.__file__).resolve().parent
SCRIPT = (ROOT / "static" / "js" / "script.js").read_text(encoding="utf-8")


def handler():
    """The body of initHighFive, so assertions cannot match other code."""
    start = SCRIPT.index("function initHighFive()")
    end = SCRIPT.index("initHighFive();", start)
    return SCRIPT[start:end]


class FakeDB:
    """Two users and an empty streak table, so a high-five is day one."""

    def __init__(self):
        self.writes = []

    def table(self, name):
        writes = self.writes
        rows = []
        if name == 'users':
            rows = [{'id': 1, 'username': 'viewer', 'display_name': 'Viewer',
                     'level': 1, 'gender': 'Male', 'bio': ''},
                    {'id': 2, 'username': 'target', 'display_name': 'Target',
                     'level': 1, 'gender': 'Male', 'bio': ''}]

        class Q:
            def __init__(self):
                self.eqs = []

            def eq(self, column, value):
                self.eqs.append((column, value))
                return self

            def insert(self, payload):
                writes.append((name, payload))
                return self

            def __getattr__(self, attr):
                def chain(*args, **kwargs):
                    return self
                return chain

            def execute(inner):
                data = rows
                for column, value in inner.eqs:
                    data = [r for r in data if str(r.get(column)) == str(value)]
                return type('R', (), {'data': data, 'count': len(data)})()

        return Q()


class HighFiveRouteTests(unittest.TestCase):
    def setUp(self):
        zapp.app.config.update(TESTING=True)
        self.db = FakeDB()
        self.client = zapp.app.test_client()
        with self.client.session_transaction() as session:
            session['user_id'] = 1
            session['csrf_token'] = 'token'

    def post(self, **extra):
        form = {'csrf_token': 'token'}
        form.update(extra)
        with patch.object(zapp, 'supabase', self.db), \
             patch.object(zapp, 'create_notification', return_value=None):
            return self.client.post('/profile/target/high-five', data=form)

    def test_it_answers_json_when_the_page_asks(self):
        """Without this there is no fast path at all."""
        response = self.post(ajax='1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.mimetype, 'application/json')
        self.assertTrue(response.get_json()['success'])

    def test_the_answer_carries_the_streak_to_reconcile_with(self):
        body = self.post(ajax='1').get_json()
        self.assertIn('streak', body)
        self.assertIsInstance(body['streak'], int)
        self.assertIn('message', body)

    def test_a_plain_form_post_still_redirects(self):
        """The control has to keep working with no JavaScript."""
        response = self.post()
        self.assertEqual(response.status_code, 302)
        self.assertIn('/profile/target', response.headers['Location'])

    def test_high_fiving_yourself_is_refused_in_json_too(self):
        with self.client.session_transaction() as session:
            session['user_id'] = 2
        response = self.post(ajax='1')
        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.get_json()['success'])

    def test_a_blocked_pair_is_refused_in_json_too(self):
        with patch.object(zapp, 'interaction_blocked', return_value=True):
            response = self.post(ajax='1')
        self.assertEqual(response.status_code, 403)
        self.assertFalse(response.get_json()['success'])


class HighFiveScriptTests(unittest.TestCase):
    def test_the_button_is_flipped_before_the_request_goes_out(self):
        """Feedback has to land on the click, not on the response."""
        body = handler()
        flip = body.index("classList.add('is-sent')")
        send = body.index('await fetch(')
        self.assertLess(flip, send,
                        "the sent state is applied after the request, so the "
                        "reader still waits for the network")

    def test_a_second_send_is_refused_while_one_is_in_flight(self):
        body = handler()
        self.assertRegex(body, r"if \(inFlight \|\| button\.dataset\.sent === '1'\) return;")

    def test_a_failure_puts_the_button_back(self):
        body = handler()
        catch = body[body.index('} catch ('):]
        self.assertIn('button.className = before.className', catch)
        self.assertIn("delete button.dataset.sent", catch,
                      "without this the reader cannot retry a failed send")

    def test_a_failure_says_so(self):
        self.assertIn('showAppToast(detail)', handler())

    def test_the_streak_count_is_not_guessed(self):
        """It rises once a day and only if yesterday counted, which the page
        cannot know. It is read from the response instead."""
        body = handler()
        apply_at = body.index('applyStreak(result.streak)')
        send_at = body.index('await fetch(')
        self.assertGreater(apply_at, send_at)


class OtherOptimisticCandidatesTests(unittest.TestCase):
    """The document asked for the rest to be audited and reported, not changed.

    This pins that they were left alone: every other action still waits for
    the server before it moves. If one of them is made optimistic later, this
    test should be updated deliberately rather than drift.
    """

    def test_the_shared_action_handler_still_waits_for_the_server(self):
        start = SCRIPT.index("function bindAjaxActionForms(")
        body = SCRIPT[start:start + 3000]
        response_at = body.index('const result = await response.json();')
        for action in ('like', 'repost', 'bookmark', 'follow', 'mute'):
            with self.subTest(action=action):
                at = body.index("action === '%s'" % action)
                self.assertGreater(at, response_at)


if __name__ == '__main__':
    unittest.main()

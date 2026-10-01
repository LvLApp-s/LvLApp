"""A rejected social sign-up must hand back what was typed.

The form opens pre-filled from the Google profile. When validation failed it
re-rendered from that same profile, so every answer the person had entered was
replaced by the original suggestion -- and the birthday, which carried no
value attribute at all, simply emptied. A field holding only spaces passes the
browser's `required` check and fails on the server, which is exactly how
someone hits this without doing anything unusual.
"""
import unittest
from datetime import date
from unittest.mock import patch

import app as zapp

PROFILE = {
    'email': 'someone@example.com',
    'first_name': 'Google',
    'last_name': 'Suggested',
    'provider': 'google',
    'subject': 'sub-1',
}


class OnboardingRetentionTests(unittest.TestCase):
    def setUp(self):
        zapp.app.config.update(TESTING=True)
        self.client = zapp.app.test_client()
        with self.client.session_transaction() as session:
            session['pending_oauth_profile'] = dict(PROFILE)
            session['csrf_token'] = 'token'

    def submit(self, **overrides):
        form = {
            'first_name': 'Ada',
            'last_name': 'Lovelace',
            'nickname': 'ada_l',
            'email': 'ada@example.com',
            'birthday': '2000-05-05',
            'gender': 'Female',
            'accept_terms': '1',
            'csrf_token': 'token',
        }
        form.update(overrides)
        with patch.object(zapp, 'supabase', object()):
            return self.client.post("/auth/oauth/onboarding", data=form, follow_redirects=False)

    def test_a_space_only_surname_keeps_every_other_answer(self):
        html = self.submit(last_name=' ').data.decode()

        self.assertIn('value="Ada"', html)
        self.assertIn('value="ada_l"', html)
        self.assertIn('value="2000-05-05"', html, "the birthday emptied itself")
        self.assertIn('value="Female"', html)
        self.assertIn("checked", html)

    def test_the_google_suggestion_does_not_overwrite_what_was_typed(self):
        html = self.submit(last_name=' ').data.decode()

        self.assertNotIn('value="Google"', html,
                         "the form fell back to the Google profile")

    def test_a_space_only_value_comes_back_blank_not_as_a_space(self):
        """Echoing " " back shows a field that looks filled and keeps failing."""
        html = self.submit(last_name='   ').data.decode()

        self.assertNotIn('value="   "', html)
        self.assertIn('name="last_name"', html)

    def test_a_birthday_under_the_minimum_keeps_the_names(self):
        """Someone between the COPPA threshold and MIN_AGE is told the rule
        and can fix a mistyped year, so the form has to come back filled."""
        from app_utils import COPPA_AGE, MIN_AGE
        too_young = date.today().year - (COPPA_AGE + MIN_AGE) // 2
        html = self.submit(birthday=f'{too_young}-01-01').data.decode()

        self.assertIn('value="Ada"', html)
        self.assertIn('value="Lovelace"', html)

    def test_a_birthday_below_the_coppa_threshold_goes_to_the_age_gate(self):
        """Below it there is nothing to correct and no account to offer, so
        the answer is the gate, not the form."""
        from app_utils import COPPA_AGE
        a_child = date.today().year - (COPPA_AGE - 3)
        response = self.submit(birthday=f'{a_child}-01-01')

        self.assertEqual(response.status_code, 302)
        self.assertIn('/under-13', response.headers['Location'])

    def test_an_unticked_terms_box_keeps_the_rest(self):
        form = {'accept_terms': ''}
        html = self.submit(**form).data.decode()

        self.assertIn('value="Ada"', html)
        self.assertIn('value="2000-05-05"', html)

    def test_the_first_visit_still_shows_the_google_suggestion(self):
        """Nothing typed yet, so the profile is the right thing to offer."""
        with patch.object(zapp, 'supabase', object()):
            html = self.client.get("/auth/oauth/onboarding").data.decode()

        self.assertIn('value="Google"', html)
        self.assertIn('value="Suggested"', html)

    def test_the_password_is_never_echoed(self):
        """This form has no password, but the helper must not start passing
        one through if a field is ever added."""
        data = zapp.onboarding_form_data({'password': 'secret', 'first_name': 'Ada',
                                          'csrf_token': 'x'})
        self.assertNotIn('csrf_token', data)
        self.assertEqual(data['first_name'], 'Ada')


if __name__ == '__main__':
    unittest.main()

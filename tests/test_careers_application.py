"""An application must reach the table, on a host with no writable disk.

The form took a CV file and wrote it to static/uploads/cvs/ with
cv_file.save(). The serverless filesystem is read-only, so that call raised --
and it ran before the insert, with nothing catching it, so the candidate saw a
500 and the application never reached job_applications at all. It asks for a
link now: nothing is written to disk, so there is nothing left to fail.
"""
import unittest
from unittest.mock import patch

import app as zapp


class Result:
    def __init__(self, data=None):
        self.data = data or []


class FakeTable:
    def __init__(self, db, name):
        self.db, self.name, self.values = db, name, None

    def select(self, *_a, **_k):
        return self

    def insert(self, values):
        self.values = values
        return self

    def eq(self, *_a):
        return self

    def limit(self, *_a):
        return self

    def execute(self):
        self.db.calls.append((self.name, self.values))
        if self.db.broken_insert and self.values is not None:
            raise RuntimeError('job_applications unavailable')
        if self.name == 'job_positions' and self.values is None:
            return Result([{'id': '33333333-3333-3333-3333-333333333333'}])
        return Result([self.values or {}])


class FakeSupabase:
    def __init__(self, broken_insert=False):
        self.calls = []
        self.broken_insert = broken_insert

    def table(self, name):
        return FakeTable(self, name)


class CareersApplicationTests(unittest.TestCase):
    viewer = {'id': 7, 'username': 'demo', 'display_name': 'Demo', 'email': 'demo@example.com'}

    def setUp(self):
        zapp.app.config.update(TESTING=True)
        self.client = zapp.app.test_client()
        with self.client.session_transaction() as session:
            session['csrf_token'] = 'token'

    def submit(self, db=None, **overrides):
        form = {
            'csrf_token': 'token',
            'name': 'Ada Lovelace',
            'email': 'ada@example.com',
            'position': 'Engineer',
            'message': 'I would like to help build LvL.',
            'portfolio_url': 'linkedin.com/in/ada',
        }
        form.update(overrides)
        db = db if db is not None else FakeSupabase()
        with patch.object(zapp, 'get_current_user', return_value=dict(self.viewer)), \
             patch.object(zapp, 'supabase', db):
            response = self.client.post('/careers', data=form, follow_redirects=False)
        return response, db

    def inserted(self, db):
        return next(values for name, values in db.calls
                    if name == 'job_applications' and values)

    def test_an_application_reaches_the_table(self):
        response, db = self.submit()
        self.assertEqual(response.status_code, 302)
        row = self.inserted(db)
        self.assertEqual(row['name'], 'Ada Lovelace')
        self.assertEqual(row['email'], 'ada@example.com')
        self.assertEqual(row['position_title'], 'Engineer')
        self.assertEqual(row['portfolio_url'], 'https://linkedin.com/in/ada')

    def test_nothing_is_written_to_disk(self):
        """The whole point: no save(), no makedirs(), no uploads path.

        Comments are stripped first -- the handler explains in prose why the
        upload is gone, and that explanation must not read as the thing it
        is warning about.
        """
        import inspect
        import re
        source = inspect.getsource(zapp.careers)
        code = '\n'.join(re.sub(r'#.*$', '', line) for line in source.splitlines())
        for forbidden in ('.save(', 'makedirs', 'uploads'):
            with self.subTest(call=forbidden):
                self.assertNotIn(forbidden, code)

    def test_a_missing_link_is_refused(self):
        response, db = self.submit(portfolio_url='')
        self.assertEqual(response.status_code, 302)
        self.assertEqual([c for c in db.calls if c[0] == 'job_applications'], [])

    def test_a_link_that_is_not_a_web_address_is_refused(self):
        for bad in ('javascript:alert(1)', 'data:text/html,x', 'not a link', 'ftp://x.com'):
            with self.subTest(link=bad):
                _, db = self.submit(portfolio_url=bad)
                self.assertEqual([c for c in db.calls if c[0] == 'job_applications'], [])

    def test_a_bad_email_is_refused(self):
        _, db = self.submit(email='not-an-email')
        self.assertEqual([c for c in db.calls if c[0] == 'job_applications'], [])

    def test_a_failed_insert_does_not_claim_success(self):
        """It used to log the error and flash "submitted successfully", so the
        candidate left believing they had applied."""
        response, _ = self.submit(db=FakeSupabase(broken_insert=True))
        self.assertEqual(response.status_code, 302)
        with self.client.session_transaction() as session:
            flashes = session.get('_flashes', [])
        self.assertTrue(flashes)
        category, message = flashes[-1]
        self.assertEqual(category, 'error')
        self.assertNotIn('success', message.lower())

    def test_the_link_field_accepts_what_the_hint_asks_for(self):
        """type="url" refuses a bare host, so the browser blocked the very
        thing the hint tells people to paste -- the form could not be
        submitted at all with "linkedin.com/in/you" in it."""
        from pathlib import Path
        markup = Path('templates/careers.html').read_text(encoding='utf-8')
        field = markup.split('name="portfolio_url"', 1)[0].rsplit('<input', 1)[1]
        self.assertNotIn('type="url"', field)
        # And the server does accept it, which is what makes that safe.
        self.assertEqual(zapp.normalise_web_link('linkedin.com/in/you'),
                         'https://linkedin.com/in/you')

    def test_the_form_no_longer_asks_for_a_file(self):
        from pathlib import Path
        markup = Path('templates/careers.html').read_text(encoding='utf-8')
        self.assertNotIn('type="file"', markup)
        self.assertNotIn('enctype="multipart/form-data"', markup)
        self.assertIn('name="portfolio_url"', markup)


class WebLinkTests(unittest.TestCase):
    def test_a_bare_host_gets_a_scheme(self):
        self.assertEqual(zapp.normalise_web_link('github.com/ada'),
                         'https://github.com/ada')

    def test_an_existing_scheme_is_kept(self):
        self.assertEqual(zapp.normalise_web_link('http://example.com/x'),
                         'http://example.com/x')

    def test_only_http_and_https_are_accepted(self):
        for bad in ('javascript:alert(1)', 'data:text/html,x', 'file:///etc/passwd',
                    'ftp://example.com'):
            with self.subTest(link=bad):
                self.assertIsNone(zapp.normalise_web_link(bad))

    def test_something_that_is_not_a_host_is_refused(self):
        for bad in ('', '   ', 'hello world', 'localhost', 'https://'):
            with self.subTest(link=bad):
                self.assertIsNone(zapp.normalise_web_link(bad))

    def test_an_absurdly_long_link_is_refused(self):
        self.assertIsNone(zapp.normalise_web_link('https://x.com/' + 'a' * 600))


if __name__ == '__main__':
    unittest.main()

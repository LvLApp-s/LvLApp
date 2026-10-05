"""Why a photo sent in a message fails, said out loud.

The attachment bucket is private. Signing an upload for it, and reading an
object back out of it, need the service role key -- but get_bucket() answers
with the anon key too. So the setup page could show the bucket as available
while every photo sent in a message failed, and nothing said why.

Also pinned: a bucket lookup that fails for its own reasons must not be
turned into "bucket already exists" by the create that followed it, which is
how an upload got refused because of a bucket that was there all along.
"""
import unittest
from unittest.mock import patch

import app as zapp


def health(storage, env=None):
    class DB:
        def __init__(self):
            self.storage = storage

        def table(self, name):
            class Q:
                def __getattr__(self, attr):
                    def chain(*args, **kwargs):
                        return self
                    return chain

                def execute(self):
                    return type('R', (), {'data': [], 'count': 0})()
            return Q()

    with zapp.app.test_request_context('/setup/health'), \
         patch.object(zapp, 'supabase', DB()), \
         patch.dict('os.environ', env or {}, clear=False):
        return {c['label']: c for c in zapp.get_setup_health()}


class SigningStorage:
    def __init__(self, signs=True, error=None):
        self.signs = signs
        self.error = error

    def get_bucket(self, name):
        return {'name': name}

    def from_(self, name):
        outer = self

        class Bucket:
            def create_signed_upload_url(self, path):
                if outer.error:
                    raise Exception(outer.error)
                if not outer.signs:
                    return {}
                return {'signedUrl': 'https://example.test/upload?token=x'}
        return Bucket()


class AttachmentUploadHealthTests(unittest.TestCase):
    def test_a_working_setup_reports_ready(self):
        checks = health(SigningStorage())
        self.assertEqual(checks['Message attachment upload']['status'], 'ready')

    def test_a_bucket_that_cannot_be_signed_for_is_caught(self):
        """This is the case the bucket check alone could not see."""
        checks = health(SigningStorage(error='new row violates row-level security policy'))
        self.assertEqual(checks['Private attachment bucket']['status'], 'ready')
        self.assertEqual(checks['Message attachment upload']['status'], 'needs_attention')

    def test_no_upload_url_is_treated_as_a_failure(self):
        checks = health(SigningStorage(signs=False))
        self.assertEqual(checks['Message attachment upload']['status'], 'needs_attention')

    def test_the_anon_key_alone_is_called_out(self):
        with patch.object(zapp, 'env_value_present', lambda name: name != 'SUPABASE_SECRET'):
            checks = health(SigningStorage())
        check = checks['Supabase service role key']
        self.assertEqual(check['status'], 'needs_attention')
        self.assertIn('SUPABASE_SECRET', check['detail'])

    def test_the_probe_writes_nothing(self):
        """Signing creates no object, so the check leaves no file behind."""
        touched = []

        class Recording(SigningStorage):
            def from_(self, name):
                class Bucket:
                    def create_signed_upload_url(self, path):
                        return {'signedUrl': 'https://example.test/upload?token=x'}

                    def upload(self, *args, **kwargs):
                        touched.append('upload')

                    def remove(self, *args, **kwargs):
                        touched.append('remove')
                return Bucket()

        health(Recording())
        self.assertEqual(touched, [])


class BucketLookupTests(unittest.TestCase):
    """A failed lookup is not evidence that the bucket is missing."""

    def setUp(self):
        self.created = []

    def storage(self, lookup_error, create_error=None):
        created = self.created

        class Storage:
            def get_bucket(self, name):
                raise Exception(lookup_error)

            def create_bucket(self, name, options=None):
                created.append(name)
                if create_error:
                    raise Exception(create_error)

        class DB:
            storage = Storage()
        return DB()

    def test_a_bucket_that_already_exists_is_not_an_error(self):
        db = self.storage('connection reset', create_error='The resource already exists')
        with patch.object(zapp, 'supabase', db):
            zapp.ensure_media_bucket('b', 10, ['image/png'])  # must not raise
        self.assertEqual(self.created, ['b'])

    def test_a_duplicate_is_not_an_error_either(self):
        db = self.storage('timeout', create_error='duplicate key value')
        with patch.object(zapp, 'supabase', db):
            zapp.ensure_media_bucket('b', 10, ['image/png'])

    def test_a_real_creation_failure_still_raises(self):
        db = self.storage('timeout', create_error='permission denied')
        with patch.object(zapp, 'supabase', db):
            with self.assertRaises(Exception):
                zapp.ensure_media_bucket('b', 10, ['image/png'])

    def test_a_bucket_that_reads_back_is_left_alone(self):
        created = []

        class Storage:
            def get_bucket(self, name):
                return {'name': name}

            def create_bucket(self, name, options=None):
                created.append(name)

        class DB:
            storage = Storage()

        with patch.object(zapp, 'supabase', DB()):
            zapp.ensure_media_bucket('b', 10, ['image/png'])
        self.assertEqual(created, [], "an existing bucket must not be recreated")


if __name__ == '__main__':
    unittest.main()

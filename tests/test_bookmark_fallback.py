"""A saved clip that was not saved must not report success.

When the reel_bookmarks table is unavailable the code falls back to a JSON
file on disk. On the serverless host that write fails, the failure was
swallowed, and the caller returned True -- so the button filled in, the toast
said saved, and the next page load disagreed.
"""
import unittest
from unittest.mock import patch

import app as zapp


class BrokenTable:
    def table(self, name):
        raise RuntimeError('reel_bookmarks unavailable')


class BookmarkFallbackTests(unittest.TestCase):
    def test_a_failed_mirror_write_is_reported(self):
        with patch.object(zapp, 'supabase', BrokenTable()), \
             patch.object(zapp, '_save_local_reel_bookmarks', return_value=False), \
             patch.object(zapp, '_load_local_reel_bookmarks', return_value={}):
            with self.assertRaises(RuntimeError):
                zapp.toggle_reel_bookmark_record(1, 7)

    def test_a_successful_mirror_write_still_toggles(self):
        store = {}

        def save(data):
            store.update(data)
            return True

        with patch.object(zapp, 'supabase', BrokenTable()), \
             patch.object(zapp, '_save_local_reel_bookmarks', side_effect=save), \
             patch.object(zapp, '_load_local_reel_bookmarks', side_effect=lambda: dict(store)):
            self.assertIs(zapp.toggle_reel_bookmark_record(1, 7), True)
            self.assertIs(zapp.toggle_reel_bookmark_record(1, 7), False)

    def test_the_mirror_is_off_in_production(self):
        """A read-only filesystem cannot hold it, so there is nothing to
        pretend with."""
        self.assertFalse(zapp.env_truthy(None, default=not zapp.is_production_runtime(
            {'VERCEL_ENV': 'production'})))


if __name__ == '__main__':
    unittest.main()

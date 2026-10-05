"""A changed stylesheet must reach the reader who already has the old one.

vercel.json caches /static/* at the edge for a year, so the URL is the only
thing that can retire a cached copy. The ?v= on it was ASSET_VERSION: one
hand-maintained number for every asset, changed only when somebody remembered
to. Five commits of CSS shipped at ?v=203 -- each built, tested and pushed,
and each invisible, because the browser and the CDN both already held a
bundle.css?v=203 and had no reason to ask for another.
"""
import re
import unittest
from pathlib import Path

import app as zapp

STATIC = Path(zapp.app.static_folder)


class AssetFingerprintTests(unittest.TestCase):
    def setUp(self):
        zapp._ASSET_FINGERPRINTS.clear()

    def url(self, filename):
        with zapp.app.test_request_context('/'):
            return zapp.static_asset_url(filename)

    def test_the_version_comes_from_the_file_not_a_constant(self):
        url = self.url('css/bundle.css')
        version = re.search(r'\?v=([^&]+)$', url).group(1)
        self.assertNotEqual(version, zapp.ASSET_VERSION,
                            "still the hand-maintained number")
        self.assertRegex(version, r'^[0-9a-f]{10}$')

    def test_two_different_files_get_two_different_versions(self):
        """One number for everything meant a JS change could not retire a
        stale stylesheet, and vice versa."""
        css = self.url('css/bundle.css')
        js = self.url('js/script.js')
        self.assertNotEqual(re.search(r'\?v=(.+)$', css).group(1),
                            re.search(r'\?v=(.+)$', js).group(1))

    def test_editing_a_file_changes_its_url(self):
        """The whole point: a reader holding the old copy is sent to a new
        address, so the edit is the thing they see."""
        target = STATIC / 'css' / 'bundle.css'
        original = target.read_bytes()
        before = self.url('css/bundle.css')
        try:
            target.write_bytes(original + b'\n/* a change */\n')
            after = self.url('css/bundle.css')
        finally:
            target.write_bytes(original)
        self.assertNotEqual(before, after)
        # And putting it back puts the old address back, so a revert does not
        # leave readers on a URL nothing will ever serve again.
        self.assertEqual(before, self.url('css/bundle.css'))

    def test_a_file_that_is_not_there_still_gets_a_version(self):
        """A missing file must not raise in a template."""
        url = self.url('css/no-such-file.css')
        self.assertIn(f'v={zapp.ASSET_VERSION}', url)

    def test_the_fingerprint_is_not_recomputed_for_every_link(self):
        """Layout asks for five of these on every render of every page."""
        self.url('css/bundle.css')
        stamp = zapp._ASSET_FINGERPRINTS['css/bundle.css']
        self.url('css/bundle.css')
        self.assertIs(zapp._ASSET_FINGERPRINTS['css/bundle.css'], stamp)

    def test_every_asset_the_layout_links_is_fingerprinted(self):
        """A link that skips static_asset() keeps the old caching bug."""
        layout = Path('templates/layout.html').read_text(encoding='utf-8')
        for link in re.findall(r'(?:href|src)="(/static/[^"]+)"', layout):
            with self.subTest(asset=link):
                self.fail(f'{link} bypasses static_asset(), so it cannot be '
                          f'cache-busted')


if __name__ == '__main__':
    unittest.main()

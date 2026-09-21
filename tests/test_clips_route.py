"""The navigation says Clips, so the URL says /clips.

Renaming a live path is only safe while the old one keeps working: people have
bookmarked /reels, shared it in messages, and the service worker may have
cached it. These tests pin both halves -- the new path serves the page, the old
one redirects to it -- and that no link anywhere still points at the old path.
"""
import re
import unittest
from pathlib import Path

import app as zapp

ROOT = Path(zapp.__file__).resolve().parent


class ClipsRouteTests(unittest.TestCase):
    def setUp(self):
        zapp.app.config.update(TESTING=True)
        self.client = zapp.app.test_client()

    def rules(self, endpoint):
        return sorted(str(r) for r in zapp.app.url_map.iter_rules() if r.endpoint == endpoint)

    def test_the_page_lives_at_clips(self):
        self.assertEqual(self.rules('reels'), ['/clips'])

    def test_every_reel_action_moved_too(self):
        """A half-renamed feature is worse than either name."""
        for endpoint in ('reel_upload', 'toggle_reel_like', 'add_reel_comment',
                         'record_reel_view'):
            with self.subTest(endpoint=endpoint):
                paths = self.rules(endpoint)
                self.assertTrue(paths, f"{endpoint} has no route")
                for path in paths:
                    self.assertTrue(path.startswith('/clips'),
                                    f"{endpoint} still answers on {path}")

    def test_url_for_builds_the_new_path(self):
        """The templates all call url_for, so this is what every link becomes."""
        with zapp.app.test_request_context('/'):
            from flask import url_for
            self.assertEqual(url_for('reels'), '/clips')
            self.assertEqual(url_for('reel_upload'), '/clips/upload')

    def test_an_old_link_still_arrives(self):
        for old, new in (('/reels', '/clips'), ('/reels/upload', '/clips/upload')):
            with self.subTest(path=old):
                response = self.client.get(old)
                self.assertEqual(response.status_code, 301)
                self.assertTrue(response.headers['Location'].endswith(new),
                                response.headers['Location'])

    def test_an_old_link_keeps_its_query(self):
        """/reels?tab=following is a real link people have."""
        response = self.client.get('/reels?tab=following')
        self.assertEqual(response.status_code, 301)
        self.assertIn('tab=following', response.headers['Location'])

    def test_nothing_still_hardcodes_the_old_path(self):
        script = (ROOT / 'static' / 'js' / 'script.js').read_text(encoding='utf-8')
        self.assertNotIn('/reels', script)
        for template in sorted((ROOT / 'templates').glob('*.html')):
            text = template.read_text(encoding='utf-8')
            with self.subTest(template=template.name):
                self.assertNotRegex(text, r'href="/reels', "hardcoded old path")

    def test_the_installed_app_shortcut_points_at_clips(self):
        """A PWA shortcut that redirects costs an extra round trip on launch,
        and the tile would still be labelled Reels."""
        import json
        manifest = json.loads((ROOT / 'static' / 'manifest.json').read_text(encoding='utf-8'))
        urls = [s['url'] for s in manifest.get('shortcuts', [])]
        self.assertIn('/clips', urls)
        self.assertNotIn('/reels', urls)

    def test_the_label_and_the_path_finally_agree(self):
        layout = (ROOT / 'templates' / 'layout.html').read_text(encoding='utf-8')
        self.assertIn("url_for('reels')", layout)
        self.assertIn('nav_clips', layout)


if __name__ == '__main__':
    unittest.main()

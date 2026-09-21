"""The rail explains levelling instead of repeating the navigation.

The panel it replaced linked to Clips, Community, Activity and Saved -- the
same four destinations the left rail already offers, on nine pages. Meanwhile
the product is built entirely on levels and nothing anywhere said how to
climb: XP_REWARD_RULES had sat in app.py unused.
"""
import re
import unittest
from pathlib import Path
from unittest.mock import patch

import app as zapp

ROOT = Path(zapp.__file__).resolve().parent
PANEL = (ROOT / "templates" / "_engagement_panel.html").read_text(encoding="utf-8")
CSS = (ROOT / "static" / "css" / "sections" / "community-highlights.css").read_text(encoding="utf-8")

VIEWER = {'id': 1, 'username': 'me', 'display_name': 'Me', 'level': 3,
          'total_xp': 120, 'gender': 'Male', 'bio': '', 'profile_photo_url': None}


class FakeDB:
    def table(self, name):
        rows = [dict(VIEWER)] if name == 'users' else []

        class Q:
            def __getattr__(self, attr):
                def chain(*args, **kwargs):
                    return self
                return chain

            def execute(inner):
                return type('R', (), {'data': rows, 'count': len(rows)})()

        return Q()


class RenderedPanelTests(unittest.TestCase):
    def setUp(self):
        zapp.app.config.update(TESTING=True)
        zapp._forced_level_users_cache.update({'at': 0.0, 'users': None})
        self.client = zapp.app.test_client()
        with self.client.session_transaction() as session:
            session['user_id'] = 1

    def render(self, path='/settings'):
        with patch.object(zapp, 'supabase', FakeDB()), \
             patch.object(zapp, 'get_home_reel_preview', return_value=[]):
            return self.client.get(path).data.decode()

    def test_the_old_shortcut_panel_is_gone(self):
        html = self.render()
        self.assertNotIn('engagement-actions', html)
        self.assertNotIn('quick_loops', html)

    def test_it_shows_where_you_stand(self):
        html = self.render()
        self.assertIn('levelup-standing', html)
        self.assertIn('LvL 3', html)
        self.assertIn('role="progressbar"', html)

    def test_it_says_what_is_left_to_the_next_level(self):
        html = self.render()
        self.assertIn('levelup_to_next', html)
        self.assertIn('levelup-remaining', html)

    def test_it_lists_every_way_to_earn(self):
        html = self.render()
        rules = re.findall(r'<li>\s*<span data-i18n="(xp_rule_[a-z_]+)"', html)
        self.assertEqual(len(rules), len(zapp.XP_REWARD_RULES))
        self.assertEqual(rules, [rule['key'] for rule in zapp.XP_REWARD_RULES])

    def test_the_points_come_from_the_rules(self):
        html = self.render()
        for rule in zapp.XP_REWARD_RULES:
            with self.subTest(rule=rule['key']):
                self.assertIn(f"+{rule['points']}", html)

    def test_it_names_the_next_unlock(self):
        html = self.render()
        self.assertIn('levelup-reward', html)
        self.assertIn('levelup_unlocks_at', html)

    def test_a_signed_out_page_renders_without_it(self):
        """level_progress returns None with no viewer; the panel must not
        render half of itself."""
        with zapp.app.test_request_context('/'):
            self.assertIsNone(zapp.level_progress(None))

    def test_it_replaced_the_panel_everywhere_not_just_settings(self):
        for path in ('/settings', '/activity', '/notifications'):
            with self.subTest(path=path):
                html = self.render(path)
                self.assertNotIn('engagement-actions', html)
                self.assertIn('levelup-panel', html)


class RuleDataTests(unittest.TestCase):
    def test_every_rule_carries_a_translation_key(self):
        for rule in zapp.XP_REWARD_RULES:
            with self.subTest(rule=rule['label']):
                self.assertIn('key', rule)
                self.assertTrue(rule['key'].startswith('xp_rule_'))

    def test_every_key_is_translated_in_every_language(self):
        i18n = (ROOT / 'static' / 'js' / 'i18n.js').read_text(encoding='utf-8')
        for rule in zapp.XP_REWARD_RULES:
            with self.subTest(rule=rule['key']):
                self.assertEqual(i18n.count(f"{rule['key']}:"), 3,
                                 'missing from a language')

    def test_the_rules_reach_the_template(self):
        with zapp.app.test_request_context('/'):
            self.assertIn('xp_rules', zapp.inject_helpers())

    def test_the_points_are_positive(self):
        for rule in zapp.XP_REWARD_RULES:
            with self.subTest(rule=rule['key']):
                self.assertGreater(rule['points'], 0)


class PanelStyleTests(unittest.TestCase):
    def test_the_old_styles_are_gone(self):
        self.assertNotIn('.engagement-actions', CSS)
        self.assertNotIn('.engagement-panel', CSS)

    def test_the_progress_bar_respects_reduced_motion(self):
        blocks = re.findall(r'@media \(prefers-reduced-motion: reduce\)\s*\{(.*?)\n\}',
                            CSS, re.S)
        self.assertTrue(any('.levelup-track' in block for block in blocks),
                        'the bar animates even when motion is turned down')

    def test_the_numbers_line_up(self):
        rule = re.search(r'\.levelup-rules b\s*\{([^}]*)\}', CSS)
        self.assertIsNotNone(rule)
        self.assertIn('tabular-nums', rule.group(1))


if __name__ == '__main__':
    unittest.main()

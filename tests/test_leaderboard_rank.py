"""Every leaderboard shows the same rank, and the top three are told apart.

The list arrives ordered by level, so the loop index is the rank and a new
member lands in the right place with no extra work. What needed pinning is
that both leaderboards render it from the same macro -- they had drifted
before, with the community page numbering its rows and the rail not
numbering at all -- and that the medal styling is driven by the rank rather
than by hand-written markup.
"""
import re
import unittest
from unittest.mock import patch
from pathlib import Path

import app as zapp

ROOT = Path(zapp.__file__).resolve().parent
MACRO = ROOT / "templates" / "_leaderboard_rank.html"
CSS = (ROOT / "static" / "css" / "sections" / "community-highlights.css").read_text(encoding="utf-8")
TOKENS = (ROOT / "static" / "css" / "sections" / "base.css").read_text(encoding="utf-8")

PEOPLE = [
    {'id': i, 'username': f'u{i}', 'display_name': f'User {i}', 'level': 20 - i,
     'badge_color': '#888', 'profile_photo_url': None, 'gender': 'Male', 'bio': ''}
    for i in range(1, 7)
]


class FakeDB:
    def table(self, name):
        rows = [dict(p) for p in PEOPLE] if name == 'users' else []

        class Q:
            def __getattr__(self, attr):
                def chain(*args, **kwargs):
                    return self
                return chain

            def execute(inner):
                return type('R', (), {'data': rows, 'count': len(rows)})()

        return Q()


class RenderedRankTests(unittest.TestCase):
    def setUp(self):
        zapp.app.config.update(TESTING=True)
        zapp._forced_level_users_cache.update({'at': 0.0, 'users': None})
        self.client = zapp.app.test_client()
        with self.client.session_transaction() as session:
            session['user_id'] = 1

    def render(self, path):
        with patch.object(zapp, 'supabase', FakeDB()), \
             patch.object(zapp, 'get_home_reel_preview', return_value=[]):
            return self.client.get(path).data.decode()

    def ranks(self, html):
        return re.findall(r'<span class="lb-rank[^"]*"\s+data-rank="(\d+)"[^>]*>([^<]*)</span>',
                          html)

    def test_the_rail_numbers_every_row(self):
        found = self.ranks(self.render('/settings'))
        self.assertEqual([r for r, _ in found], ['1', '2', '3', '4', '5', '6'])

    def test_the_top_three_show_a_bare_number(self):
        found = dict(self.ranks(self.render('/settings')))
        for position in ('1', '2', '3'):
            with self.subTest(rank=position):
                self.assertEqual(found[position].strip(), position)

    def test_fourth_down_is_prefixed(self):
        found = dict(self.ranks(self.render('/settings')))
        for position in ('4', '5', '6'):
            with self.subTest(rank=position):
                self.assertEqual(found[position].strip(), f'#{position}')

    def test_only_the_top_three_carry_a_medal(self):
        html = self.render('/settings')
        medals = re.findall(r'class="lb-rank lb-rank-medal"\s+data-rank="(\d+)"', html)
        self.assertEqual(medals, ['1', '2', '3'])

    def test_the_rank_is_announced(self):
        self.assertIn('aria-label="Rank 1"', self.render('/settings'))

    def test_the_list_grows_with_the_membership(self):
        """A new member needs no change here: the query orders by level and
        the loop index is the rank."""
        html = self.render('/settings')
        self.assertEqual(len(self.ranks(html)), len(PEOPLE))


class SharedMacroTests(unittest.TestCase):
    def test_both_leaderboards_use_the_macro(self):
        for name in ('layout.html', 'community.html'):
            text = (ROOT / 'templates' / name).read_text(encoding='utf-8')
            with self.subTest(template=name):
                self.assertIn('leaderboard_rank(loop.index)', text)
                self.assertIn('_leaderboard_rank.html', text)

    def test_no_leaderboard_writes_its_own_rank(self):
        """The community page used to number its rows by hand."""
        for template in sorted((ROOT / 'templates').glob('*.html')):
            text = template.read_text(encoding='utf-8')
            with self.subTest(template=template.name):
                self.assertNotIn('class="leaderboard-rank"', text)

    def test_the_macro_decides_the_medal_from_the_rank(self):
        text = MACRO.read_text(encoding='utf-8')
        self.assertIn('position <= 3', text)
        self.assertIn('data-rank', text)


class RankStyleTests(unittest.TestCase):
    def test_each_medal_has_its_own_colour(self):
        for position, token in ((1, 'gold'), (2, 'silver'), (3, 'bronze')):
            with self.subTest(rank=position):
                rule = re.search(r'\.lb-rank\[data-rank="%d"\]\s*\{([^}]*)\}' % position, CSS)
                self.assertIsNotNone(rule, f'rank {position} has no style')
                self.assertIn(f'--rank-{token}', rule.group(1))

    def test_the_medal_colours_are_tokens_in_both_themes(self):
        """Sections may not carry hex; the palette flips in base.css."""
        for token in ('--rank-gold', '--rank-silver', '--rank-bronze'):
            with self.subTest(token=token):
                self.assertGreaterEqual(TOKENS.count(f'{token}:'), 2,
                                        'missing a light-theme value')

    def test_the_numbers_do_not_shift_the_row(self):
        rule = re.search(r'\.lb-rank\s*\{([^}]*)\}', CSS)
        self.assertIsNotNone(rule)
        self.assertIn('tabular-nums', rule.group(1),
                      '#9 and #10 would be different widths')

    def test_the_dropped_class_left_no_css(self):
        self.assertNotIn('.leaderboard-rank', CSS)


if __name__ == '__main__':
    unittest.main()

"""The rail previews the leaderboard; the leaderboard page is the whole list.

Ranking is a property of the query -- people come back ordered by level, so
the position in the list is the rank and a new account lands where its level
puts it with nothing else to do. What needs pinning is the split: the rail
must stay a short preview on every page, the dedicated page must go past it,
and the rank must keep counting across pages rather than restarting at 1.
"""
import re
import unittest
from unittest.mock import patch
from pathlib import Path

import app as zapp

ROOT = Path(zapp.__file__).resolve().parent

# More people than the rail shows and more than one page holds, so both
# boundaries are exercised.
TOTAL = 120


def person(index):
    return {'id': index, 'username': f'u{index}', 'display_name': f'User {index}',
            'level': max(1, TOTAL - index), 'badge_color': '#888',
            'profile_photo_url': None, 'gender': 'Male', 'bio': ''}


class FakeDB:
    """Serves the users table in level order, honouring limit and range."""

    def __init__(self):
        self.last = {}

    def table(self, name):
        state = self.last
        rows = [person(i) for i in range(1, TOTAL + 1)] if name == 'users' else []

        class Q:
            def __init__(self):
                self.start = 0
                self.stop = None

            def limit(self, n):
                state['limit'] = n
                self.stop = n
                return self

            def range(self, start, end):
                state['range'] = (start, end)
                self.start = start
                self.stop = end + 1
                return self

            def __getattr__(self, attr):
                def chain(*args, **kwargs):
                    return self
                return chain

            def execute(inner):
                sliced = rows[inner.start:inner.stop] if rows else []
                return type('R', (), {'data': sliced, 'count': len(sliced)})()

        return Q()


class RailPreviewTests(unittest.TestCase):
    def setUp(self):
        zapp.app.config.update(TESTING=True)
        zapp._forced_level_users_cache.update({'at': 0.0, 'users': None})
        self.db = FakeDB()
        self.client = zapp.app.test_client()
        with self.client.session_transaction() as session:
            session['user_id'] = 1

    def render(self, path):
        with patch.object(zapp, 'supabase', self.db), \
             patch.object(zapp, 'get_home_reel_preview', return_value=[]):
            return self.client.get(path).data.decode()

    def rail_rows(self, html):
        # The page's own rows carry `lb-row lb-page-row`, so this exact string
        # only matches the rail's.
        return html.count('class="lb-row"')

    def test_the_rail_shows_a_short_preview(self):
        """Not the whole membership on every page."""
        self.assertEqual(self.rail_rows(self.render('/settings')),
                         zapp.LEADERBOARD_RAIL_LIMIT)

    def test_the_preview_is_the_same_everywhere(self):
        for path in ('/', '/settings', '/bookmarks'):
            with self.subTest(path=path):
                self.assertEqual(self.rail_rows(self.render(path)),
                                 zapp.LEADERBOARD_RAIL_LIMIT)

    def test_the_preview_limit_is_modest(self):
        self.assertLessEqual(zapp.LEADERBOARD_RAIL_LIMIT, 10)


class LeaderboardPageTests(unittest.TestCase):
    def setUp(self):
        zapp.app.config.update(TESTING=True)
        zapp._forced_level_users_cache.update({'at': 0.0, 'users': None})
        self.db = FakeDB()
        self.client = zapp.app.test_client()
        with self.client.session_transaction() as session:
            session['user_id'] = 1

    def render(self, path):
        with patch.object(zapp, 'supabase', self.db), \
             patch.object(zapp, 'get_home_reel_preview', return_value=[]):
            return self.client.get(path).data.decode()

    def ranks(self, html):
        return [int(n) for n in re.findall(r'data-rank="(\d+)"', html)]

    def test_it_goes_well_past_the_rail_preview(self):
        ranks = self.ranks(self.render('/leaderboard'))
        self.assertEqual(len(ranks), zapp.LEADERBOARD_PAGE_SIZE)
        self.assertGreater(len(ranks), zapp.LEADERBOARD_RAIL_LIMIT)

    def test_the_first_page_starts_at_one(self):
        self.assertEqual(self.ranks(self.render('/leaderboard'))[:3], [1, 2, 3])

    def test_the_rank_keeps_counting_on_the_next_page(self):
        """Restarting at 1 would make two people share a position."""
        ranks = self.ranks(self.render('/leaderboard?page=2'))
        self.assertEqual(ranks[0], zapp.LEADERBOARD_PAGE_SIZE + 1)
        self.assertEqual(ranks, list(range(ranks[0], ranks[0] + len(ranks))))

    def test_it_asks_the_database_for_the_right_slice(self):
        self.render('/leaderboard?page=3')
        start, end = self.db.last['range']
        self.assertEqual(start, 2 * zapp.LEADERBOARD_PAGE_SIZE)
        self.assertEqual(end - start + 1, zapp.LEADERBOARD_PAGE_SIZE)

    def test_the_last_page_offers_no_next(self):
        html = self.render('/leaderboard?page=3')   # 120 people, 50 a page
        self.assertNotIn('page=4', html)
        self.assertIn('page=2', html)

    def test_everyone_is_reachable(self):
        seen = []
        for page in (1, 2, 3):
            seen.extend(self.ranks(self.render(f'/leaderboard?page={page}')))
        self.assertEqual(seen, list(range(1, TOTAL + 1)))

    def test_signed_out_readers_are_sent_to_sign_in(self):
        client = zapp.app.test_client()
        with patch.object(zapp, 'supabase', self.db):
            response = client.get('/leaderboard')
        self.assertEqual(response.status_code, 302)
        self.assertIn('/auth', response.headers['Location'])

    def test_the_page_does_not_repeat_the_rail_panel(self):
        """The rail preview beside the full list would be the same names twice."""
        html = self.render('/leaderboard')
        self.assertNotIn('class="lb-list', html)


class RailEntryTests(unittest.TestCase):
    def test_the_rail_links_to_it(self):
        layout = (ROOT / 'templates' / 'layout.html').read_text(encoding='utf-8')
        nav = layout.split('<nav class="nav-list"', 1)[1].split('</nav>', 1)[0]
        self.assertIn("url_for('leaderboard')", nav)
        self.assertIn('leaderboard_title', nav)

    def test_the_entry_marks_itself_active(self):
        layout = (ROOT / 'templates' / 'layout.html').read_text(encoding='utf-8')
        self.assertIn("active_page == 'leaderboard'", layout)

    def test_the_entry_has_an_icon_wrapper(self):
        """Every rail link needs .nav-icon or its glyph sits off centre."""
        layout = (ROOT / 'templates' / 'layout.html').read_text(encoding='utf-8')
        nav = layout.split('<nav class="nav-list"', 1)[1].split('</nav>', 1)[0]
        self.assertEqual(nav.count('<a '), nav.count('class="nav-icon"'))


if __name__ == '__main__':
    unittest.main()

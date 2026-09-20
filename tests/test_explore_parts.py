"""get_explore_context must build only what the caller renders.

The full context is roughly ten round trips, five of them exact counts over
whole tables. Most callers show a slice of it, and asking for the rest is
time the reader waits for data that is then discarded. Narrowing it is only
safe while every key still exists and no caller quietly loses a part its
template reads -- both of which fail silently, so they are pinned here.
"""
import re
import unittest
from pathlib import Path
from unittest.mock import patch

import app as zapp

ROOT = Path(zapp.__file__).resolve().parent


class Recorder:
    def __init__(self, seen, name):
        self.seen = seen
        self.name = name

    def __getattr__(self, attr):
        def chain(*args, **kwargs):
            return self
        return chain

    def execute(self):
        self.seen.append(self.name)
        return type('Res', (), {'data': [], 'count': 0})()


class FakeDB:
    def __init__(self, seen):
        self.seen = seen

    def table(self, name):
        return Recorder(self.seen, name)


class ExplorePartsTests(unittest.TestCase):
    def setUp(self):
        self.seen = []
        self.db = FakeDB(self.seen)
        zapp._forced_level_users_cache.update({'at': 0.0, 'users': None})

    def build(self, **kwargs):
        with zapp.app.test_request_context('/'), patch.object(zapp, 'supabase', self.db):
            return zapp.get_explore_context({'id': 1}, **kwargs)

    def test_asking_for_less_queries_less(self):
        self.build()
        everything = len(self.seen)
        self.seen.clear()
        self.build(parts=('trending_posts',))
        self.assertLess(len(self.seen), everything, "narrowing saved nothing")

    def test_the_counts_are_skipped_when_no_one_shows_them(self):
        self.build(parts=('trending_posts', 'communities', 'popular_users'))
        joined = ' '.join(self.seen)
        self.assertNotIn('likes', joined.split(), "counted likes nobody renders")
        self.assertNotIn('comments', joined.split(), "counted comments nobody renders")

    def test_every_key_survives_narrowing(self):
        """A caller reading a part it did not ask for must get an empty value,
        never a KeyError in the middle of rendering."""
        full = self.build()
        narrow = self.build(parts=('trending_posts',))
        self.assertEqual(set(full), set(narrow))
        self.assertEqual(set(full['metrics']), set(narrow['metrics']))

    def test_the_default_is_still_everything(self):
        default = self.build()
        explicit = self.build(parts=zapp.EXPLORE_PARTS)
        self.assertEqual(set(default), set(explicit))

    def test_the_activity_feed_pulls_in_what_it_is_built_from(self):
        """activity_items is assembled from trending posts and new members, so
        asking for it alone must still fetch those."""
        self.build(parts=('activity_items',))
        self.assertIn('users', self.seen, "new members were not fetched")
        self.assertIn('posts', self.seen, "trending posts were not fetched")

    def test_a_typo_in_a_part_name_is_loud(self):
        with self.assertRaises(ValueError):
            self.build(parts=('trendingposts',))

    def test_each_caller_asks_for_what_its_template_reads(self):
        """The real guard: a template that starts using another part while the
        route still narrows would render it empty, on a live page."""
        source = (ROOT / 'app.py').read_text(encoding='utf-8')
        pairs = {
            'reels.html': 'reels',
            'messages.html': 'messages',
            'community.html': 'community',
        }
        for template_name, route in pairs.items():
            body = source.split(f"def {route}(")[1].split('\ndef ')[0]
            call = re.search(r"get_explore_context\(viewer(?:,\s*parts=\(([^)]*)\))?\)", body)
            with self.subTest(route=route):
                self.assertIsNotNone(call, f"{route}() no longer builds an explore context")
                if call.group(1) is None:
                    continue  # asks for everything; nothing can be missing
                asked = set(re.findall(r"'([a-z_]+)'", call.group(1)))
                markup = (ROOT / 'templates' / template_name).read_text(encoding='utf-8')
                # Which context keys the route actually hands the template.
                render = body.split('render_template(')[1]
                for part in zapp.EXPLORE_PARTS:
                    if f"explore['{part}']" in render or f"explore.get('{part}'" in render:
                        self.assertIn(part, asked,
                                      f"{route}() passes {part} to {template_name} but no longer asks for it")
                if 'metrics.' in markup:
                    self.assertIn('metrics', asked,
                                  f"{template_name} prints a metric but {route}() skips the counts")


if __name__ == '__main__':
    unittest.main()

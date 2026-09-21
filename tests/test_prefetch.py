"""Speculative prefetching must stay speculative and stay safe.

Hovering a navigation link fetches the page early so the click is a cache hit.
That is only acceptable while it cannot fire on something that changes state,
cannot run away with someone's data allowance, and cannot fetch the same page
twice. Those guards are easy to drop by accident, so they are pinned here.
"""
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = (ROOT / "static" / "js" / "script.js").read_text(encoding="utf-8")


def block(name):
    """The body of a named function in script.js."""
    start = SCRIPT.index(f"function {name}(")
    depth = 0
    for i in range(start, len(SCRIPT)):
        if SCRIPT[i] == "{":
            depth += 1
        elif SCRIPT[i] == "}":
            depth -= 1
            if depth == 0:
                return SCRIPT[start:i + 1]
    raise AssertionError(f"{name} has unbalanced braces")


class PrefetchGuardTests(unittest.TestCase):
    def test_it_runs_at_all(self):
        self.assertIn("initPrefetch();", SCRIPT)

    def test_state_changing_paths_are_never_prefetched(self):
        """Prefetching /logout would sign the reader out just for hovering."""
        body = block("worthPrefetching")
        self.assertIn("logout", body)
        self.assertRegex(body, r"delete|remove")

    def test_only_same_origin(self):
        body = block("worthPrefetching")
        self.assertIn("url.origin !== location.origin", body)

    def test_it_backs_off_on_a_metered_or_slow_connection(self):
        body = block("prefetchingIsWelcome")
        self.assertIn("saveData", body)
        self.assertIn("effectiveType", body)

    def test_it_never_fetches_the_same_page_twice(self):
        self.assertIn("prefetched.has(url.href)", block("worthPrefetching"))
        self.assertIn("prefetched.add(href)", block("prefetch"))

    def test_there_is_a_ceiling(self):
        self.assertIn("PREFETCH_LIMIT", block("worthPrefetching"))
        limit = re.search(r"const PREFETCH_LIMIT = (\d+);", SCRIPT)
        self.assertIsNotNone(limit)
        self.assertLessEqual(int(limit.group(1)), 25,
                             "a high ceiling turns a hover into a crawl of the site")

    def test_downloads_and_new_tabs_are_left_alone(self):
        body = block("worthPrefetching")
        self.assertIn("download", body)
        self.assertIn("target", body)

    def test_an_opt_out_exists_for_individual_links(self):
        self.assertIn("noPrefetch", block("worthPrefetching"))

    def test_it_only_watches_navigation_links(self):
        """A blanket selector would prefetch every link on the feed."""
        body = block("initPrefetch")
        self.assertIn(".profile-tabs a", body)
        self.assertNotRegex(body, r"selector\s*=\s*\[\s*'a'")


if __name__ == "__main__":
    unittest.main()

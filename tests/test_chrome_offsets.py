"""Anything that sticks to the top of the timeline parks below the chrome.

Two rows were pinned at `top: 0`, which is exactly where the top bar already
sits. With a lower z-index they came to rest underneath it: the community
selector looked cut in half, and the page header's title row was hidden
altogether while the band below it covered the posts scrolling past.

The offset is a token now, so the desktop bar and the phone header each get
the right value without either call site knowing which one is on screen. The
token's value is the bar's measured height, not a round number: at 65px
everything parked four pixels under the bar's own edge.
"""
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SECTIONS = ROOT / "static" / "css" / "sections"


def text(name):
    return (SECTIONS / name).read_text(encoding="utf-8")


def rule(name, selector):
    match = re.search(re.escape(selector) + r"\s*\{([^}]*)\}", text(name))
    return match.group(1) if match else None


def token(name, key):
    match = re.search(r"--" + re.escape(key) + r":\s*([^;]+);", text(name))
    return match.group(1).strip() if match else None


class StickyOffsetTests(unittest.TestCase):
    def test_the_offset_is_a_token(self):
        self.assertEqual(token("base.css", "sticky-top"), "var(--topbar-height)")

    def test_the_bar_height_matches_what_it_renders(self):
        """48px control + 10px padding either side + the 1px rule under it."""
        self.assertEqual(token("base.css", "topbar-height"), "69px")

    def test_the_phone_header_height_matches_what_it_renders(self):
        self.assertEqual(token("base.css", "mobile-header-height"), "56px")

    def test_the_phone_breakpoint_swaps_the_offset(self):
        # The phone value lives in its own :root inside the 767px block.
        block = re.search(r"@media \(max-width: 767px\) \{.*?:root \{([^}]*)\}",
                          text("base.css"), re.S)
        self.assertIsNotNone(block, "the phone offset override is gone")
        self.assertIn("--sticky-top: var(--mobile-header-height)", block.group(1))

    def test_the_community_selector_uses_it(self):
        body = rule("community-timeline.css", ".community-timeline-tabs")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"top:\s*var\(--sticky-top\)")

    def test_no_breakpoint_pins_the_selector_back_to_zero(self):
        """The phone rule used to re-declare top: 0, which put the row back
        under the phone header the token was meant to clear."""
        self.assertNotRegex(text("community-timeline.css"),
                            r"\.community-timeline-tabs\s*\{[^}]*top:\s*0")

    def test_the_page_header_uses_it(self):
        body = rule("feed.css", ".page-header")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"top:\s*var\(--sticky-top\)")

    def test_a_header_that_opts_out_of_sticky_drops_the_offset_too(self):
        """A `top` left on a relatively positioned box shifts it down without
        moving anything else, so the community hero sat on the cards below
        it."""
        body = rule("community-timeline.css", ".community-timeline-header")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"position:\s*relative")
        self.assertRegex(body, r"top:\s*auto",
                         "the hero inherits the sticky offset and overlaps "
                         "the section under it")


class ChromeOpacityTests(unittest.TestCase):
    """Sticky chrome that content passes under has to be readable on its own.

    At 0.82 the feed showed through as a second, blurred layer of avatars and
    buttons sitting inside the bar.
    """

    def test_the_top_bar_is_opaque(self):
        body = rule("navigation.css", ".app-topbar")
        self.assertIsNotNone(body)
        self.assertIn("var(--chrome-blur-strong)", body)

    def test_the_page_header_has_a_surface(self):
        """design-system.css hands the flow surfaces a transparent background;
        the page header is the one that sticks, so it gets its own."""
        body = rule("design-system.css", ".page-header")
        self.assertIsNotNone(body)
        self.assertIn("var(--chrome-blur-strong)", body)


class HomeHeadingAlignmentTests(unittest.TestCase):
    """The title belongs to the feed, so it starts where the feed starts."""

    def test_the_title_row_is_not_centred(self):
        body = rule("legacy-polish.css", ".home-header .header-top")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"justify-content:\s*space-between")
        self.assertNotRegex(body, r"justify-content:\s*center")

    def test_the_first_row_does_not_repeat_the_container_inset(self):
        """.page-header already pads 16px; another 16px here put the title
        further in than the tabs and every avatar below it."""
        body = rule("feed.css", ".page-header > div:first-child")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"padding:\s*12px 0")


class DockClearanceTests(unittest.TestCase):
    """The message dock is fixed to the window's bottom-right corner."""

    def test_the_right_rail_reserves_room_for_it(self):
        body = rule("base.css", ".right-rail")
        self.assertIsNotNone(body)
        self.assertIn("var(--dock-clearance)", body)

    def test_a_page_with_no_rail_keeps_the_dock_lane_clear(self):
        body = rule("base.css", ".app-shell:not(:has(.right-rail)) .timeline")
        self.assertIsNotNone(body, "nothing stops a sidebar-less page running "
                                   "its form controls under the dock")
        self.assertIn("var(--dock-gutter)", body)

    def test_a_page_with_no_rail_leaves_no_dead_column(self):
        body = rule("base.css", ".app-shell:not(:has(.right-rail))")
        self.assertIsNotNone(body)
        self.assertIn("minmax(0, 1fr)", body)


if __name__ == '__main__':
    unittest.main()

"""The collapsed rail draws each icon in a circle, so it has to sit centred.

Two things had pushed every icon off that centre, and neither is visible in
any rendered string -- only in geometry:

  * the labels stay in the layout now, clipped to zero width so they can
    slide open with the rail. Flex still places a gap beside a zero-width
    item, so a centred row was "icon + gap + nothing" and the icon sat half a
    gap to the left.

  * `.nav-list a span` matched the unread badge as well as the icon, and
    out-specified the badge's own `position: absolute`, putting the badge
    back into the flex row and pushing the Messages icon further still.

These are checked as rules rather than by measuring, so the suite needs no
browser; the geometry itself was verified in one.
"""
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SECTIONS = ROOT / "static" / "css" / "sections"


def rule(path, selector):
    """The declaration block for an exact selector, or None."""
    text = (SECTIONS / path).read_text(encoding="utf-8")
    match = re.search(re.escape(selector) + r"\s*\{([^}]*)\}", text)
    return match.group(1) if match else None


class RailIconCentringTests(unittest.TestCase):
    def test_the_collapsed_item_has_no_gap(self):
        body = rule("base.css", ".left-rail:not(.menu-open) .nav-list a")
        self.assertIsNotNone(body, "the collapsed nav item rule is gone")
        self.assertRegex(body, r"gap:\s*0",
                         "a gap beside the zero-width label offsets the icon")

    def test_the_gap_animates_with_the_rail(self):
        body = rule("base.css", ".nav-list a")
        self.assertIsNotNone(body)
        self.assertIn("gap", body)
        self.assertRegex(body, r"transition:[^;]*gap",
                         "the gap would snap once the rail is open")

    def test_no_broad_span_selector_reaches_the_badge(self):
        """`.nav-list a span` hits .nav-label and .nav-badge too."""
        for path in sorted(SECTIONS.glob("*.css")):
            # Comments describe the selector; only declarations apply it.
            text = re.sub(r"/\*.*?\*/", "", path.read_text(encoding="utf-8"), flags=re.S)
            for selector in re.findall(r"^([^{@}]+)\{", text, re.MULTILINE):
                selector = " ".join(selector.split())
                if ".nav-list" not in selector:
                    continue
                with self.subTest(section=path.name, selector=selector[:70]):
                    self.assertNotRegex(
                        selector, r"\.nav-list\s+a\s+span(?:\s*[,{]|$)",
                        "styles every span in a rail link, badge and label included")

    def test_the_icon_wrapper_is_still_styled(self):
        """Narrowing the selector must not leave the icon unstyled."""
        body = rule("legacy-polish.css", ".nav-icon")
        self.assertIsNotNone(body)
        for prop in ("width", "height", "display", "position"):
            with self.subTest(property=prop):
                self.assertIn(prop, body)

    def test_the_badge_stays_out_of_the_flow(self):
        body = rule("notification-badge.css", ".nav-badge")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"position:\s*absolute")

    def test_every_rail_link_wraps_its_glyph(self):
        """The narrowed selector only covers .nav-icon, so each link needs one."""
        layout = (ROOT / "templates" / "layout.html").read_text(encoding="utf-8")
        nav = layout.split('<nav class="nav-list"', 1)[1].split("</nav>", 1)[0]
        self.assertEqual(nav.count("<a "), nav.count('class="nav-icon"'),
                         "a rail link has no .nav-icon wrapper")


if __name__ == "__main__":
    unittest.main()

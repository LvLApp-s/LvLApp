"""Structural guards for the stylesheets.

A bulk edit once left three rules in legacy-polish.css spliced together --
a selector glued into the middle of a declaration, an unterminated property,
and a comment eaten by a selector. The browser silently drops whatever it
cannot parse, so the damage only showed up as a layout that quietly ignored
the shell's grid. These tests make that class of damage fail loudly.
"""
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STYLESHEETS = sorted((ROOT / "static" / "css").glob("**/*.css"))

# `  .some-class other: value;` -- a selector where a property should be.
SELECTOR_IN_DECLARATION_RE = re.compile(
    r"^\s*[.#][A-Za-z0-9_-][A-Za-z0-9_.:()\[\]=\"'>+~-]*\s+[a-z-]+\s*:\s*[^;{]+;",
    re.M,
)
# A property name left dangling on its own line with no value.
DANGLING_PROPERTY_RE = re.compile(
    r"^\s*(?:width|height|min-width|min-height|max-width|max-height|display|padding|margin|background|color|border)\s*$",
    re.M,
)


class StylesheetIntegrityTests(unittest.TestCase):
    def test_every_stylesheet_has_balanced_braces(self):
        for path in STYLESHEETS:
            with self.subTest(path=path.relative_to(ROOT)):
                text = path.read_text(encoding="utf-8")
                depth = 0
                for line_no, line in enumerate(text.splitlines(), 1):
                    depth += line.count("{") - line.count("}")
                    self.assertGreaterEqual(depth, 0, f"closes a block that was never opened at line {line_no}")
                self.assertEqual(depth, 0, "unclosed block")

    def test_no_selector_is_spliced_into_a_declaration(self):
        for path in STYLESHEETS:
            with self.subTest(path=path.relative_to(ROOT)):
                match = SELECTOR_IN_DECLARATION_RE.search(path.read_text(encoding="utf-8"))
                self.assertIsNone(match, match.group(0) if match else "")

    def test_no_property_is_left_without_a_value(self):
        for path in STYLESHEETS:
            with self.subTest(path=path.relative_to(ROOT)):
                match = DANGLING_PROPERTY_RE.search(path.read_text(encoding="utf-8"))
                self.assertIsNone(match, match.group(0) if match else "")

    def test_media_queries_are_closed(self):
        """An unclosed @media once scoped 750 lines of chat styling by accident."""
        for path in STYLESHEETS:
            with self.subTest(path=path.relative_to(ROOT)):
                text = path.read_text(encoding="utf-8")
                self.assertEqual(text.count("@media"), len(re.findall(r"@media[^{]*\{", text)))


class ShellWidthTests(unittest.TestCase):
    """The app shell's grid columns are the only place a rail width lives."""

    def test_rails_take_their_width_from_the_grid(self):
        base = (ROOT / "static" / "css" / "sections" / "base.css").read_text(encoding="utf-8")
        rail = base.split("\n.right-rail {", 1)[1].split("}", 1)[0]
        self.assertIn("width: 100%", rail)

    def test_no_section_pins_a_rail_width(self):
        for path in STYLESHEETS:
            if path.name == "base.css":
                continue
            with self.subTest(path=path.relative_to(ROOT)):
                text = path.read_text(encoding="utf-8")
                for block in re.findall(r"\.right-rail[^{]*\{([^}]*)\}", text):
                    self.assertNotRegex(block, r"(?<!max-)(?<!min-)width:\s*(?:\d+px|var\(--shell-right)")

    def test_wide_screens_get_a_wider_rail(self):
        base = (ROOT / "static" / "css" / "sections" / "base.css").read_text(encoding="utf-8")
        self.assertIn("--shell-right-wide", base)
        wide = base.split("@media (min-width: 1600px) {", 1)[1].split("\n}", 1)[0]
        self.assertIn("var(--shell-right-wide)", wide)

    def test_clip_panel_has_no_scrollbar_gutter(self):
        """The gutter made the clip 4px narrower than the card above it."""
        css = (ROOT / "static" / "css" / "sections" / "home-reels.css").read_text(encoding="utf-8")
        slides = css.split(".home-reel-slides {", 1)[1].split("}", 1)[0]
        self.assertNotIn("padding-right", slides)
        self.assertIn("scrollbar-width: none", slides)


if __name__ == "__main__":
    unittest.main()

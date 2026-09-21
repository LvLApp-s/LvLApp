"""The rest of the review document's findings, pinned where they can drift.

Each of these is a thing that reads fine in a screenshot and quietly comes
back the next time somebody edits the file next door, so the check is on the
rule or the markup rather than on a rendered picture.
"""
import re
import unittest
from unittest.mock import patch
from pathlib import Path

import app as zapp

ROOT = Path(zapp.__file__).resolve().parent
SECTIONS = ROOT / "static" / "css" / "sections"
TEMPLATES = ROOT / "templates"


def css(name):
    return (SECTIONS / name).read_text(encoding="utf-8")


def rule(name, selector):
    match = re.search(re.escape(selector) + r"\s*\{([^}]*)\}", css(name))
    return match.group(1) if match else None


def template(name):
    return (TEMPLATES / name).read_text(encoding="utf-8")


class RailSectionSeparationTests(unittest.TestCase):
    """A clip under a post read as that post's media."""

    def test_the_clips_panel_is_separated_from_trending(self):
        body = rule("components.css",
                    ".right-rail .trending-panel + .home-reel-panel,\n"
                    ".right-rail .trending-panel + .home-media-panel,\n"
                    ".right-rail .home-reel-panel + .home-media-panel")
        self.assertIsNotNone(body, "nothing marks where one rail section ends")
        self.assertIn("border-top", body)
        self.assertRegex(body, r"margin-top:\s*var\(--space-\d+\)")

    def test_the_clips_heading_does_not_repeat_itself(self):
        markup = template("_home_reel_panel.html")
        self.assertNotIn('data-i18n="videos_kicker"', markup,
                         '"VIDEOS" over "Clips" is the same word twice')
        self.assertIn('data-i18n="nav_clips"', markup)

    def test_the_heading_and_its_action_share_a_row(self):
        body = rule("home-reels.css", ".home-reel-panel-header")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"align-items:\s*center")

    def test_the_mute_control_is_clear_of_the_dock(self):
        """The dock is fixed bottom-right; this control used to be there too.

        The position belongs to the wrapper now -- speaker plus level -- so
        the whole control has to sit on the other side, not just the button.
        """
        body = rule("home-reels.css", ".home-reel-video-wrap > .media-volume")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"inset-inline-start:\s*8px")
        self.assertNotRegex(body, r"\bright:\s*8px")
        button = rule("home-reels.css", ".home-reel-mute-btn")
        self.assertIsNotNone(button)
        self.assertNotRegex(button, r"position:\s*absolute",
                            "two things positioning the same control")


class CommunityEmptyStateTests(unittest.TestCase):
    def test_the_nested_explainer_card_is_gone(self):
        markup = template("community.html")
        self.assertNotIn("community-empty-explainer", markup,
                         "a box inside a box repeating the heading above it")
        self.assertNotIn("community_empty_explainer_title", markup)

    def test_the_help_copy_has_no_home_left_in_the_tab_data(self):
        for tab in zapp.COMMUNITY_TIMELINE_TABS:
            with self.subTest(tab=tab['key']):
                self.assertNotIn('empty_help', tab)

    def test_the_empty_state_has_one_heading_and_one_sentence(self):
        markup = template("community.html")
        block = markup[markup.index('class="empty-state community-empty-state"'):]
        block = block[:block.index('</div>')]
        self.assertEqual(block.count('<h2'), 1)
        self.assertEqual(block.count('<p '), 1)

    def test_the_heading_is_not_a_page_title(self):
        body = rule("community-timeline.css",
                    ".community-empty-state .community-empty-title")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"font-weight:\s*600")

    def test_the_eyebrow_does_not_compete_with_the_heading(self):
        body = rule("legacy-polish.css", ".panel-kicker")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"font-weight:\s*500")


class AmbiguousCommunityNameTests(unittest.TestCase):
    """Two rooms really can share a name, so the list says which is which."""

    def test_a_shared_name_is_flagged_on_every_row_that_shares_it(self):
        rows = [{'name': 'AI', 'slug': 'ai'},
                {'name': 'ai', 'slug': 'ai-2'},
                {'name': 'Girls', 'slug': 'girls'}]
        zapp.flag_ambiguous_names(rows)
        self.assertEqual([r['name_is_ambiguous'] for r in rows],
                         [True, True, False])

    def test_a_unique_list_flags_nothing(self):
        rows = [{'name': 'A', 'slug': 'a'}, {'name': 'B', 'slug': 'b'}]
        zapp.flag_ambiguous_names(rows)
        self.assertFalse(any(r['name_is_ambiguous'] for r in rows))

    def test_it_never_drops_a_row(self):
        """Collapsing by name would hide a real room with its own members."""
        rows = [{'name': 'AI', 'slug': 'ai'}, {'name': 'AI', 'slug': 'ai-2'}]
        self.assertEqual(len(zapp.flag_ambiguous_names(rows)), 2)

    def test_a_missing_name_does_not_raise(self):
        rows = [{'slug': 'a'}, {'name': None, 'slug': 'b'}]
        zapp.flag_ambiguous_names(rows)
        self.assertTrue(all('name_is_ambiguous' in r for r in rows))

    def test_the_card_carries_the_room_id(self):
        markup = template("community.html")
        self.assertIn('data-community-id="{{ item.id }}"', markup)

    def test_the_card_shows_the_slug_when_the_name_is_shared(self):
        markup = template("community.html")
        self.assertIn('item.name_is_ambiguous', markup)


class BrandTests(unittest.TestCase):
    def test_the_wordmark_does_not_repeat_the_icon(self):
        markup = template("layout.html")
        self.assertIn('<span class="brand-text">LvLapp</span>', markup)

    def test_the_accessible_name_carries_one_brand_name(self):
        markup = template("layout.html")
        self.assertIn('aria-label="LvLapp home"', markup)

    def test_the_collapsed_rail_keeps_the_icon_centred(self):
        """The wordmark stays in the layout to animate, so the flex gap beside
        it has to go or the icon sits off centre."""
        body = rule("components.css", ".left-rail:not(.menu-open) .brand.brand-logo")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"gap:\s*0")

    def test_the_wordmark_is_not_removed_from_the_layout(self):
        """display:none cannot be transitioned; it snapped in at the end of
        the rail's animation instead of sliding with it."""
        self.assertNotRegex(
            css("components.css"),
            r"\.left-rail:not\(\.menu-open\) \.brand-text\s*\{[^}]*display:\s*none")

    def test_the_tablet_rail_does_not_hide_its_own_labels_when_open(self):
        block = re.search(
            r"@media \(min-width: 768px\) and \(max-width: 1199px\) \{(.*?)\n\}\n",
            css("responsive.css"), re.S)
        self.assertIsNotNone(block)
        self.assertNotRegex(block.group(1),
                            r"\.left-rail \.brand-text,?\s*\n?[^}]*display:\s*none")


class LeaderboardHoverTests(unittest.TestCase):
    """The row answers the pointer once, with a background change."""

    def test_the_hover_underline_is_removed(self):
        body = rule("community-highlights.css",
                    ".lb-person:hover,\n.lb-person:focus,\n.lb-row:hover .lb-person")
        self.assertIsNotNone(body, "the global a:hover underline still fires here")
        self.assertRegex(body, r"text-decoration:\s*none")

    def test_the_global_link_underline_is_left_alone(self):
        """The fix is scoped to this component, not a global reset."""
        body = rule("base.css", "a:hover")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"text-decoration:\s*underline")

    def test_the_row_still_answers_with_a_background(self):
        body = rule("community-highlights.css", ".lb-row:hover")
        self.assertIsNotNone(body)
        self.assertIn("background", body)

    def test_hover_changes_nothing_that_moves_the_row(self):
        body = rule("community-highlights.css", ".lb-row:hover")
        for shifting in ("padding", "border-width", "font-weight", "height"):
            with self.subTest(property=shifting):
                self.assertNotIn(shifting + ":", body)


class TopBarTests(unittest.TestCase):
    def test_the_actions_sit_at_the_bars_own_edge(self):
        body = rule("navigation.css", ".topbar-actions")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"justify-self:\s*end")
        self.assertRegex(body, r"grid-column:\s*3")

    def test_the_search_keeps_the_middle_track(self):
        body = rule("navigation.css", ".topbar-search")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"grid-column:\s*2")

    def test_the_back_buttons_empty_cell_is_gone(self):
        self.assertNotRegex(css("navigation.css"),
                            r"\.app-topbar::before\s*\{")

    def test_the_padding_comes_from_a_token(self):
        body = rule("navigation.css", ".app-topbar")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"padding:\s*10px var\(--space-\d+\)")


class UploadFormTests(unittest.TestCase):
    def test_the_form_takes_a_readable_measure(self):
        body = rule("reels.css", ".reel-upload-page")
        self.assertIsNotNone(body)
        self.assertIn("margin-inline: auto", body)
        self.assertRegex(body, r"width:\s*min\(100%,\s*\d+px\)")

    def test_the_hint_under_the_picker_is_not_a_heading(self):
        """`.reel-file-picker span` also matched every span inside the hint,
        so the file-format line rendered at weight 900."""
        self.assertIsNone(rule("reels.css", ".reel-file-picker span"))
        body = rule("reels.css", ".reel-file-picker > span")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"font-weight:\s*600")

    def test_the_field_label_rule_is_a_direct_child(self):
        self.assertIsNone(rule("reels.css", ".form-field span"))
        self.assertIsNotNone(rule("reels.css", ".form-field > span"))

    def test_the_hidden_file_input_still_shows_focus(self):
        body = rule("reels.css", ".reel-file-picker:focus-within")
        self.assertIsNotNone(body, "tabbing to the picker shows nothing")
        self.assertIn("outline", body)

    def test_the_toggle_rows_match_the_fields_they_sit_under(self):
        body = rule("reels.css", ".reel-toggle-list label")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"padding:\s*12px")
        self.assertRegex(body, r"font-weight:\s*500")


class PrefetchTests(unittest.TestCase):
    def test_opening_a_post_is_hinted(self):
        script = (ROOT / "static" / "js" / "script.js").read_text(encoding="utf-8")
        start = script.index("const selector = [")
        block = script[start:script.index("].join(', ');", start)]
        self.assertIn("'.post-action-link'", block)


if __name__ == '__main__':
    unittest.main()

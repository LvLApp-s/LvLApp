"""Three things the rail got wrong once the panels started sharing its height.

The trending list stopped scrolling: pinning its panel to its content height
let it grow past the rail, so the list had nothing to scroll within. The
speaker beside a clip said "muted" while the clip played, because the icon was
set where the click was handled rather than from the video. And the
leaderboard took so much of the rail that the clip under it was a letterbox
strip.
"""
import re
import unittest
from pathlib import Path

import app as zapp

ROOT = Path(zapp.__file__).resolve().parent
SECTIONS = ROOT / "static" / "css" / "sections"
SCRIPT = (ROOT / "static" / "js" / "script.js").read_text(encoding="utf-8")


def css(name):
    return (SECTIONS / name).read_text(encoding="utf-8")


def rule(name, selector):
    match = re.search(re.escape(selector) + r"\s*\{([^}]*)\}", css(name))
    return match.group(1) if match else None


class TrendingListScrollsTests(unittest.TestCase):
    def test_the_panel_is_not_pinned_to_its_content_height(self):
        """At flex: 0 0 auto it grew past the rail and the list, which is what
        actually scrolls, had no height to scroll within."""
        body = rule("components.css",
                    ".right-rail > .community-highlights,\n"
                    ".right-rail > .levelup-panel,\n"
                    ".right-rail > .home-media-panel")
        self.assertIsNotNone(body)
        self.assertNotIn("trending-panel", body,
                         "trending needs the rail to bound it so its list can "
                         "scroll inside")

    def test_the_panel_still_takes_the_rails_height(self):
        body = rule("components.css", ".trending-panel")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"flex:\s*1 1 auto")
        self.assertRegex(body, r"min-height:\s*0")

    def test_the_list_is_the_thing_that_scrolls(self):
        body = rule("components.css", ".right-rail:has(.trending-panel) .trending-list")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"max-height:\s*none")

    def test_the_list_shows_a_handle_to_drag(self):
        """.custom-scrollbar hides the bar outright, so there was nothing at
        the edge to say the list went on."""
        body = rule("components.css", ".right-rail .trending-list")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"scrollbar-width:\s*thin")
        bar = rule("components.css", ".right-rail .trending-list::-webkit-scrollbar")
        self.assertIsNotNone(bar)
        self.assertRegex(bar, r"display:\s*block")


class SpeakerFollowsTheVideoTests(unittest.TestCase):
    """Anything that changes the sound has to move the icon with it."""

    def test_the_rail_speaker_listens_to_the_video(self):
        start = SCRIPT.index("const syncMuteButton = () => {")
        block = SCRIPT[start:start + 900]
        self.assertIn("video.addEventListener('volumechange', syncMuteButton)", block)

    def test_the_rail_click_only_changes_the_video(self):
        """It used to set the icon itself, which is why the slider could leave
        the two disagreeing."""
        start = SCRIPT.index("muteBtn.addEventListener('click'")
        block = SCRIPT[start:SCRIPT.index("});", start)]
        self.assertIn("video.muted = !video.muted", block)
        self.assertNotIn("classList.toggle('active'", block)

    def test_the_rail_icon_is_right_before_the_first_click(self):
        start = SCRIPT.index("const syncMuteButton = () => {")
        self.assertIn("syncMuteButton();", SCRIPT[start:start + 900])

    def test_the_clips_feed_speaker_listens_to_the_video(self):
        start = SCRIPT.index("// The speaker reads the video, not the last click on it.")
        block = SCRIPT[start:start + 700]
        self.assertIn("volumechange", block)
        self.assertIn("updateMuteControl(muteButton, muteLabel, video.muted)", block)


class RailBalanceTests(unittest.TestCase):
    def test_a_leaderboard_row_is_two_lines_not_three(self):
        """The handle and the level badge were stacked, which made every row
        tall enough that the podium needed most of the rail."""
        body = rule("community-highlights.css", ".lb-identity")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"display:\s*grid")
        self.assertIsNotNone(rule("community-highlights.css", ".lb-level-badge"))
        badge = rule("community-highlights.css", ".lb-level-badge")
        self.assertRegex(badge, r"grid-column:\s*2")

    def test_the_list_height_follows_the_window(self):
        body = rule("community-highlights.css", ".lb-list")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"max-height:\s*clamp\(")
        self.assertNotRegex(body, r"max-height:\s*268px",
                            "a fixed height gave the clip whatever was left")

    def test_the_podium_is_the_floor(self):
        """Three rows plus their gaps: the medals never fall below the fold."""
        body = rule("community-highlights.css", ".lb-list")
        floor = re.search(r"clamp\((\d+)px", body)
        self.assertIsNotNone(floor)
        self.assertGreaterEqual(int(floor.group(1)), 3 * 65 + 2 * 4)

    def test_a_short_window_lets_the_list_give_first(self):
        """It scrolls; the clip does not."""
        block = re.search(r"@media \(max-height: 820px\) \{(.*?)\n\}\n",
                          css("community-highlights.css"), re.S)
        self.assertIsNotNone(block)
        self.assertIn(".lb-list", block.group(1))

    def test_the_panel_heading_is_a_rail_heading(self):
        body = rule("community-highlights.css", ".lb-panel h2")
        self.assertIsNotNone(body)
        size = int(re.search(r"font-size:\s*(\d+)px", body).group(1))
        self.assertLessEqual(size, 18, "it was the loudest thing in the rail")


if __name__ == '__main__':
    unittest.main()

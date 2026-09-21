"""The right rail's clip panel, and the volume control on every clip.

Three things are pinned here. The rail is a column whose last panel takes the
height the ones above it leave, so a clip no longer stops at a guessed maximum
with black page under it. Each slide is exactly as tall as the box it scrolls
in, so a snap moves to the next whole clip instead of leaving one cut across
an edge. And the speaker beside a clip carries a level, not just a mute.
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


def template(name):
    return (ROOT / "templates" / name).read_text(encoding="utf-8")


def volume_handler():
    start = SCRIPT.index("function initVolumeControls()")
    return SCRIPT[start:SCRIPT.index("initVolumeControls();", start)]


class RailFillsItsHeightTests(unittest.TestCase):
    def test_the_rail_is_a_column(self):
        body = rule("components.css", ".right-rail")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"flex-direction:\s*column")

    def test_the_clips_panel_takes_what_is_left(self):
        body = rule("home-reels.css", ".home-reel-panel")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"flex:\s*1 1 auto")
        self.assertNotRegex(body, r"max-height:\s*calc\(100vh",
                            "a guessed height is what left black page under "
                            "the clip")

    def test_the_other_panels_are_sized_by_their_content(self):
        # Trending is deliberately absent: it is a scrolling list, so it needs
        # the rail to bound its height rather than growing past it.
        body = rule("components.css",
                    ".right-rail > .community-highlights,\n"
                    ".right-rail > .levelup-panel,\n"
                    ".right-rail > .home-media-panel")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"flex:\s*0 0 auto")


class OneClipPerScreenfulTests(unittest.TestCase):
    def test_each_slide_is_exactly_the_height_of_the_box(self):
        body = rule("home-reels.css", ".home-reel-slides")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"grid-auto-rows:\s*100%")
        self.assertRegex(body, r"scroll-snap-type:\s*y mandatory")

    def test_a_snap_lands_on_a_whole_clip(self):
        body = rule("home-reels.css", ".home-reel-slide")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"scroll-snap-stop:\s*always")

    def test_the_video_takes_the_slides_remaining_height(self):
        body = rule("home-reels.css", ".home-reel-video-wrap")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"flex:\s*1 1 auto")
        self.assertNotRegex(body, r"max-height:",
                            "a ceiling here stops the clip short of the rail")

    def test_the_author_row_is_not_squeezed(self):
        body = rule("home-reels.css", ".home-reel-info")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"flex:\s*0 0 auto")


class CommunityRailTests(unittest.TestCase):
    def test_the_community_page_no_longer_asks_for_trending(self):
        self.assertNotIn("show_trends", template("community.html"))

    def test_the_route_stops_paying_for_what_it_no_longer_renders(self):
        source = (ROOT / "app.py").read_text(encoding="utf-8")
        start = source.index("def community():")
        block = source[start:source.index("def community_name_is_taken", start)]
        self.assertIn("parts=('metrics', 'communities')", block)
        for gone in ('trending_posts=', 'recent_members=', 'popular_users=',
                     'activity_items='):
            with self.subTest(part=gone):
                self.assertNotIn(gone, block)


class VolumeControlMarkupTests(unittest.TestCase):
    def test_both_clip_surfaces_carry_one(self):
        for name in ('_home_reel_panel.html', '_reel_card.html'):
            with self.subTest(template=name):
                markup = template(name)
                self.assertIn('data-volume-control', markup)
                self.assertIn('data-volume-slider', markup)

    def test_the_speaker_keeps_the_attribute_its_own_handler_uses(self):
        """The mute click belongs to each surface; this only adds the level."""
        self.assertIn('data-home-reel-mute', template('_home_reel_panel.html'))
        self.assertIn('data-reel-mute', template('_reel_card.html'))

    def test_the_slider_is_labelled(self):
        for name in ('_home_reel_panel.html', '_reel_card.html'):
            with self.subTest(template=name):
                self.assertIn('data-i18n-aria="media_volume_aria"', template(name))


class VolumeControlStyleTests(unittest.TestCase):
    def test_the_level_is_clipped_rather_than_removed(self):
        """display:none cannot be transitioned, so it would blink in."""
        body = rule("components.css", ".media-volume-track")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"max-width:\s*0")
        self.assertNotRegex(body, r"display:\s*none")

    def test_holding_the_pointer_on_it_opens_the_level(self):
        body = rule("components.css",
                    ".media-volume:hover .media-volume-track,\n"
                    ".media-volume:focus-within .media-volume-track")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"max-width:\s*\d+px")

    def test_a_keyboard_opens_it_too(self):
        self.assertIn(".media-volume:focus-within", css("components.css"))

    def test_a_touch_screen_gets_it_without_hovering(self):
        block = re.search(r"@media \(hover: none\) \{(.*?)\n\}\n",
                          css("components.css"), re.S)
        self.assertIsNotNone(block, "there is no hover on a touch screen, so "
                                    "the level would never open")
        self.assertIn(".media-volume-track", block.group(1))

    def test_the_floating_control_needs_no_important(self):
        body = rule("reels.css", ".reel-mute-float")
        self.assertIsNotNone(body)
        self.assertNotIn("!important", body)


class VolumeControlBehaviourTests(unittest.TestCase):
    def test_silence_is_the_muted_flag_not_a_level_of_zero(self):
        """Setting volume to 0 and unmuting would play at zero and look broken;
        the level underneath is kept so unmuting returns to it."""
        body = volume_handler()
        zero = body[body.index("if (level === 0) {"):body.index("} else {")]
        self.assertIn("video.muted = true", zero)
        self.assertNotIn("video.volume = 0", zero)

    def test_a_level_above_zero_unmutes(self):
        body = volume_handler()
        rest = body[body.index("} else {"):]
        self.assertIn("video.muted = false", rest)

    def test_zero_is_never_stored(self):
        body = volume_handler()
        self.assertNotIn("storeVolume(0)", body)
        store = body[body.index("} else {"):body.index("paint();", body.index("} else {"))]
        self.assertIn("storeVolume(level)", store)

    def test_the_level_survives_the_page(self):
        self.assertIn("lvl_media_volume", SCRIPT)
        self.assertIn("window.localStorage.setItem(VOLUME_KEY", SCRIPT)

    def test_blocked_storage_does_not_break_the_control(self):
        for fn in ('readStoredVolume', 'storeVolume'):
            with self.subTest(function=fn):
                start = SCRIPT.index("function %s(" % fn)
                body = SCRIPT[start:SCRIPT.index("\n    }", start)]
                self.assertIn("catch", body)

    def test_the_speaker_and_the_level_stay_in_step(self):
        """Each surface owns its own mute click, so they agree through the
        video's own event rather than by calling into each other."""
        self.assertIn("video.addEventListener('volumechange', paint)",
                      volume_handler())

    def test_the_slider_does_not_pause_the_clip(self):
        body = volume_handler()
        self.assertIn("event.stopPropagation()", body)


if __name__ == '__main__':
    unittest.main()

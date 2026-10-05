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
    """The body of the rule whose selector list starts with this selector.

    Anchored to the start of a line: without it, looking up
    ".home-reel-mute-btn" also matched the ".home-reel-video-wrap >
    .home-reel-mute-btn" rule above it, so a test about what the button sets
    read the wrapper's positioning instead.
    """
    match = re.search(r"^" + re.escape(selector) + r"\s*(?:,[^{]*)?\{([^}]*)\}",
                      css(name), re.M)
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

    def test_the_video_fills_the_slide(self):
        """The slide was a flex column -- video above, author row below -- and
        is a single grid cell now, with the author row laid over the video
        under a gradient. Either way the point is the same: the video takes
        the whole box, with nothing capping it short of the rail."""
        slide = rule("home-reels.css", ".home-reel-slide")
        self.assertIsNotNone(slide)
        self.assertRegex(slide, r'grid-template-areas:\s*"content"')

        body = rule("home-reels.css", ".home-reel-video-wrap")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"grid-area:\s*content")
        self.assertRegex(body, r"height:\s*100%")
        self.assertNotRegex(body, r"max-height:",
                            "a ceiling here stops the clip short of the rail")

    def test_the_author_row_is_not_squeezed(self):
        """It shares the cell with the video rather than taking height from
        it, so it is sized by its own content and cannot be compressed."""
        body = rule("home-reels.css", ".home-reel-info")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"grid-area:\s*content")
        self.assertRegex(body, r"align-self:\s*end")
        self.assertNotRegex(body, r"height:\s*\d",
                            "a fixed height would clip a long caption")


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
    """The level bar is out, on every surface, without being asked for.

    It used to be clipped to max-width: 0 and opened on hover, focus or
    drag. A control you have to discover by hovering is one most people
    never find: the clip showed a speaker, pressing it gave silence, and the
    bar for turning the clip *down* was never seen. These assert the bar is
    simply there.
    """

    def test_the_level_is_not_hidden(self):
        body = rule("components.css", ".media-volume-track")
        self.assertIsNotNone(body)
        self.assertNotRegex(body, r"max-width:\s*0")
        self.assertNotRegex(body, r"display:\s*none")
        self.assertNotRegex(body, r"opacity:\s*0")

    def test_the_bar_has_a_width_to_drag_along(self):
        body = rule("components.css", ".media-volume-slider")
        self.assertIsNotNone(body)
        width = re.search(r"width:\s*(\d+)px", body)
        self.assertIsNotNone(width)
        self.assertGreaterEqual(int(width.group(1)), 60,
                                "too short to aim at")

    def test_the_speaker_and_the_bar_are_spaced_apart(self):
        """They are one pill; without the gap the thumb sits on the icon."""
        body = rule("components.css", ".media-volume")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"gap:\s*var\(--space")

    def test_nothing_waits_for_a_hover_to_show_the_level(self):
        """The whole point: no rule opens it, because it never closed."""
        sheet = css("components.css")
        for gate in (".media-volume:hover .media-volume-track",
                     ".media-volume:focus-within .media-volume-track",
                     ".media-volume.is-adjusting .media-volume-track"):
            with self.subTest(selector=gate):
                self.assertNotIn(gate, sheet)

    def test_a_touch_screen_gets_a_bigger_handle(self):
        """A finger is blunter than a pointer. This used to be where the bar
        was forced open, because a touch screen has no hover to open it with
        -- the workaround that showed the default was wrong."""
        block = re.search(r"@media \(hover: none\) \{(.*?)\n\}\n",
                          css("components.css"), re.S)
        self.assertIsNotNone(block)
        self.assertIn(".media-volume-slider", block.group(1))
        self.assertNotIn("max-width", block.group(1))

    def test_the_floating_control_needs_no_important(self):
        """It used to be .reel-mute-float, which carried six !important
        declarations and no template that used the class -- dead CSS winning
        arguments with rules that were actually on the page. The rule that
        positions the control now is the one on the rail's wrapper, and it
        wins on specificity rather than by shouting."""
        self.assertIsNone(rule("reels.css", ".reel-mute-float"),
                          "dead rule is back")
        body = rule("components.css", ".media-volume-corner")
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


class QuietSoundStateTests(unittest.TestCase):
    """Sound on is said by the icon, not by shouting.

    The rail filled the whole control with the brand colour, which put a
    bright lozenge on top of the clip; the clips feed had no second icon at
    all, so its only way to say "on" was a yellow speaker with two glows,
    pulsing forever. Both are gone, and both surfaces now swap between a
    speaker and a crossed speaker on the same dark disc.
    """

    def test_the_rail_control_does_not_fill_with_colour(self):
        self.assertNotIn(".media-volume:has(.home-reel-mute-btn.active)",
                         css("home-reels.css"))
        body = rule("home-reels.css", ".home-reel-mute-btn.active")
        if body is not None:
            self.assertNotRegex(body, r"background")

    def test_nothing_repaints_the_pill_when_the_sound_is_on(self):
        for name in ("components.css", "home-reels.css", "reels.css"):
            for selector, decls in re.findall(r"([^{}]*\.media-volume[^{]*)\{([^}]*)\}",
                                              css(name)):
                if ".active" in selector or ":has(" in selector:
                    with self.subTest(section=name, selector=selector.strip()):
                        self.assertNotRegex(decls, r"background")

    def test_the_clips_feed_speaker_has_two_icons(self):
        markup = template("_reel_card.html")
        self.assertIn('class="reel-icon-muted"', markup)
        self.assertIn('class="reel-icon-sound"', markup)

    def test_the_clips_feed_swaps_them_on_state(self):
        hidden = rule("reels.css",
                      ".reel-action-mute .reel-icon-sound,\n"
                      ".reel-action-mute.active .reel-icon-muted")
        self.assertIsNotNone(hidden)
        self.assertRegex(hidden, r"display:\s*none")
        shown = rule("reels.css", ".reel-action-mute.active .reel-icon-sound")
        self.assertIsNotNone(shown)
        self.assertRegex(shown, r"display:\s*block")

    def test_the_clips_feed_speaker_neither_glows_nor_pulses(self):
        text = css("reels.css")
        self.assertNotIn("reel-action-mute.active svg", text)
        self.assertNotIn("reelSoundWave", text, "the animation has no users left")


class DraggingAloneIsEnoughTests(unittest.TestCase):
    """Lowering and muting have to be possible with the handle alone."""

    def test_the_control_stays_open_for_the_whole_drag(self):
        """The pill is 30px tall, so a drag leaves it easily, and losing the
        hover halfway would collapse the track under the pointer."""
        handler = volume_handler()
        self.assertIn("control.classList.add('is-adjusting')", handler)
        self.assertIn("window.addEventListener('pointerup', release)", handler)
        self.assertIn("window.addEventListener('pointercancel', release)", handler)

    def test_the_handle_grows_while_it_is_held(self):
        """is-adjusting used to hold the bar open through a drag that left
        the pill. The bar does not close any more, so the class answers the
        drag instead: the handle grows under the finger holding it."""
        sheet = css("components.css")
        self.assertIn(".media-volume.is-adjusting .media-volume-slider::-webkit-slider-thumb",
                      sheet)
        self.assertIn(".media-volume.is-adjusting .media-volume-slider::-moz-range-thumb",
                      sheet)

    def test_dragging_to_the_bottom_keeps_the_level_it_started_from(self):
        """Otherwise muting by dragging left the clip at the few percent the
        pointer passed through on the way down, and tapping the speaker
        brought it back almost silent."""
        handler = volume_handler()
        zero = handler[handler.index("if (level === 0) {"):handler.index("} else {")]
        self.assertIn("video.volume = levelBeforeDrag", zero)
        self.assertIn("video.muted = true", zero)

    def test_the_starting_level_is_captured_by_pointer_and_by_keyboard(self):
        handler = volume_handler()
        self.assertIn("slider.addEventListener('pointerdown', rememberLevel)", handler)
        self.assertIn("slider.addEventListener('keydown', rememberLevel)", handler)

    def test_almost_nothing_is_not_remembered_as_the_level(self):
        self.assertIn("video.volume > 0.05", volume_handler())


if __name__ == '__main__':
    unittest.main()

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
    start = SCRIPT.index("function initVolumeControls(")
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
    """The corner control is a speaker until the pointer reaches it.

    It sits on top of somebody's clip, so at rest it is the smallest thing
    that still says "sound": a speaker, and nothing else. Bring the pointer
    to the speaker and the level rises above it. A keyboard reaches it with
    focus, a phone has it unfolded already, and a drag holds it open after
    the pointer has left the pill -- those are the three cases below that a
    plain :hover does not cover.

    Where the control is a row in a toolbar instead of a thing on a picture,
    the bar is simply out: .media-volume-track itself hides nothing, and only
    the rule scoped to .media-volume-corner folds it away.
    """

    def test_the_toolbar_control_hides_nothing(self):
        """Only the corner folds. A control that is not on a picture has
        nothing to keep out of the way of."""
        body = rule("components.css", ".media-volume-track")
        self.assertIsNotNone(body)
        self.assertNotRegex(body, r"max-height:\s*0")
        self.assertNotRegex(body, r"display:\s*none")
        self.assertNotRegex(body, r"opacity:\s*0")

    def test_the_corner_control_is_folded_away_at_rest(self):
        body = rule("components.css", ".media-volume-corner .media-volume-track")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"max-height:\s*0")
        self.assertRegex(body, r"opacity:\s*0")
        self.assertRegex(body, r"overflow:\s*hidden")
        # Clipped, not removed: display:none cannot be transitioned, so the
        # bar would blink in instead of rising.
        self.assertNotRegex(body, r"display:\s*none")

    def test_the_pointer_on_the_speaker_opens_it(self):
        body = rule("components.css",
                    ".media-volume-corner:hover .media-volume-track")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"max-height:\s*[1-9]")
        self.assertRegex(body, r"opacity:\s*1")

    def test_a_keyboard_and_a_drag_open_it_too(self):
        """Three gestures, one rule. A keyboard never hovers, and a drag
        along a 72px bar leaves a 30px pill long before it is finished."""
        sheet = css("components.css")
        for gate in (".media-volume-corner:has(:focus-visible) .media-volume-track",
                     ".media-volume-corner.is-adjusting .media-volume-track"):
            with self.subTest(selector=gate):
                self.assertIn(gate, sheet)

    def test_focus_within_is_not_what_opens_it(self):
        """Clicking the handle focuses it, so :focus-within left the bar
        stuck open after a mouse drag until something else was clicked.
        :focus-visible is the browser's own answer to "was this a
        keyboard"."""
        self.assertNotIn(".media-volume-corner:focus-within",
                         css("components.css"))

    def test_opening_it_does_not_move_the_speaker(self):
        """The control is anchored by its bottom edge, so the bar grows
        upward into the picture. If the speaker moved instead, opening the
        control would slide it out from under the pointer that opened it and
        it would shut again."""
        body = rule("components.css", ".media-volume-corner")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"inset-block-end:\s*12px")
        self.assertRegex(body, r"inset-block-start:\s*auto")

    def test_the_fold_is_animated(self):
        """A bar that snaps in and out under a passing pointer reads as a
        glitch on the clip."""
        for selector in (".media-volume-corner",
                         ".media-volume-corner .media-volume-track"):
            with self.subTest(selector=selector):
                body = rule("components.css", selector)
                self.assertIsNotNone(body)
                self.assertRegex(body, r"transition:")

    def test_a_passing_pointer_is_given_a_moment(self):
        """A pointer crossing the corner on its way somewhere else should
        not throw the bar open -- but a drag has to answer at once, so the
        delay is excluded while the handle is held."""
        sheet = css("components.css")
        self.assertIn(".media-volume-corner:hover:not(.is-adjusting) "
                      ".media-volume-track", sheet)

    def test_less_motion_means_no_slide(self):
        # There is more than one reduced-motion block in this section, so
        # take the one that speaks about this control rather than the first.
        blocks = [body for body in
                  re.findall(r"@media \(prefers-reduced-motion: reduce\) \{(.*?)\n\}\n",
                             css("components.css"), re.S)
                  if ".media-volume-corner" in body]
        self.assertEqual(len(blocks), 1)
        self.assertRegex(blocks[0], r"transition:\s*none")

    def test_the_bar_has_a_length_to_drag_along(self):
        body = rule("components.css", ".media-volume-corner .media-volume-slider")
        self.assertIsNotNone(body)
        height = re.search(r"height:\s*(\d+)px", body)
        self.assertIsNotNone(height)
        self.assertGreaterEqual(int(height.group(1)), 60,
                                "too short to aim at")

    def test_the_bar_stands_up_without_the_native_widget(self):
        """appearance: slider-vertical turns the browser's own widget back
        on and brings the system colours with it -- the bar came back blue
        instead of the product's white. writing-mode stands it up and keeps
        appearance: none, so the track and handle drawn below are the ones
        that show."""
        body = rule("components.css", ".media-volume-corner .media-volume-slider")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"writing-mode:\s*vertical-lr")
        self.assertRegex(body, r"direction:\s*rtl")
        # Without stripping the comments this reads the explanation of why
        # the old property is not used as a use of it.
        declarations = re.sub(r"/\*.*?\*/", "", body, flags=re.S)
        self.assertNotIn("slider-vertical", declarations)

    def test_the_speaker_and_the_bar_are_spaced_apart(self):
        """They are one pill; without the gap the thumb sits on the icon.
        Closed, the gap goes -- there is nothing to space the speaker from."""
        body = rule("components.css", ".media-volume")
        self.assertIsNotNone(body)
        self.assertRegex(body, r"gap:\s*var\(--space")
        opened = rule("components.css", ".media-volume-corner:hover")
        self.assertIsNotNone(opened)
        self.assertRegex(opened, r"gap:\s*var\(--space")

    def test_a_touch_screen_gets_the_bar_without_asking(self):
        """A finger is blunter than a pointer, and a phone has no hover to
        open the control with: hiding the level behind a gesture that does
        not exist would leave it with a mute button and nothing else."""
        block = re.search(r"@media \(hover: none\) \{(.*?)\n\}\n",
                          css("components.css"), re.S)
        self.assertIsNotNone(block)
        body = block.group(1)
        self.assertIn(".media-volume-slider", body)
        self.assertIn(".media-volume-corner .media-volume-track", body)
        self.assertRegex(body, r"max-height:\s*[1-9]")
        self.assertRegex(body, r"opacity:\s*1")

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
        """is-adjusting holds the bar open through a drag that has left the
        pill, and it does one more thing: the handle grows under the finger
        holding it, so the thing being dragged is visible past the cursor."""
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


class EveryClipGetsOneTests(unittest.TestCase):
    """Including the clips that were not on the page when it loaded.

    The feed appends slides as the reader scrolls, and the rail swaps its
    panel for a fresh one. Those arrive after initVolumeControls() has run,
    so a clip loaded later had a speaker that was wired to nothing: pressing
    it did not mute, and there was no bar on it at all.
    """

    def test_a_clip_that_arrives_later_is_wired_too(self):
        self.assertIn("new MutationObserver", SCRIPT)
        observer = SCRIPT[SCRIPT.index("const watchForNewControls"):]
        observer = observer[:observer.index("watchForNewControls.observe")]
        self.assertIn("[data-volume-control]", observer)
        self.assertIn("initVolumeControls(", observer)

    def test_it_watches_the_whole_page(self):
        """A new slide can land anywhere -- the feed, the rail, a dialog."""
        start = SCRIPT.index("watchForNewControls.observe")
        self.assertIn("subtree: true", SCRIPT[start:start + 200])
        self.assertIn("childList: true", SCRIPT[start:start + 200])

    def test_a_control_is_never_wired_twice(self):
        """The observer re-runs the pass over a subtree that may already
        hold wired controls. Listening twice would run every repaint as
        many times as the control had been seen."""
        handler = volume_handler()
        self.assertIn("volumeBound", handler)
        self.assertIn("return", handler[:handler.index("const slider")])

    def test_the_pass_can_be_given_a_subtree(self):
        """Otherwise each new slide re-scans the entire document."""
        self.assertIn("function initVolumeControls(root)", SCRIPT)
        self.assertIn("(root || document).querySelectorAll", SCRIPT)


if __name__ == '__main__':
    unittest.main()

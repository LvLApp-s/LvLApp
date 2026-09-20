"""The gender choice is the one control on the sign-up form built from radios.

Its markup nests a span for the translated label inside the span that draws
the button, so a descendant selector styles both -- which is exactly the bug
this file guards against, because it renders as a second bordered box around
every label and nothing in the test suite would otherwise notice.
"""
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSS = ROOT / "static" / "css" / "gender.css"
TEMPLATES = {
    "auth.html": ROOT / "templates" / "auth.html",
    "oauth_onboarding.html": ROOT / "templates" / "oauth_onboarding.html",
}


class GenderSelectorCssTests(unittest.TestCase):
    def setUp(self):
        self.css = CSS.read_text(encoding="utf-8")

    def test_the_button_is_styled_by_direct_child_only(self):
        """`.gender-option span` also matches the label inside it."""
        self.assertIn(".gender-option > span {", self.css)
        self.assertNotRegex(self.css, r"\.gender-option\s+span\s*\{",
                            "a descendant selector boxes the label as well as the button")

    def test_no_selector_reaches_the_inner_label_by_accident(self):
        for match in re.findall(r"^([^{@}]+)\{", self.css, re.MULTILINE):
            selector = match.strip()
            if "gender-option" not in selector:
                continue
            with self.subTest(selector=selector):
                self.assertNotRegex(
                    selector, r"gender-option(?:-\w+)?\s+span(?:\s|,|$)",
                    "descendant span selector reaches the nested label")

    def test_the_selected_option_is_legible_on_its_own(self):
        """A 12% wash is not a state; the tick is what makes it readable."""
        self.assertIn(".gender-option input:checked + span .gender-option-check", self.css)

    def test_the_hidden_radio_still_draws_a_focus_ring(self):
        self.assertIn(".gender-option input:focus-visible + span", self.css)
        focus = self.css.split(".gender-option input:focus-visible + span")[1].split("}")[0]
        self.assertIn("outline", focus, "keyboard users get no visible focus")

    def test_the_two_options_stack_on_a_narrow_screen(self):
        self.assertRegex(self.css, r"@media[^{]*max-width:\s*3[0-9]{2}px[^{]*\{\s*\.gender-options\s*\{[^}]*grid-template-columns:\s*1fr")

    def test_removed_classes_leave_no_dead_rules(self):
        for gone in (".gender-preview", "[data-gender-swatch]", ".male-option span", ".female-option span"):
            with self.subTest(selector=gone):
                self.assertNotIn(gone, self.css)


class GenderSelectorMarkupTests(unittest.TestCase):
    """Both forms that ask for a gender must offer the same control."""

    def test_each_option_shows_the_avatar_it_sets(self):
        for name, path in TEMPLATES.items():
            markup = path.read_text(encoding="utf-8")
            for sex in ("male", "female"):
                with self.subTest(template=name, option=sex):
                    block = markup.split(f'class="gender-option {sex}-option"')[1].split("</label>")[0]
                    self.assertIn("gender-option-avatar", block)
                    self.assertIn(f"default-{sex}-avatar.svg", block)
                    # The avatar repeats the radio's own value, so it must not
                    # be announced twice to a screen reader.
                    self.assertIn('aria-hidden="true"', block)

    def test_each_option_carries_the_tick(self):
        for name, path in TEMPLATES.items():
            markup = path.read_text(encoding="utf-8")
            with self.subTest(template=name):
                self.assertEqual(markup.count("gender-option-check"), 2)

    def test_the_label_stays_translatable(self):
        for name, path in TEMPLATES.items():
            markup = path.read_text(encoding="utf-8")
            for key in ('data-i18n="auth_male"', 'data-i18n="auth_female"', 'data-i18n="auth_gender"'):
                with self.subTest(template=name, key=key):
                    self.assertIn(key, markup)

    def test_the_radios_are_still_required_and_named(self):
        for name, path in TEMPLATES.items():
            markup = path.read_text(encoding="utf-8")
            block = markup.split('class="gender-options"')[1].split("</div>")[0]
            with self.subTest(template=name):
                self.assertEqual(block.count('name="gender"'), 2)
                self.assertEqual(block.count("required"), 2)
                self.assertIn('value="Male"', block)
                self.assertIn('value="Female"', block)

    def test_the_dropped_preview_left_no_markup_or_script(self):
        script = (ROOT / "static" / "js" / "script.js").read_text(encoding="utf-8")
        for name, path in TEMPLATES.items():
            with self.subTest(template=name):
                self.assertNotIn("data-gender-preview", path.read_text(encoding="utf-8"))
        for token in ("data-gender-preview", "data-gender-swatch", "initGenderPreview"):
            with self.subTest(token=token):
                self.assertNotIn(token, script)


if __name__ == "__main__":
    unittest.main()

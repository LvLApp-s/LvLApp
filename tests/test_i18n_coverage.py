"""Every user-facing string must resolve in English, Turkish and Arabic.

The translation tables live in a browser script, so they are evaluated with
node. If node is unavailable the test skips rather than failing the suite.
"""
import json
import re
import shutil
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LANGUAGES = ("en", "tr", "ar")

DUMP_SCRIPT = r"""
const fs = require('fs'), vm = require('vm');
const src = fs.readFileSync(process.argv[1], 'utf8');
const stub = () => ({ forEach() {}, length: 0 });
const sandbox = {
  navigator: { language: 'en' },
  localStorage: { getItem() { return null; }, setItem() {} },
  document: {
    querySelectorAll: stub,
    documentElement: { setAttribute() {}, getAttribute() { return 'en'; } },
    addEventListener() {}, dispatchEvent() {}, readyState: 'complete', title: '',
  },
  CustomEvent: function () {}, console,
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(src, sandbox);
const tables = sandbox.TRANSLATIONS || sandbox.LvLI18n.TRANSLATIONS;
const out = {};
for (const [lang, table] of Object.entries(tables)) out[lang] = Object.keys(table);
console.log(JSON.stringify(out));
"""


def referenced_keys():
    """Keys the templates and the client script actually ask for."""
    keys = set()
    for path in sorted((ROOT / "templates").glob("*.html")):
        text = path.read_text(encoding="utf-8")
        keys |= set(re.findall(r'data-i18n(?:-[a-z]+)?="([a-z0-9_]+)"', text))
    script = (ROOT / "static" / "js" / "script.js").read_text(encoding="utf-8")
    for helper in ("translateUi", "translateUiLocal", "translateReplyUi"):
        keys |= set(re.findall(helper + r"\('([a-z0-9_]+)'", script))
    return keys


def translation_tables():
    node = shutil.which("node")
    if not node:
        raise unittest.SkipTest("node is required to evaluate static/js/i18n.js")
    result = subprocess.run(
        [node, "-e", DUMP_SCRIPT, str(ROOT / "static" / "js" / "i18n.js")],
        capture_output=True, text=True, cwd=ROOT,
    )
    if result.returncode:
        raise AssertionError(f"i18n.js failed to evaluate: {result.stderr[:500]}")
    return json.loads(result.stdout)


class I18nCoverageTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tables = translation_tables()
        cls.keys = referenced_keys()

    def test_every_referenced_key_resolves_in_every_language(self):
        for lang in LANGUAGES:
            with self.subTest(language=lang):
                missing = sorted(self.keys - set(self.tables[lang]))
                self.assertEqual(missing, [], f"{lang} is missing {len(missing)} keys")

    def test_turkish_and_arabic_cover_the_english_table(self):
        english = set(self.tables["en"])
        for lang in ("tr", "ar"):
            with self.subTest(language=lang):
                gap = sorted(english & self.keys - set(self.tables[lang]))
                self.assertEqual(gap, [])

    def test_registration_strings_exist_in_all_languages(self):
        required = {
            "auth_password_confirm", "auth_terms_prefix", "auth_terms_link",
            "auth_privacy_link", "auth_age_hint", "terms_required",
            "password_mismatch", "username_available", "username_taken",
            "username_invalid", "cookie_title", "cookie_accept",
            "cookie_essential_only", "verified_account",
        }
        for lang in LANGUAGES:
            with self.subTest(language=lang):
                self.assertEqual(required - set(self.tables[lang]), set())

    def test_minimum_age_copy_says_sixteen(self):
        script = (ROOT / "static" / "js" / "i18n.js").read_text(encoding="utf-8")
        self.assertNotIn("at least 14 years old", script)
        self.assertNotIn("en az 14 ya", script)
        self.assertIn("at least 16 years old", script)

    def test_arabic_is_registered_as_right_to_left(self):
        script = (ROOT / "static" / "js" / "i18n.js").read_text(encoding="utf-8")
        self.assertIn("const RTL_LANGS = ['ar']", script)
        self.assertIn("RTL_LANGS.includes(lang)?'rtl':'ltr'", script)

    def test_language_switcher_offers_all_three_languages(self):
        auth = (ROOT / "templates" / "auth.html").read_text(encoding="utf-8")
        for lang in LANGUAGES:
            with self.subTest(language=lang):
                self.assertIn(f'data-lang-btn="{lang}"', auth)


if __name__ == "__main__":
    unittest.main()

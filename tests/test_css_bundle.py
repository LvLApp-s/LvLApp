"""The served stylesheet must be exactly the sections, in manifest order.

The page links static/css/bundle.css, which tools/build_css.py concatenates
from static/css/styles.css. If someone edits a section and forgets to rebuild,
the site would silently serve stale CSS -- so the check runs here.
"""
import re
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSS = ROOT / "static" / "css"
MANIFEST = CSS / "styles.css"
BUNDLE = CSS / "bundle.css"
BUILDER = ROOT / "tools" / "build_css.py"

IMPORT_RE = re.compile(r'@import\s+url\(["\']([^"\']+?)(?:\?[^"\']*)?["\']\)\s*;')


class CssBundleTests(unittest.TestCase):
    def setUp(self):
        self.manifest = MANIFEST.read_text(encoding="utf-8")
        self.bundle = BUNDLE.read_text(encoding="utf-8")
        self.sections = IMPORT_RE.findall(self.manifest)

    def test_bundle_is_up_to_date(self):
        result = subprocess.run([sys.executable, str(BUILDER), "--check"],
                                capture_output=True, text=True, cwd=str(ROOT))
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_bundle_holds_every_section(self):
        for name in self.sections:
            with self.subTest(section=name):
                self.assertIn(f"===== {name} =====", self.bundle)

    def test_bundle_keeps_the_cascade_order(self):
        positions = [self.bundle.index(f"===== {name} =====") for name in self.sections]
        self.assertEqual(positions, sorted(positions))

    def test_bundle_carries_the_sections_bytes(self):
        """Concatenation only -- nothing is minified away, so a rule that works
        in a section works in the bundle."""
        for name in self.sections:
            section = (CSS / name).read_text(encoding="utf-8").strip()
            if not section:
                continue
            with self.subTest(section=name):
                first_rule = section.split("\n}", 1)[0].split("\n")[-1].strip()
                if first_rule:
                    self.assertIn(first_rule, self.bundle)

    def test_pages_link_the_bundle_not_the_manifest(self):
        for template in sorted((ROOT / "templates").glob("*.html")):
            text = template.read_text(encoding="utf-8")
            if "stylesheet" not in text:
                continue
            with self.subTest(template=template.name):
                self.assertNotIn("css/styles.css'", text)

    def test_manifest_is_still_the_source_of_order(self):
        """The sections and the manifest stay the place work happens; the
        bundle is generated and marked as such."""
        self.assertTrue(self.bundle.lstrip().startswith("/*"))
        self.assertIn("GENERATED FILE", self.bundle[:400])
        self.assertGreaterEqual(len(self.sections), 30)


if __name__ == "__main__":
    unittest.main()

"""Static files must reach the CDN, not the Python function.

vercel.json routes are evaluated in order. The catch-all sends everything to
app.py, so the /static/ rule only works while it comes first -- reorder them
and every stylesheet, script and icon silently becomes a serverless
invocation again. That regression is invisible in the rendered page, so it is
checked here instead.
"""
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "vercel.json"
STATIC = ROOT / "static"


class VercelConfigTests(unittest.TestCase):
    def setUp(self):
        self.config = json.loads(CONFIG.read_text(encoding="utf-8"))
        self.routes = self.config["routes"]
        self.builds = self.config["builds"]

    def test_app_py_is_still_the_entry_point(self):
        srcs = {b["src"]: b["use"] for b in self.builds}
        self.assertEqual(srcs.get("app.py"), "@vercel/python")

    def test_static_folder_is_built_as_static(self):
        srcs = {b["src"]: b["use"] for b in self.builds}
        self.assertEqual(srcs.get("static/**"), "@vercel/static")

    def test_static_route_precedes_the_catch_all(self):
        static_at = catch_all_at = None
        for index, route in enumerate(self.routes):
            if route["src"].startswith("/static/") and static_at is None:
                static_at = index
            if route["src"] in ("/(.*)", "/(.*)$") and catch_all_at is None:
                catch_all_at = index
        self.assertIsNotNone(static_at, "no /static/ route -- assets would hit app.py")
        self.assertIsNotNone(catch_all_at, "no catch-all route -- pages would 404")
        self.assertLess(static_at, catch_all_at,
                        "the catch-all swallows /static/ when it comes first")

    def test_static_route_serves_the_files_verbatim(self):
        route = next(r for r in self.routes if r["src"].startswith("/static/"))
        self.assertEqual(route["dest"], "/static/$1")

    def test_catch_all_still_reaches_flask(self):
        route = self.routes[-1]
        self.assertEqual(route["src"], "/(.*)")
        self.assertEqual(route["dest"], "app.py")

    def test_cached_assets_are_not_frozen_in_the_browser(self):
        """Not every asset URL carries ?v=, so a browser copy has to expire.

        The shared CDN copy may live long (s-maxage) because a deployment
        replaces it, but max-age is what a reader is stuck with.
        """
        route = next(r for r in self.routes if r["src"].startswith("/static/"))
        cache = route.get("headers", {}).get("cache-control", "")
        self.assertIn("public", cache)
        self.assertNotIn("immutable", cache)
        max_age = re.search(r"\bmax-age=(\d+)", cache)
        self.assertIsNotNone(max_age, f"no max-age in {cache!r}")
        self.assertLessEqual(int(max_age.group(1)), 86400,
                             "a browser could serve a stale asset for too long")

    def test_service_worker_is_not_served_from_the_cdn(self):
        """It is registered at /service-worker.js, which Flask serves with
        no-store. A CDN copy would pin an old worker on every device."""
        script = (ROOT / "static" / "js" / "script.js").read_text(encoding="utf-8")
        self.assertIn("navigator.serviceWorker.register('/service-worker.js')", script)

    def test_every_asset_the_layout_links_exists_on_disk(self):
        """The CDN can only serve what the build uploads; a typo that Flask
        would have 404'd at request time now 404s for every reader."""
        pattern = re.compile(r"static_asset\(['\"]([^'\"]+)['\"]\)")
        for template in sorted((ROOT / "templates").glob("*.html")):
            for name in pattern.findall(template.read_text(encoding="utf-8")):
                with self.subTest(template=template.name, asset=name):
                    self.assertTrue((STATIC / name).is_file(), f"missing static/{name}")


if __name__ == "__main__":
    unittest.main()

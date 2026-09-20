#!/usr/bin/env python3
"""Concatenate the stylesheet manifest into one file.

static/css/styles.css is the manifest: an ordered list of @import rules that
defines the cascade. The browser has to download it, parse it, and only then
discover the 33 files it references -- and @import blocks rendering, so the
page waits for a second round trip before it can paint.

This writes the same bytes in the same order into static/css/bundle.css, which
the layout links instead. The manifest stays the source of truth for order;
run this script after adding, removing or reordering a section.

    python tools/build_css.py            # write the bundle
    python tools/build_css.py --check    # exit 1 if the bundle is stale

tests/test_css_bundle.py runs the check, so the bundle cannot drift from the
sections without the suite failing.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSS = ROOT / "static" / "css"
MANIFEST = CSS / "styles.css"
BUNDLE = CSS / "bundle.css"

IMPORT_RE = re.compile(r'@import\s+url\(["\']([^"\']+?)(?:\?[^"\']*)?["\']\)\s*;')

HEADER = """/* ---------------------------------------------------------------------------
   GENERATED FILE -- do not edit.

   Built from static/css/styles.css by tools/build_css.py, in manifest order.
   Edit the section files under static/css/sections/ and re-run the script.
   --------------------------------------------------------------------------- */
"""


def sections() -> list[Path]:
    """The section files, in the order the manifest imports them."""
    manifest = MANIFEST.read_text(encoding="utf-8")
    return [CSS / name for name in IMPORT_RE.findall(manifest)]


def build() -> str:
    parts = [HEADER]
    for path in sections():
        if not path.exists():
            raise SystemExit(f"manifest points at a missing file: {path}")
        parts.append(f"\n/* ===== {path.relative_to(CSS)} ===== */\n")
        parts.append(path.read_text(encoding="utf-8").rstrip() + "\n")
    return "".join(parts)


def main(argv: list[str]) -> int:
    built = build()
    if "--check" in argv:
        current = BUNDLE.read_text(encoding="utf-8") if BUNDLE.exists() else ""
        if current != built:
            print("bundle.css is stale -- run: python tools/build_css.py")
            return 1
        print(f"bundle.css is current ({len(sections())} sections)")
        return 0

    BUNDLE.write_text(built, encoding="utf-8")
    print(f"wrote {BUNDLE.relative_to(ROOT)} from {len(sections())} sections "
          f"({len(built):,} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))

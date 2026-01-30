#!/usr/bin/env python3
"""
Replace href="/" with href="/index.html" for home page refs in webstersschool.com.
Run from project root or from this script's directory.
"""

import os
from pathlib import Path

# Directory containing the site (same folder as this script)
SCRIPT_DIR = Path(__file__).resolve().parent
SITE_DIR = SCRIPT_DIR

# Only replace exact home ref, not href="/something"
OLD_HREF = 'href="/"'
NEW_HREF = 'href="/index.html"'

# Extensions to process
TEXT_EXTENSIONS = {".html", ".htm", ".md", ".txt"}


def process_file(filepath: Path) -> tuple[int, int]:
    """Replace OLD_HREF with NEW_HREF in file. Returns (replacements, lines_changed)."""
    try:
        text = filepath.read_text(encoding="utf-8", errors="replace")
    except OSError as e:
        print(f"  skip (read error): {e}")
        return 0, 0

    if OLD_HREF not in text:
        return 0, 0

    new_text = text.replace(OLD_HREF, NEW_HREF)
    count = text.count(OLD_HREF)
    filepath.write_text(new_text, encoding="utf-8")
    return count, 1


def main() -> None:
    if not SITE_DIR.is_dir():
        print(f"Site directory not found: {SITE_DIR}")
        return

    total_files = 0
    total_replacements = 0

    for path in sorted(SITE_DIR.rglob("*")):
        if not path.is_file():
            continue
        if path.suffix.lower() not in TEXT_EXTENSIONS:
            continue
        if path.name == Path(__file__).name:
            continue

        replacements, files_changed = process_file(path)
        if replacements:
            rel = path.relative_to(SITE_DIR)
            print(f"{rel}: {replacements} replacement(s)")
            total_replacements += replacements
            total_files += files_changed

    if total_replacements:
        print(f"\nDone: {total_replacements} replacement(s) in {total_files} file(s).")
    else:
        print("No href=\"/\" found; nothing changed.")


if __name__ == "__main__":
    main()

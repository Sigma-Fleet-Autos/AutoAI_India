#!/usr/bin/env python3
"""Fail CI when tracked runtime files reference the prohibited legacy platform."""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

FORBIDDEN = re.compile(rb"emergent(?:[._/-]|\\b)", re.IGNORECASE)
TEXT_EXTENSIONS = frozenset({
    ".py", ".js", ".jsx", ".ts", ".tsx", ".json", ".yaml", ".yml",
    ".toml", ".ini", ".cfg", ".env", ".sh", ".html", ".css", ".xml",
    ".properties", ".gradle", ".kt", ".java", ".swift", ".plist",
})
RUNTIME_ROOTS = ("backend/", "frontend/", ".github/workflows/")
RUNTIME_FILES = frozenset({"render.yaml", "vercel.json", "Dockerfile", "docker-compose.yml"})
MAX_BYTES = 5_000_000


def should_scan(name: str) -> bool:
    path = Path(name)
    if name.startswith(("backend/tests/", "frontend/src/__tests__/")):
        return False
    if not (name.startswith(RUNTIME_ROOTS) or name in RUNTIME_FILES):
        return False
    if path.name.startswith(".env") or path.name in ("Dockerfile", "Procfile"):
        return True
    return path.suffix.lower() in TEXT_EXTENSIONS


def scan(root: Path, names: list[str]) -> list[dict[str, object]]:
    findings: list[dict[str, object]] = []
    for name in names:
        if not should_scan(name):
            continue
        target = root / name
        if not target.is_file() or target.is_symlink():
            continue
        if target.stat().st_size > MAX_BYTES:
            findings.append({"file": name, "error": "file exceeds scan size limit"})
            continue
        data = target.read_bytes()
        for line_no, line in enumerate(data.splitlines(), 1):
            if FORBIDDEN.search(line):
                findings.append({"file": name, "line": line_no})
    return findings


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args(argv)
    root = args.root.resolve()
    proc = subprocess.run(
        ["git", "-C", str(root), "ls-files", "-z"],
        capture_output=True, check=False,
    )
    if proc.returncode:
        print(json.dumps({"ok": False, "error": "Unable to list tracked files"}))
        return 2
    names = [entry.decode("utf-8", errors="surrogateescape") for entry in proc.stdout.split(b"\0") if entry]
    findings = scan(root, names)
    print(json.dumps({"ok": not findings, "scanned": sum(should_scan(n) for n in names), "findings": findings}, indent=2))
    return 1 if findings else 0


if __name__ == "__main__":
    sys.exit(main())

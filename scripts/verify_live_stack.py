#!/usr/bin/env python3
"""Read-only HTTP smoke checks for AutoAI India production and staging."""
from __future__ import annotations

import argparse
import json
import sys
from dataclasses import asdict, dataclass
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import Request, urlopen


@dataclass(frozen=True)
class CheckResult:
    name: str
    url: str
    ok: bool
    status: int | None
    detail: str


def validate_origin(value: str) -> str:
    parsed = urlsplit(value)
    if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password:
        raise argparse.ArgumentTypeError("Origin must be an HTTPS URL without credentials")
    if parsed.path not in ("", "/") or parsed.query or parsed.fragment:
        raise argparse.ArgumentTypeError("Origin must not contain a path, query or fragment")
    return value.rstrip("/")


def check(name: str, url: str, *, html: bool = False, timeout: float = 12.0) -> CheckResult:
    request = Request(url, headers={"User-Agent": "AutoAI-readonly-smoke/1.0", "Accept": "text/html" if html else "application/json"}, method="GET")
    try:
        with urlopen(request, timeout=timeout) as response:
            status = response.status
            content_type = response.headers.get("Content-Type", "").lower()
            body = response.read(262144)
        if status != 200:
            return CheckResult(name, url, False, status, "Unexpected HTTP status")
        if html and (b"<html" not in body.lower() or "text/html" not in content_type):
            return CheckResult(name, url, False, status, "Expected HTML document")
        if not html:
            try:
                json.loads(body)
            except (UnicodeDecodeError, ValueError):
                return CheckResult(name, url, False, status, "Expected JSON health response")
        return CheckResult(name, url, True, status, "HTTP response validated")
    except HTTPError as exc:
        return CheckResult(name, url, False, exc.code, "HTTP request failed")
    except (URLError, TimeoutError, OSError) as exc:
        return CheckResult(name, url, False, None, type(exc).__name__)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--frontend", type=validate_origin, required=True)
    parser.add_argument("--backend", type=validate_origin, required=True)
    parser.add_argument("--timeout", type=float, default=12.0)
    args = parser.parse_args(argv)
    if not 0 < args.timeout <= 60:
        parser.error("--timeout must be between 0 and 60 seconds")
    results = [
        check("frontend", args.frontend + "/", html=True, timeout=args.timeout),
        check("backend_live", args.backend + "/health/live", timeout=args.timeout),
        check("backend_ready", args.backend + "/health/ready", timeout=args.timeout),
    ]
    print(json.dumps({"ok": all(item.ok for item in results), "checks": [asdict(item) for item in results]}, indent=2))
    return 0 if all(item.ok for item in results) else 1


if __name__ == "__main__":
    sys.exit(main())

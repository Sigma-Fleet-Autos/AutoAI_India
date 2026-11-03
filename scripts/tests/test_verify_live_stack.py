"""Unit tests for the read-only deployment smoke checker."""
import unittest
from argparse import ArgumentTypeError
from io import BytesIO
from unittest.mock import patch

from scripts.verify_live_stack import check, main, validate_origin


class Response:
    status = 200

    def __init__(self, body: bytes, content_type: str):
        self._body = body
        self.headers = {"Content-Type": content_type}

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return False

    def read(self, _size):
        return self._body


class SmokeTests(unittest.TestCase):
    def test_valid_https_origin(self):
        self.assertEqual(validate_origin("https://autoaiindia.com/"), "https://autoaiindia.com")

    def test_rejects_credentials_and_paths(self):
        for origin in ("http://example.com", "https://user:pass@example.com", "https://example.com/api"):
            with self.subTest(origin=origin), self.assertRaises(ArgumentTypeError):
                validate_origin(origin)

    @patch("scripts.verify_live_stack.urlopen")
    def test_health_json(self, urlopen):
        urlopen.return_value = Response(b'{"status":"ok"}', "application/json")
        self.assertTrue(check("health", "https://example.com/health").ok)

    @patch("scripts.verify_live_stack.urlopen")
    def test_rejects_html_instead_of_json(self, urlopen):
        urlopen.return_value = Response(b"<html>oops</html>", "text/html")
        self.assertFalse(check("health", "https://example.com/health").ok)

    @patch("scripts.verify_live_stack.urlopen")
    def test_frontend_html(self, urlopen):
        urlopen.return_value = Response(b"<!doctype html><html><body></body></html>", "text/html")
        self.assertTrue(check("frontend", "https://example.com/", html=True).ok)

    @patch("scripts.verify_live_stack.check")
    def test_main_failure_exit_code(self, check_mock):
        from scripts.verify_live_stack import CheckResult
        check_mock.return_value = CheckResult("x", "https://example.com", False, 503, "failed")
        self.assertEqual(main(["--frontend", "https://autoaiindia.com", "--backend", "https://auto-ai-api.onrender.com"]), 1)


if __name__ == "__main__":
    unittest.main()

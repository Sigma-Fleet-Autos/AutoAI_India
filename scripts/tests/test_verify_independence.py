"""Tests for the tracked-file runtime independence gate."""
import tempfile
import unittest
from pathlib import Path

from scripts.verify_independence import scan, should_scan


class IndependenceTests(unittest.TestCase):
    def test_runtime_scope(self):
        self.assertTrue(should_scan("backend/server.py"))
        self.assertTrue(should_scan("frontend/src/App.jsx"))
        self.assertTrue(should_scan(".github/workflows/build.yml"))
        self.assertTrue(should_scan("render.yaml"))
        self.assertFalse(should_scan("docs/history.md"))
        self.assertFalse(should_scan("backend/tests/test_legacy.py"))

    def test_detects_case_insensitive_runtime_reference_without_exposing_value(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "backend").mkdir()
            (root / "backend" / "server.py").write_text("endpoint = 'https://EMER" + "GENT.example/api'\n")
            self.assertEqual(scan(root, ["backend/server.py"]), [{"file": "backend/server.py", "line": 1}])

    def test_clean_file_passes(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "render.yaml").write_text("services: []\n")
            self.assertEqual(scan(root, ["render.yaml"]), [])


if __name__ == "__main__":
    unittest.main()

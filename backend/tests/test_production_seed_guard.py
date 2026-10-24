"""Regression guard: bundled demo catalog data must never seed production."""
import ast
from pathlib import Path


def test_production_catalog_seeding_is_explicitly_disabled():
    source = Path(__file__).resolve().parents[1] / "server.py"
    module = ast.parse(source.read_text(encoding="utf-8"))
    startup = next(
        node for node in module.body
        if isinstance(node, ast.AsyncFunctionDef) and node.name == "seed_db"
    )
    guards = [
        node for node in startup.body
        if isinstance(node, ast.If)
        and isinstance(node.test, ast.Compare)
        and isinstance(node.test.left, ast.Attribute)
        and isinstance(node.test.left.value, ast.Name)
        and node.test.left.value.id == "security"
        and node.test.left.attr == "APP_ENV"
        and len(node.test.ops) == 1
        and isinstance(node.test.ops[0], ast.NotEq)
        and len(node.test.comparators) == 1
        and isinstance(node.test.comparators[0], ast.Constant)
        and node.test.comparators[0].value == "production"
    ]
    seed_guards = [
        node for node in guards
        if any(
            isinstance(child, ast.Call)
            and ast.unparse(child.func) in {"db.cars.insert_many", "db.news.insert_many"}
            for child in ast.walk(node)
        )
    ]
    assert len(seed_guards) == 1, "Catalog inserts must share one non-production guard"
    guarded_calls = {
        ast.unparse(node.func)
        for node in ast.walk(seed_guards[0])
        if isinstance(node, ast.Await)
        for node in ast.walk(node.value)
        if isinstance(node, ast.Call)
    }
    assert "db.cars.insert_many" in guarded_calls
    assert "db.news.insert_many" in guarded_calls
    for node in startup.body:
        if node is seed_guards[0]:
            continue
        assert not any(
            isinstance(child, ast.Call)
            and ast.unparse(child.func) in {"db.cars.insert_many", "db.news.insert_many"}
            for child in ast.walk(node)
        )


def test_production_startup_does_not_prewarm_third_party_images():
    source = Path(__file__).resolve().parents[1] / "server.py"
    module = ast.parse(source.read_text(encoding="utf-8"))
    startup = next(
        node for node in module.body
        if isinstance(node, ast.AsyncFunctionDef) and node.name == "seed_db"
    )
    prewarm_guards = [
        node for node in startup.body
        if isinstance(node, ast.If)
        and ast.unparse(node.test) == "security.APP_ENV != 'production'"
        and any(
            isinstance(child, ast.Call)
            and ast.unparse(child.func) == "_prewarm_images"
            for child in ast.walk(node)
        )
    ]
    assert len(prewarm_guards) == 1
    for node in startup.body:
        if node is prewarm_guards[0]:
            continue
        assert not any(
            isinstance(child, ast.Call)
            and ast.unparse(child.func) == "_prewarm_images"
            for child in ast.walk(node)
        )

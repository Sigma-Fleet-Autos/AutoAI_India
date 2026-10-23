from configurator_database_authority import assess_database_authority


def test_database_authority_requires_explicit_expected_name():
    result = assess_database_authority("autoai", None)
    assert result == {
        "ready": False,
        "reason": "expected production database name is not configured",
    }


def test_database_authority_rejects_database_name_mismatch():
    result = assess_database_authority("auto_ai", "autoai")
    assert result == {
        "ready": False,
        "reason": "configured database does not match expected production database",
    }


def test_database_authority_accepts_exact_database_name():
    result = assess_database_authority("autoai", "autoai")
    assert result == {"ready": True, "reason": None}


def test_database_authority_rejects_missing_configured_name():
    result = assess_database_authority(None, "autoai")
    assert result == {
        "ready": False,
        "reason": "configured production database name is not configured",
    }


def test_database_authority_rejects_non_string_configured_name():
    result = assess_database_authority(123, "autoai")
    assert result["ready"] is False


def test_database_authority_rejects_blank_configured_name():
    result = assess_database_authority("  ", "autoai")
    assert result["ready"] is False

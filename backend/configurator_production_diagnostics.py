"""Side-effect-free diagnostics for production configurator onboarding."""

from __future__ import annotations

from configurator_database_authority import assess_database_authority


def _safe_count(value: object) -> int:
    """Treat malformed or negative diagnostic counts as zero (not ready)."""
    return value if type(value) is int and value > 0 else 0


def assess_production_configurator_diagnostics(
    configured_database_name: object,
    expected_database_name: object,
    variant_count: object,
    pricing_count: object,
    asset_count: object,
) -> dict[str, object]:
    """Report database authority and catalog counts without mutating production data."""
    database = assess_database_authority(
        configured_database_name,
        expected_database_name,
    )
    catalog = {
        "variants": _safe_count(variant_count),
        "verified_pricing": _safe_count(pricing_count),
        "published_assets": _safe_count(asset_count),
    }
    return {
        "ready": bool(database["ready"]) and all(value > 0 for value in catalog.values()),
        "database": database,
        "catalog": catalog,
    }

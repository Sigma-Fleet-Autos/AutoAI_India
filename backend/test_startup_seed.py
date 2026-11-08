"""Regression tests: staging startup must never clear existing catalogue data."""

from unittest.mock import AsyncMock

import pytest

from startup_seed import seed_collection_if_empty


@pytest.mark.asyncio
async def test_existing_catalogue_is_never_modified():
    collection = AsyncMock()
    collection.count_documents.return_value = 4

    changed = await seed_collection_if_empty(collection, [{"id": "car-1"}])

    assert changed is False
    collection.count_documents.assert_awaited_once_with({}, limit=1)
    collection.insert_many.assert_not_awaited()
    collection.delete_many.assert_not_awaited()
    collection.replace_one.assert_not_awaited()
    collection.update_many.assert_not_awaited()


@pytest.mark.asyncio
async def test_empty_catalogue_is_seeded_once_without_deletes():
    collection = AsyncMock()
    collection.count_documents.return_value = 0
    source = [{"id": "car-1", "brand": "Tata"}]

    changed = await seed_collection_if_empty(collection, source)

    assert changed is True
    collection.insert_many.assert_awaited_once_with(source)
    collection.delete_many.assert_not_awaited()
    source[0]["brand"] = "Changed"
    assert collection.insert_many.await_args.args[0][0]["brand"] == "Tata"


@pytest.mark.asyncio
async def test_no_seed_data_does_not_touch_database():
    collection = AsyncMock()

    changed = await seed_collection_if_empty(collection, [])

    assert changed is False
    collection.count_documents.assert_not_awaited()
    collection.insert_many.assert_not_awaited()
    collection.delete_many.assert_not_awaited()


@pytest.mark.asyncio
async def test_database_failure_is_not_silenced():
    collection = AsyncMock()
    collection.count_documents.side_effect = RuntimeError("database unavailable")

    with pytest.raises(RuntimeError, match="database unavailable"):
        await seed_collection_if_empty(collection, [{"id": "car-1"}])

    collection.insert_many.assert_not_awaited()
    collection.delete_many.assert_not_awaited()

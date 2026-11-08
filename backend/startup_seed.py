"""Idempotent bootstrap of static catalogue collections.

Startup never deletes or replaces existing documents. Updating an existing
catalogue requires a separately reviewed migration, not a service restart.
"""

from collections.abc import Mapping, Sequence
from typing import Protocol


class SeedCollection(Protocol):
    async def count_documents(self, filter: Mapping[str, object], *, limit: int) -> int: ...

    async def insert_many(self, documents: list[dict[str, object]]) -> object: ...


async def seed_collection_if_empty(
    collection: SeedCollection,
    documents: Sequence[Mapping[str, object]],
) -> bool:
    """Insert a non-empty seed batch only when the collection is empty.

    Existing data is never deleted or overwritten.
    """
    if not documents:
        return False
    if await collection.count_documents({}, limit=1):
        return False
    await collection.insert_many([dict(document) for document in documents])
    return True

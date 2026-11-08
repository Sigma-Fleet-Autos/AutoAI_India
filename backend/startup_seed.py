"""Idempotent bootstrap of static catalogue collections.

Startup never deletes or replaces existing documents. Updating an existing
catalogue requires a separately reviewed migration, not a service restart.
"""

from collections.abc import Mapping, Sequence
from typing import Any


async def seed_collection_if_empty(
    collection: Any,
    documents: Sequence[Mapping[str, Any]],
) -> bool:
    """Insert seed documents only into an empty collection.

    Returns True when a non-empty seed batch was inserted.
    No write occurs when the collection already contains any document.
    """
    if not documents:
        return False
    if await collection.count_documents({}, limit=1):
        return False
    await collection.insert_many([dict(document) for document in documents])
    return True

from datetime import datetime, timezone
from typing import Any, Dict, Optional

from beanie import Document
from pydantic import Field


class ContentRevision(Document):
    entity_type: str  # e.g., "product", "service", "homepage_section", "testimonial", "faq"
    entity_id: str
    action: str  # "create", "update", "delete", "publish", "unpublish"
    data_snapshot: Dict[str, Any] = Field(default_factory=dict)
    changed_by: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "content_revisions"

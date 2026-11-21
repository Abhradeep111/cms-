from datetime import datetime, timezone
from typing import List, Optional

from beanie import Document, Indexed
from pydantic import Field


class Service(Document):
    name: str
    slug: Indexed(str, unique=True)
    short_description: str
    detailed_description: Optional[str] = ""
    icon: Optional[str] = None
    thumbnail_url: Optional[str] = None
    features: List[str] = Field(default_factory=list)
    benefits: List[str] = Field(default_factory=list)
    cta_label: Optional[str] = "Learn More"
    cta_url: Optional[str] = None
    display_order: int = 0
    status: str = "published"  # draft, published, archived
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "services"

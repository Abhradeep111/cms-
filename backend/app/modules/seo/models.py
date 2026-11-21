from datetime import datetime, timezone
from typing import List, Optional

from beanie import Document, Indexed
from pydantic import Field


class SEOMetadata(Document):
    page_key: Indexed(str, unique=True)  # "homepage", "products", "services", "about-us", etc.
    title: str
    meta_description: str
    keywords: List[str] = Field(default_factory=list)
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    canonical_url: Optional[str] = None
    robots_index: bool = True
    robots_follow: bool = True
    json_ld: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "seo_metadata"

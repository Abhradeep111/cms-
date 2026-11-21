from datetime import datetime, timezone
from typing import List, Optional

from beanie import Document, Indexed
from pydantic import Field


class Product(Document):
    name: str
    slug: Indexed(str, unique=True)
    short_description: str
    detailed_description: Optional[str] = ""
    product_logo: Optional[str] = None
    product_thumbnail: Optional[str] = None
    product_url: Optional[str] = None
    features: List[str] = Field(default_factory=list)
    benefits: List[str] = Field(default_factory=list)
    cta_label: Optional[str] = "Request Demo"
    display_order: int = 0
    is_featured: bool = False
    status: str = "published"  # draft, published, archived
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None

    # Landing page module catalogue compatibility fields
    code: Optional[str] = None
    abbr: Optional[str] = None
    release_date: Optional[str] = None  # e.g., "Live", "Q3 2026"

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "products"

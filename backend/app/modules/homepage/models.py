from datetime import datetime, timezone
from typing import Any, Dict, Optional

from beanie import Document, Indexed
from pydantic import Field


class HomepageSection(Document):
    section_key: Indexed(str, unique=True)
    # Common fields across sections
    heading: str = ""
    subheading: Optional[str] = ""
    description: Optional[str] = ""
    image_url: Optional[str] = None
    primary_cta_label: Optional[str] = None
    primary_cta_url: Optional[str] = None
    secondary_cta_label: Optional[str] = None
    secondary_cta_url: Optional[str] = None
    # Section-specific rich data (e.g. features list, stats array, mission/vision, selected items)
    content_json: Dict[str, Any] = Field(default_factory=dict)
    display_order: int = 0
    is_visible: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "homepage_sections"

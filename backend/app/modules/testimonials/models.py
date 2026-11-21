from datetime import datetime, timezone
from typing import Optional

from beanie import Document
from pydantic import Field


class Testimonial(Document):
    customer_name: str
    designation: str
    company: str
    content: str
    profile_image_url: Optional[str] = None
    rating: int = 5
    display_order: int = 0
    status: str = "published"  # draft, published, archived
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "testimonials"

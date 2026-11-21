from datetime import datetime, timezone

from beanie import Document
from pydantic import Field


class FAQ(Document):
    question: str
    answer: str
    category: str = "General"
    display_order: int = 0
    status: str = "published"  # draft, published, archived
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "faqs"

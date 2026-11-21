from datetime import datetime, timezone
from typing import Optional

from beanie import Document
from pydantic import Field


class MediaAsset(Document):
    filename: str
    original_name: str
    file_path: str
    file_size: int
    mime_type: str
    alt_text: Optional[str] = ""
    url: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "media_assets"

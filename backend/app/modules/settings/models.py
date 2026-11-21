from datetime import datetime, timezone
from typing import Any, Dict

from beanie import Document, Indexed
from pydantic import Field


class SiteSetting(Document):
    setting_key: Indexed(str, unique=True)  # "general", "contact", "footer"
    data: Dict[str, Any] = Field(default_factory=dict)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "site_settings"

from datetime import datetime, timezone
from typing import Optional

from beanie import Document
from pydantic import Field


class NavigationItem(Document):
    label: str
    url: str
    parent_id: Optional[str] = None
    display_order: int = 0
    open_in_new_tab: bool = False
    is_visible: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "navigation_menus"

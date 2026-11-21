from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class NavigationItemBase(BaseModel):
    label: str = Field(..., min_length=1)
    url: str = Field(..., min_length=1)
    parent_id: Optional[str] = None
    display_order: int = 0
    open_in_new_tab: bool = False
    is_visible: bool = True


class NavigationItemCreate(NavigationItemBase):
    pass


class NavigationItemUpdate(BaseModel):
    label: Optional[str] = None
    url: Optional[str] = None
    parent_id: Optional[str] = None
    display_order: Optional[int] = None
    open_in_new_tab: Optional[bool] = None
    is_visible: Optional[bool] = None


class NavigationItemResponse(NavigationItemBase):
    id: str
    children: List["NavigationItemResponse"] = []
    created_at: datetime
    updated_at: datetime


class NavigationReorderItem(BaseModel):
    id: str
    display_order: int

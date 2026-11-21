from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class FAQBase(BaseModel):
    question: str = Field(..., min_length=3)
    answer: str = Field(..., min_length=3)
    category: str = "General"
    display_order: int = 0
    status: str = "published"  # draft, published, archived


class FAQCreate(FAQBase):
    pass


class FAQUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    category: Optional[str] = None
    display_order: Optional[int] = None
    status: Optional[str] = None


class FAQResponse(FAQBase):
    id: str
    created_at: datetime
    updated_at: datetime


class FAQListResponse(BaseModel):
    items: List[FAQResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

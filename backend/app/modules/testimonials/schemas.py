from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class TestimonialBase(BaseModel):
    customer_name: str = Field(..., min_length=2)
    designation: str
    company: str
    content: str = Field(..., min_length=10)
    profile_image_url: Optional[str] = None
    rating: int = Field(5, ge=1, le=5)
    display_order: int = 0
    status: str = "published"  # draft, published, archived


class TestimonialCreate(TestimonialBase):
    pass


class TestimonialUpdate(BaseModel):
    customer_name: Optional[str] = None
    designation: Optional[str] = None
    company: Optional[str] = None
    content: Optional[str] = None
    profile_image_url: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    display_order: Optional[int] = None
    status: Optional[str] = None


class TestimonialResponse(TestimonialBase):
    id: str
    created_at: datetime
    updated_at: datetime


class TestimonialListResponse(BaseModel):
    items: List[TestimonialResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

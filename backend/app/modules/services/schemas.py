from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class ServiceBase(BaseModel):
    name: str = Field(..., min_length=2)
    slug: Optional[str] = None
    short_description: str
    detailed_description: Optional[str] = ""
    icon: Optional[str] = None
    thumbnail_url: Optional[str] = None
    features: List[str] = Field(default_factory=list)
    benefits: List[str] = Field(default_factory=list)
    cta_label: Optional[str] = "Learn More"
    cta_url: Optional[str] = None
    display_order: int = 0
    status: str = "published"  # draft, published, archived


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    short_description: Optional[str] = None
    detailed_description: Optional[str] = None
    icon: Optional[str] = None
    thumbnail_url: Optional[str] = None
    features: Optional[List[str]] = None
    benefits: Optional[List[str]] = None
    cta_label: Optional[str] = None
    cta_url: Optional[str] = None
    display_order: Optional[int] = None
    status: Optional[str] = None


class ServiceResponse(ServiceBase):
    id: str
    slug: str
    created_at: datetime
    updated_at: datetime


class ServiceListResponse(BaseModel):
    items: List[ServiceResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

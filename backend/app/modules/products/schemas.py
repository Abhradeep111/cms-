from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class ProductBase(BaseModel):
    name: str = Field(..., min_length=2)
    slug: Optional[str] = None
    short_description: str
    detailed_description: Optional[str] = ""
    product_logo: Optional[str] = None
    product_thumbnail: Optional[str] = None
    product_url: Optional[str] = None
    features: List[str] = Field(default_factory=list)
    benefits: List[str] = Field(default_factory=list)
    cta_label: Optional[str] = "Request Demo"
    display_order: int = 0
    is_featured: bool = False
    status: str = "published"  # draft, published, archived
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    code: Optional[str] = None
    abbr: Optional[str] = None
    release_date: Optional[str] = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    short_description: Optional[str] = None
    detailed_description: Optional[str] = None
    product_logo: Optional[str] = None
    product_thumbnail: Optional[str] = None
    product_url: Optional[str] = None
    features: Optional[List[str]] = None
    benefits: Optional[List[str]] = None
    cta_label: Optional[str] = None
    display_order: Optional[int] = None
    is_featured: Optional[bool] = None
    status: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    code: Optional[str] = None
    abbr: Optional[str] = None
    release_date: Optional[str] = None


class ProductStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(draft|published|archived)$")


class ProductReorderItem(BaseModel):
    id: str
    display_order: int


class ProductResponse(ProductBase):
    id: str
    slug: str
    created_at: datetime
    updated_at: datetime


class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

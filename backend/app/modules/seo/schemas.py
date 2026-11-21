from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class SEOMetadataBase(BaseModel):
    title: str = Field(..., min_length=2)
    meta_description: str = Field(..., min_length=5)
    keywords: List[str] = Field(default_factory=list)
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    canonical_url: Optional[str] = None
    robots_index: bool = True
    robots_follow: bool = True
    json_ld: Optional[str] = None


class SEOMetadataCreate(SEOMetadataBase):
    page_key: str


class SEOMetadataUpdate(BaseModel):
    title: Optional[str] = None
    meta_description: Optional[str] = None
    keywords: Optional[List[str]] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    canonical_url: Optional[str] = None
    robots_index: Optional[bool] = None
    robots_follow: Optional[bool] = None
    json_ld: Optional[str] = None


class SEOMetadataResponse(SEOMetadataBase):
    id: str
    page_key: str
    created_at: datetime
    updated_at: datetime

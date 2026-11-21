from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class MediaAssetResponse(BaseModel):
    id: str
    filename: str
    original_name: str
    file_size: int
    mime_type: str
    alt_text: Optional[str] = ""
    url: str
    created_at: datetime
    updated_at: datetime


class MediaListResponse(BaseModel):
    items: List[MediaAssetResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class RecentActivityItem(BaseModel):
    id: str
    entity_type: str
    entity_id: str
    action: str
    changed_by: Optional[str] = None
    created_at: datetime


class DashboardStatsResponse(BaseModel):
    total_products: int
    published_products: int
    draft_products: int
    total_services: int
    total_testimonials: int
    total_faqs: int
    media_assets_count: int
    recent_updates: List[RecentActivityItem]

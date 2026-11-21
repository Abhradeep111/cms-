from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class HomepageSectionBase(BaseModel):
    heading: str = ""
    subheading: Optional[str] = ""
    description: Optional[str] = ""
    image_url: Optional[str] = None
    primary_cta_label: Optional[str] = None
    primary_cta_url: Optional[str] = None
    secondary_cta_label: Optional[str] = None
    secondary_cta_url: Optional[str] = None
    content_json: Dict[str, Any] = Field(default_factory=dict)
    display_order: int = 0
    is_visible: bool = True


class HomepageSectionUpdate(HomepageSectionBase):
    pass


class HomepageSectionResponse(HomepageSectionBase):
    id: str
    section_key: str
    created_at: datetime
    updated_at: datetime


class StatisticItem(BaseModel):
    label: str
    numeric_value: str
    prefix: Optional[str] = ""
    suffix: Optional[str] = ""
    display_order: int = 0
    is_visible: bool = True


class WhyChooseUsFeature(BaseModel):
    title: str
    description: str
    icon: Optional[str] = "ShieldCheck"
    display_order: int = 0


class HeroSectionSchema(BaseModel):
    heading: str
    subheading: Optional[str] = ""
    description: str
    hero_image: Optional[str] = None
    primary_cta_label: str
    primary_cta_url: str
    secondary_cta_label: Optional[str] = ""
    secondary_cta_url: Optional[str] = ""
    is_visible: bool = True


class AboutSectionSchema(BaseModel):
    heading: str
    description: str
    image: Optional[str] = None
    mission: Optional[str] = ""
    vision: Optional[str] = ""
    additional_content: Optional[str] = ""
    is_visible: bool = True


class ContactCTASchema(BaseModel):
    heading: str
    description: str
    button_label: str
    button_url: str
    background_image: Optional[str] = None
    is_visible: bool = True

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class ContactSettings(BaseModel):
    general_email: str = "hello@corpxcloud.com"
    sales_email: str = "sales@corpxcloud.com"
    phone: str = "+91 98300 12345"
    city: str = "Kolkata"
    region: str = "West Bengal"
    country: str = "India"
    facebook_url: Optional[str] = "https://www.facebook.com/people/corpxcloud/61593336181697/"
    instagram_url: Optional[str] = "https://www.instagram.com/corpxcloud/"
    linkedin_url: Optional[str] = (
        "https://www.linkedin.com/company/corpxcloud-technologies-private-limited"
    )
    x_url: Optional[str] = None


class FooterLinkItem(BaseModel):
    label: str
    href: str


class FooterColumnItem(BaseModel):
    heading: str
    links: List[FooterLinkItem] = []


class FooterSettings(BaseModel):
    description: str = "A multi-tenant enterprise cloud platform. HRMS, Hospital Management and Vendor & Inventory are live today; ERP, IGA, CRM, Restaurant and Institute management ship through 2026."
    footer_logo: Optional[str] = None
    legal_name: str = "CORPXCLOUD Technologies Private Limited"
    copyright_text: str = "© 2026 CORPXCLOUD Technologies Private Limited. All rights reserved."
    columns: List[FooterColumnItem] = []
    legal_links: List[FooterLinkItem] = []


class GeneralSettings(BaseModel):
    site_name: str = "CORPXCLOUD"
    site_tagline: str = "One unified cloud platform for your entire enterprise"
    site_description: str = "A multi-tenant enterprise cloud platform."
    site_url: str = "https://corpxcloud.com"
    logo_light: Optional[str] = None
    logo_dark: Optional[str] = None
    favicon: Optional[str] = None
    maintenance_mode: bool = False


class SettingResponse(BaseModel):
    setting_key: str
    data: Dict[str, Any]
    updated_at: datetime

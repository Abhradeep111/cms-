from typing import List

from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_admin_user
from app.modules.auth.models import User
from app.modules.homepage.schemas import HomepageSectionResponse, HomepageSectionUpdate
from app.modules.homepage.services import HomepageService

admin_router = APIRouter(prefix="/admin/homepage", tags=["Admin Homepage"])
public_router = APIRouter(prefix="/public/homepage", tags=["Public Homepage"])


@admin_router.get("", response_model=List[HomepageSectionResponse])
async def list_admin_homepage_sections(_current_user: User = Depends(get_current_admin_user)):
    return await HomepageService.get_all_admin_sections()


@admin_router.get("/{section_key}", response_model=HomepageSectionResponse)
async def get_admin_homepage_section(
    section_key: str,
    _current_user: User = Depends(get_current_admin_user),
):
    section = await HomepageService.get_or_create_section(section_key)
    return HomepageService.to_response(section)


@admin_router.put("/{section_key}", response_model=HomepageSectionResponse)
async def update_admin_homepage_section(
    section_key: str,
    update_data: HomepageSectionUpdate,
    current_user: User = Depends(get_current_admin_user),
):
    updated = await HomepageService.update_section(section_key, update_data, current_user.email)
    return HomepageService.to_response(updated)


@public_router.get("")
async def get_public_homepage():
    sections = await HomepageService.get_public_homepage_sections()
    return {"sections": sections}

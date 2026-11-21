from typing import List

from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_admin_user
from app.modules.auth.models import User
from app.modules.seo.schemas import SEOMetadataResponse, SEOMetadataUpdate
from app.modules.seo.services import SEOService

admin_router = APIRouter(prefix="/admin/seo", tags=["Admin SEO"])
public_router = APIRouter(prefix="/public/seo", tags=["Public SEO"])


@admin_router.get("", response_model=List[SEOMetadataResponse])
async def list_all_seo(_current_user: User = Depends(get_current_admin_user)):
    items = await SEOService.list_all_seo()
    return [SEOService.to_response(i) for i in items]


@admin_router.get("/{page_key}", response_model=SEOMetadataResponse)
async def get_page_seo(
    page_key: str,
    _current_user: User = Depends(get_current_admin_user),
):
    seo = await SEOService.get_or_create_page_seo(page_key)
    return SEOService.to_response(seo)


@admin_router.put("/{page_key}", response_model=SEOMetadataResponse)
async def update_page_seo(
    page_key: str,
    data: SEOMetadataUpdate,
    current_user: User = Depends(get_current_admin_user),
):
    updated = await SEOService.update_page_seo(page_key, data, user_email=current_user.email)
    return SEOService.to_response(updated)


@public_router.get("", response_model=List[SEOMetadataResponse])
async def list_public_seo():
    items = await SEOService.list_all_seo()
    return [SEOService.to_response(i) for i in items]


@public_router.get("/{page_key}", response_model=SEOMetadataResponse)
async def get_public_page_seo(page_key: str):
    seo = await SEOService.get_or_create_page_seo(page_key)
    return SEOService.to_response(seo)

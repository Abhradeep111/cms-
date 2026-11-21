from typing import List, Optional

from fastapi import APIRouter, Depends, Query, status

from app.api.dependencies import get_current_admin_user
from app.modules.auth.models import User
from app.modules.faqs.schemas import FAQCreate, FAQListResponse, FAQResponse, FAQUpdate
from app.modules.faqs.services import FAQService

admin_router = APIRouter(prefix="/admin/faqs", tags=["Admin FAQs"])
public_router = APIRouter(prefix="/public/faqs", tags=["Public FAQs"])


@admin_router.get("", response_model=FAQListResponse)
async def list_admin_faqs(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    _current_user: User = Depends(get_current_admin_user),
):
    items, total, total_pages = await FAQService.list_admin_faqs(
        search=search, category=category, status=status, page=page, page_size=page_size
    )
    return FAQListResponse(
        items=[FAQService.to_response(f) for f in items],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@admin_router.post("", response_model=FAQResponse, status_code=status.HTTP_201_CREATED)
async def create_faq(
    data: FAQCreate,
    current_user: User = Depends(get_current_admin_user),
):
    item = await FAQService.create_faq(data, user_email=current_user.email)
    return FAQService.to_response(item)


@admin_router.get("/{faq_id}", response_model=FAQResponse)
async def get_admin_faq(
    faq_id: str,
    _current_user: User = Depends(get_current_admin_user),
):
    item = await FAQService.get_by_id(faq_id)
    return FAQService.to_response(item)


@admin_router.put("/{faq_id}", response_model=FAQResponse)
async def update_faq(
    faq_id: str,
    data: FAQUpdate,
    current_user: User = Depends(get_current_admin_user),
):
    updated = await FAQService.update_faq(faq_id, data, user_email=current_user.email)
    return FAQService.to_response(updated)


@admin_router.delete("/{faq_id}", status_code=status.HTTP_200_OK)
async def delete_faq(
    faq_id: str,
    current_user: User = Depends(get_current_admin_user),
):
    await FAQService.delete_faq(faq_id, user_email=current_user.email)
    return {"message": "FAQ deleted successfully"}


@public_router.get("", response_model=List[FAQResponse])
async def list_public_faqs(category: Optional[str] = Query(None)):
    items = await FAQService.list_public_faqs(category=category)
    return [FAQService.to_response(f) for f in items]

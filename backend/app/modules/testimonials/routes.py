from typing import List, Optional

from fastapi import APIRouter, Depends, Query, status

from app.api.dependencies import get_current_admin_user
from app.modules.auth.models import User
from app.modules.testimonials.schemas import (
    TestimonialCreate,
    TestimonialListResponse,
    TestimonialResponse,
    TestimonialUpdate,
)
from app.modules.testimonials.services import TestimonialService

admin_router = APIRouter(prefix="/admin/testimonials", tags=["Admin Testimonials"])
public_router = APIRouter(prefix="/public/testimonials", tags=["Public Testimonials"])


@admin_router.get("", response_model=TestimonialListResponse)
async def list_admin_testimonials(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    _current_user: User = Depends(get_current_admin_user),
):
    items, total, total_pages = await TestimonialService.list_admin_testimonials(
        search=search, status=status, page=page, page_size=page_size
    )
    return TestimonialListResponse(
        items=[TestimonialService.to_response(t) for t in items],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@admin_router.post("", response_model=TestimonialResponse, status_code=status.HTTP_201_CREATED)
async def create_testimonial(
    data: TestimonialCreate,
    current_user: User = Depends(get_current_admin_user),
):
    item = await TestimonialService.create_testimonial(data, user_email=current_user.email)
    return TestimonialService.to_response(item)


@admin_router.get("/{testimonial_id}", response_model=TestimonialResponse)
async def get_admin_testimonial(
    testimonial_id: str,
    _current_user: User = Depends(get_current_admin_user),
):
    item = await TestimonialService.get_by_id(testimonial_id)
    return TestimonialService.to_response(item)


@admin_router.put("/{testimonial_id}", response_model=TestimonialResponse)
async def update_testimonial(
    testimonial_id: str,
    data: TestimonialUpdate,
    current_user: User = Depends(get_current_admin_user),
):
    updated = await TestimonialService.update_testimonial(
        testimonial_id, data, user_email=current_user.email
    )
    return TestimonialService.to_response(updated)


@admin_router.delete("/{testimonial_id}", status_code=status.HTTP_200_OK)
async def delete_testimonial(
    testimonial_id: str,
    current_user: User = Depends(get_current_admin_user),
):
    await TestimonialService.delete_testimonial(testimonial_id, user_email=current_user.email)
    return {"message": "Testimonial deleted successfully"}


@public_router.get("", response_model=List[TestimonialResponse])
async def list_public_testimonials():
    items = await TestimonialService.list_public_testimonials()
    return [TestimonialService.to_response(t) for t in items]

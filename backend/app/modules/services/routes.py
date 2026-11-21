from typing import List, Optional

from fastapi import APIRouter, Depends, Query, status

from app.api.dependencies import get_current_admin_user
from app.modules.auth.models import User
from app.modules.services.schemas import (
    ServiceCreate,
    ServiceListResponse,
    ServiceResponse,
    ServiceUpdate,
)
from app.modules.services.services import ServicesService

admin_router = APIRouter(prefix="/admin/services", tags=["Admin Services"])
public_router = APIRouter(prefix="/public/services", tags=["Public Services"])


@admin_router.get("", response_model=ServiceListResponse)
async def list_admin_services(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    _current_user: User = Depends(get_current_admin_user),
):
    items, total, total_pages = await ServicesService.list_admin_services(
        search=search, status=status, page=page, page_size=page_size
    )
    return ServiceListResponse(
        items=[ServicesService.to_response(s) for s in items],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@admin_router.post("", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
async def create_service(
    data: ServiceCreate,
    current_user: User = Depends(get_current_admin_user),
):
    service = await ServicesService.create_service(data, user_email=current_user.email)
    return ServicesService.to_response(service)


@admin_router.get("/{service_id}", response_model=ServiceResponse)
async def get_admin_service(
    service_id: str,
    _current_user: User = Depends(get_current_admin_user),
):
    service = await ServicesService.get_by_id(service_id)
    return ServicesService.to_response(service)


@admin_router.put("/{service_id}", response_model=ServiceResponse)
async def update_service(
    service_id: str,
    data: ServiceUpdate,
    current_user: User = Depends(get_current_admin_user),
):
    updated = await ServicesService.update_service(service_id, data, user_email=current_user.email)
    return ServicesService.to_response(updated)


@admin_router.delete("/{service_id}", status_code=status.HTTP_200_OK)
async def delete_service(
    service_id: str,
    current_user: User = Depends(get_current_admin_user),
):
    await ServicesService.delete_service(service_id, user_email=current_user.email)
    return {"message": "Service deleted successfully"}


@public_router.get("", response_model=List[ServiceResponse])
async def list_public_services():
    services = await ServicesService.list_public_services()
    return [ServicesService.to_response(s) for s in services]


@public_router.get("/{slug}", response_model=ServiceResponse)
async def get_public_service(slug: str):
    service = await ServicesService.get_by_slug(slug)
    return ServicesService.to_response(service)

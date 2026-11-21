from typing import List

from fastapi import APIRouter, Depends, status

from app.api.dependencies import get_current_admin_user
from app.modules.auth.models import User
from app.modules.navigation.schemas import (
    NavigationItemCreate,
    NavigationItemResponse,
    NavigationItemUpdate,
)
from app.modules.navigation.services import NavigationService

admin_router = APIRouter(prefix="/admin/navigation", tags=["Admin Navigation"])
public_router = APIRouter(prefix="/public/navigation", tags=["Public Navigation"])


@admin_router.get("", response_model=List[NavigationItemResponse])
async def list_admin_navigation(_current_user: User = Depends(get_current_admin_user)):
    return await NavigationService.list_admin_items()


@admin_router.post("", response_model=NavigationItemResponse, status_code=status.HTTP_201_CREATED)
async def create_navigation_item(
    data: NavigationItemCreate,
    current_user: User = Depends(get_current_admin_user),
):
    item = await NavigationService.create_item(data, user_email=current_user.email)
    return NavigationService.to_response(item)


@admin_router.get("/{item_id}", response_model=NavigationItemResponse)
async def get_navigation_item(
    item_id: str,
    _current_user: User = Depends(get_current_admin_user),
):
    item = await NavigationService.get_by_id(item_id)
    return NavigationService.to_response(item)


@admin_router.put("/{item_id}", response_model=NavigationItemResponse)
async def update_navigation_item(
    item_id: str,
    data: NavigationItemUpdate,
    current_user: User = Depends(get_current_admin_user),
):
    updated = await NavigationService.update_item(item_id, data, user_email=current_user.email)
    return NavigationService.to_response(updated)


@admin_router.delete("/{item_id}", status_code=status.HTTP_200_OK)
async def delete_navigation_item(
    item_id: str,
    current_user: User = Depends(get_current_admin_user),
):
    await NavigationService.delete_item(item_id, user_email=current_user.email)
    return {"message": "Navigation item deleted successfully"}


@public_router.get("", response_model=List[NavigationItemResponse])
async def list_public_navigation():
    return await NavigationService.list_public_items()

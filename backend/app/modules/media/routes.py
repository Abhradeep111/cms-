from typing import Optional

from fastapi import APIRouter, Depends, File, Form, Query, UploadFile, status

from app.api.dependencies import get_current_admin_user
from app.modules.auth.models import User
from app.modules.media.schemas import MediaAssetResponse, MediaListResponse
from app.modules.media.services import MediaService

router = APIRouter(prefix="/admin/media", tags=["Admin Media Library"])


@router.get("", response_model=MediaListResponse)
async def list_media(
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(24, ge=1, le=100),
    _current_user: User = Depends(get_current_admin_user),
):
    items, total, total_pages = await MediaService.list_media(
        search=search, page=page, page_size=page_size
    )
    return MediaListResponse(
        items=[MediaService.to_response(a) for a in items],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.post("", response_model=MediaAssetResponse, status_code=status.HTTP_201_CREATED)
async def upload_media(
    file: UploadFile = File(...),
    alt_text: Optional[str] = Form(""),
    current_user: User = Depends(get_current_admin_user),
):
    asset = await MediaService.upload_file(file, alt_text=alt_text, user_email=current_user.email)
    return MediaService.to_response(asset)


@router.get("/{media_id}", response_model=MediaAssetResponse)
async def get_media(
    media_id: str,
    _current_user: User = Depends(get_current_admin_user),
):
    asset = await MediaService.get_by_id(media_id)
    return MediaService.to_response(asset)


@router.delete("/{media_id}", status_code=status.HTTP_200_OK)
async def delete_media(
    media_id: str,
    current_user: User = Depends(get_current_admin_user),
):
    await MediaService.delete_media(media_id, user_email=current_user.email)
    return {"message": "Media asset deleted successfully"}

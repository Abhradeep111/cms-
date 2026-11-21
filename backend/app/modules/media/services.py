import math
import os
import re
import secrets
from abc import ABC, abstractmethod
from pathlib import Path
from typing import List, Optional, Tuple

from fastapi import UploadFile

from app.core.config import settings
from app.core.exceptions import BadRequestException, NotFoundException
from app.modules.media.models import MediaAsset
from app.modules.media.schemas import MediaAssetResponse
from app.modules.revisions.services import RevisionService

ALLOWED_IMAGE_TYPES = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/webp": [".webp"],
    "image/svg+xml": [".svg"],
}

# Magic signatures
MAGIC_BYTES = {
    b"\xff\xd8\xff": "image/jpeg",
    b"\x89PNG\r\n\x1a\n": "image/png",
    b"RIFF": "image/webp",  # RIFF....WEBP
}


class StorageBackend(ABC):
    @abstractmethod
    async def save(self, content: bytes, filename: str) -> Tuple[str, str]:
        """Save bytes and return (file_path, public_url)."""
        pass

    @abstractmethod
    async def delete(self, file_path: str) -> bool:
        """Delete file at file_path."""
        pass


class LocalFileStorage(StorageBackend):
    def __init__(self, upload_dir: str):
        self.upload_dir = Path(upload_dir)
        self.upload_dir.mkdir(parents=True, exist_ok=True)

    async def save(self, content: bytes, filename: str) -> Tuple[str, str]:
        file_path = self.upload_dir / filename
        with open(file_path, "wb") as f:
            f.write(content)
        url = f"/uploads/{filename}"
        return str(file_path), url

    async def delete(self, file_path: str) -> bool:
        path = Path(file_path)
        if path.exists() and path.is_file():
            try:
                os.remove(path)
                return True
            except OSError:
                return False
        return False


storage: StorageBackend = LocalFileStorage(settings.MEDIA_ROOT)


def sanitize_filename(filename: str) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9_.-]", "_", filename).strip("._")
    return cleaned if cleaned else f"file_{secrets.token_hex(4)}"


def detect_mime_type(header: bytes, ext: str) -> str:
    for magic, mime in MAGIC_BYTES.items():
        if header.startswith(magic):
            return mime
    if ext == ".svg":
        # Check text content for <svg
        text_preview = header.decode("utf-8", errors="ignore").lower()
        if "<svg" in text_preview:
            # basic check to forbid dangerous script tags in SVG
            if "<script" in text_preview or "javascript:" in text_preview:
                raise BadRequestException("SVG contains potentially hazardous scripts")
            return "image/svg+xml"
    raise BadRequestException("Unsupported file type or invalid image signature")


class MediaService:
    @staticmethod
    async def upload_file(
        upload_file: UploadFile,
        alt_text: Optional[str] = "",
        user_email: Optional[str] = None,
    ) -> MediaAsset:
        raw_content = await upload_file.read()
        file_size = len(raw_content)
        if file_size > 15 * 1024 * 1024:  # 15 MB limit
            raise BadRequestException("File size exceeds 15 MB limit")

        original_name = upload_file.filename or "upload.png"
        ext = Path(original_name).suffix.lower()

        # Validate magic bytes
        header = raw_content[:64]
        detected_mime = detect_mime_type(header, ext)

        unique_name = f"{secrets.token_hex(8)}_{sanitize_filename(original_name)}"
        file_path, url = await storage.save(raw_content, unique_name)

        asset = MediaAsset(
            filename=unique_name,
            original_name=original_name,
            file_path=file_path,
            file_size=file_size,
            mime_type=detected_mime,
            alt_text=alt_text or original_name,
            url=url,
        )
        await asset.insert()

        await RevisionService.log_revision(
            entity_type="media_asset",
            entity_id=str(asset.id),
            action="upload",
            data_snapshot=asset.model_dump(),
            changed_by=user_email,
        )
        return asset

    @staticmethod
    async def get_by_id(media_id: str) -> MediaAsset:
        asset = await MediaAsset.get(media_id)
        if not asset:
            raise NotFoundException("Media asset", media_id)
        return asset

    @staticmethod
    async def delete_media(media_id: str, user_email: Optional[str] = None) -> bool:
        asset = await MediaService.get_by_id(media_id)
        await storage.delete(asset.file_path)
        await RevisionService.log_revision(
            entity_type="media_asset",
            entity_id=str(asset.id),
            action="delete",
            data_snapshot=asset.model_dump(),
            changed_by=user_email,
        )
        await asset.delete()
        return True

    @staticmethod
    async def list_media(
        search: Optional[str] = None,
        page: int = 1,
        page_size: int = 24,
    ) -> Tuple[List[MediaAsset], int, int]:
        query = {}
        if search:
            query["$or"] = [
                {"original_name": {"$regex": search, "$options": "i"}},
                {"alt_text": {"$regex": search, "$options": "i"}},
            ]

        total = await MediaAsset.find(query).count()
        total_pages = math.ceil(total / page_size) if total > 0 else 1
        skip = (page - 1) * page_size
        items = (
            await MediaAsset.find(query).sort("-created_at").skip(skip).limit(page_size).to_list()
        )
        return items, total, total_pages

    @staticmethod
    def to_response(asset: MediaAsset) -> MediaAssetResponse:
        return MediaAssetResponse(
            id=str(asset.id),
            filename=asset.filename,
            original_name=asset.original_name,
            file_size=asset.file_size,
            mime_type=asset.mime_type,
            alt_text=asset.alt_text,
            url=asset.url,
            created_at=asset.created_at,
            updated_at=asset.updated_at,
        )

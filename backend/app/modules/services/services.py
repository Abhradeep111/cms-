import math
from datetime import datetime, timezone
from typing import List, Optional, Tuple

from app.core.exceptions import NotFoundException
from app.modules.revisions.services import RevisionService
from app.modules.services.models import Service
from app.modules.services.schemas import ServiceCreate, ServiceResponse, ServiceUpdate
from app.utils.slug import slugify


class ServicesService:
    @staticmethod
    async def get_by_id(service_id: str) -> Service:
        service = await Service.get(service_id)
        if not service:
            raise NotFoundException("Service", service_id)
        return service

    @staticmethod
    async def get_by_slug(slug: str) -> Service:
        service = await Service.find_one(Service.slug == slug)
        if not service:
            raise NotFoundException("Service", slug)
        return service

    @staticmethod
    async def ensure_unique_slug(base_slug: str, exclude_id: Optional[str] = None) -> str:
        slug = base_slug
        counter = 1
        while True:
            existing = await Service.find_one(Service.slug == slug)
            if not existing or (exclude_id and str(existing.id) == str(exclude_id)):
                return slug
            slug = f"{base_slug}-{counter}"
            counter += 1

    @staticmethod
    async def create_service(data: ServiceCreate, user_email: Optional[str] = None) -> Service:
        base_slug = data.slug or slugify(data.name)
        unique_slug = await ServicesService.ensure_unique_slug(base_slug)

        service = Service(
            name=data.name,
            slug=unique_slug,
            short_description=data.short_description,
            detailed_description=data.detailed_description or "",
            icon=data.icon,
            thumbnail_url=data.thumbnail_url,
            features=data.features,
            benefits=data.benefits,
            cta_label=data.cta_label or "Learn More",
            cta_url=data.cta_url,
            display_order=data.display_order,
            status=data.status,
        )
        await service.insert()

        await RevisionService.log_revision(
            entity_type="service",
            entity_id=str(service.id),
            action="create",
            data_snapshot=service.model_dump(),
            changed_by=user_email,
        )
        return service

    @staticmethod
    async def update_service(
        service_id: str,
        data: ServiceUpdate,
        user_email: Optional[str] = None,
    ) -> Service:
        service = await ServicesService.get_by_id(service_id)

        update_dict = data.model_dump(exclude_unset=True)
        if "name" in update_dict and not update_dict.get("slug"):
            new_slug = slugify(update_dict["name"])
            update_dict["slug"] = await ServicesService.ensure_unique_slug(
                new_slug, exclude_id=service_id
            )
        elif "slug" in update_dict and update_dict["slug"]:
            update_dict["slug"] = await ServicesService.ensure_unique_slug(
                slugify(update_dict["slug"]), exclude_id=service_id
            )

        for key, val in update_dict.items():
            setattr(service, key, val)

        service.updated_at = datetime.now(timezone.utc)
        await service.save()

        await RevisionService.log_revision(
            entity_type="service",
            entity_id=str(service.id),
            action="update",
            data_snapshot=service.model_dump(),
            changed_by=user_email,
        )
        return service

    @staticmethod
    async def delete_service(service_id: str, user_email: Optional[str] = None) -> bool:
        service = await ServicesService.get_by_id(service_id)
        await RevisionService.log_revision(
            entity_type="service",
            entity_id=str(service.id),
            action="delete",
            data_snapshot=service.model_dump(),
            changed_by=user_email,
        )
        await service.delete()
        return True

    @staticmethod
    async def list_admin_services(
        search: Optional[str] = None,
        status: Optional[str] = None,
        page: int = 1,
        page_size: int = 20,
    ) -> Tuple[List[Service], int, int]:
        query = {}
        if status:
            query["status"] = status
        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"short_description": {"$regex": search, "$options": "i"}},
            ]

        total = await Service.find(query).count()
        total_pages = math.ceil(total / page_size) if total > 0 else 1
        skip = (page - 1) * page_size
        items = (
            await Service.find(query).sort("display_order").skip(skip).limit(page_size).to_list()
        )
        return items, total, total_pages

    @staticmethod
    async def list_public_services() -> List[Service]:
        return await Service.find(Service.status == "published").sort("display_order").to_list()

    @staticmethod
    def to_response(service: Service) -> ServiceResponse:
        return ServiceResponse(
            id=str(service.id),
            name=service.name,
            slug=service.slug,
            short_description=service.short_description,
            detailed_description=service.detailed_description,
            icon=service.icon,
            thumbnail_url=service.thumbnail_url,
            features=service.features,
            benefits=service.benefits,
            cta_label=service.cta_label,
            cta_url=service.cta_url,
            display_order=service.display_order,
            status=service.status,
            created_at=service.created_at,
            updated_at=service.updated_at,
        )

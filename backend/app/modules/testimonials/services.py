import math
from datetime import datetime, timezone
from typing import List, Optional, Tuple

from app.core.exceptions import NotFoundException
from app.modules.revisions.services import RevisionService
from app.modules.testimonials.models import Testimonial
from app.modules.testimonials.schemas import (
    TestimonialCreate,
    TestimonialResponse,
    TestimonialUpdate,
)


class TestimonialService:
    @staticmethod
    async def get_by_id(testimonial_id: str) -> Testimonial:
        item = await Testimonial.get(testimonial_id)
        if not item:
            raise NotFoundException("Testimonial", testimonial_id)
        return item

    @staticmethod
    async def create_testimonial(
        data: TestimonialCreate, user_email: Optional[str] = None
    ) -> Testimonial:
        testimonial = Testimonial(
            customer_name=data.customer_name,
            designation=data.designation,
            company=data.company,
            content=data.content,
            profile_image_url=data.profile_image_url,
            rating=data.rating,
            display_order=data.display_order,
            status=data.status,
        )
        await testimonial.insert()

        await RevisionService.log_revision(
            entity_type="testimonial",
            entity_id=str(testimonial.id),
            action="create",
            data_snapshot=testimonial.model_dump(),
            changed_by=user_email,
        )
        return testimonial

    @staticmethod
    async def update_testimonial(
        testimonial_id: str,
        data: TestimonialUpdate,
        user_email: Optional[str] = None,
    ) -> Testimonial:
        testimonial = await TestimonialService.get_by_id(testimonial_id)
        update_dict = data.model_dump(exclude_unset=True)
        for key, val in update_dict.items():
            setattr(testimonial, key, val)

        testimonial.updated_at = datetime.now(timezone.utc)
        await testimonial.save()

        await RevisionService.log_revision(
            entity_type="testimonial",
            entity_id=str(testimonial.id),
            action="update",
            data_snapshot=testimonial.model_dump(),
            changed_by=user_email,
        )
        return testimonial

    @staticmethod
    async def delete_testimonial(testimonial_id: str, user_email: Optional[str] = None) -> bool:
        testimonial = await TestimonialService.get_by_id(testimonial_id)
        await RevisionService.log_revision(
            entity_type="testimonial",
            entity_id=str(testimonial.id),
            action="delete",
            data_snapshot=testimonial.model_dump(),
            changed_by=user_email,
        )
        await testimonial.delete()
        return True

    @staticmethod
    async def list_admin_testimonials(
        search: Optional[str] = None,
        status: Optional[str] = None,
        page: int = 1,
        page_size: int = 20,
    ) -> Tuple[List[Testimonial], int, int]:
        query = {}
        if status:
            query["status"] = status
        if search:
            query["$or"] = [
                {"customer_name": {"$regex": search, "$options": "i"}},
                {"company": {"$regex": search, "$options": "i"}},
                {"content": {"$regex": search, "$options": "i"}},
            ]

        total = await Testimonial.find(query).count()
        total_pages = math.ceil(total / page_size) if total > 0 else 1
        skip = (page - 1) * page_size
        items = (
            await Testimonial.find(query)
            .sort("display_order")
            .skip(skip)
            .limit(page_size)
            .to_list()
        )
        return items, total, total_pages

    @staticmethod
    async def list_public_testimonials() -> List[Testimonial]:
        return (
            await Testimonial.find(Testimonial.status == "published")
            .sort("display_order")
            .to_list()
        )

    @staticmethod
    def to_response(t: Testimonial) -> TestimonialResponse:
        return TestimonialResponse(
            id=str(t.id),
            customer_name=t.customer_name,
            designation=t.designation,
            company=t.company,
            content=t.content,
            profile_image_url=t.profile_image_url,
            rating=t.rating,
            display_order=t.display_order,
            status=t.status,
            created_at=t.created_at,
            updated_at=t.updated_at,
        )

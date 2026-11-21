import math
from datetime import datetime, timezone
from typing import List, Optional, Tuple

from app.core.exceptions import NotFoundException
from app.modules.faqs.models import FAQ
from app.modules.faqs.schemas import FAQCreate, FAQResponse, FAQUpdate
from app.modules.revisions.services import RevisionService


class FAQService:
    @staticmethod
    async def get_by_id(faq_id: str) -> FAQ:
        faq = await FAQ.get(faq_id)
        if not faq:
            raise NotFoundException("FAQ", faq_id)
        return faq

    @staticmethod
    async def create_faq(data: FAQCreate, user_email: Optional[str] = None) -> FAQ:
        faq = FAQ(
            question=data.question,
            answer=data.answer,
            category=data.category,
            display_order=data.display_order,
            status=data.status,
        )
        await faq.insert()

        await RevisionService.log_revision(
            entity_type="faq",
            entity_id=str(faq.id),
            action="create",
            data_snapshot=faq.model_dump(),
            changed_by=user_email,
        )
        return faq

    @staticmethod
    async def update_faq(
        faq_id: str,
        data: FAQUpdate,
        user_email: Optional[str] = None,
    ) -> FAQ:
        faq = await FAQService.get_by_id(faq_id)
        update_dict = data.model_dump(exclude_unset=True)
        for key, val in update_dict.items():
            setattr(faq, key, val)

        faq.updated_at = datetime.now(timezone.utc)
        await faq.save()

        await RevisionService.log_revision(
            entity_type="faq",
            entity_id=str(faq.id),
            action="update",
            data_snapshot=faq.model_dump(),
            changed_by=user_email,
        )
        return faq

    @staticmethod
    async def delete_faq(faq_id: str, user_email: Optional[str] = None) -> bool:
        faq = await FAQService.get_by_id(faq_id)
        await RevisionService.log_revision(
            entity_type="faq",
            entity_id=str(faq.id),
            action="delete",
            data_snapshot=faq.model_dump(),
            changed_by=user_email,
        )
        await faq.delete()
        return True

    @staticmethod
    async def list_admin_faqs(
        search: Optional[str] = None,
        category: Optional[str] = None,
        status: Optional[str] = None,
        page: int = 1,
        page_size: int = 20,
    ) -> Tuple[List[FAQ], int, int]:
        query = {}
        if status:
            query["status"] = status
        if category:
            query["category"] = category
        if search:
            query["$or"] = [
                {"question": {"$regex": search, "$options": "i"}},
                {"answer": {"$regex": search, "$options": "i"}},
            ]

        total = await FAQ.find(query).count()
        total_pages = math.ceil(total / page_size) if total > 0 else 1
        skip = (page - 1) * page_size
        items = await FAQ.find(query).sort("display_order").skip(skip).limit(page_size).to_list()
        return items, total, total_pages

    @staticmethod
    async def list_public_faqs(category: Optional[str] = None) -> List[FAQ]:
        query = {"status": "published"}
        if category:
            query["category"] = category
        return await FAQ.find(query).sort("display_order").to_list()

    @staticmethod
    def to_response(faq: FAQ) -> FAQResponse:
        return FAQResponse(
            id=str(faq.id),
            question=faq.question,
            answer=faq.answer,
            category=faq.category,
            display_order=faq.display_order,
            status=faq.status,
            created_at=faq.created_at,
            updated_at=faq.updated_at,
        )

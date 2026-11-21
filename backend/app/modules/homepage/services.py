from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from app.modules.homepage.models import HomepageSection
from app.modules.homepage.schemas import HomepageSectionResponse, HomepageSectionUpdate
from app.modules.revisions.services import RevisionService


class HomepageService:
    @staticmethod
    async def get_section(section_key: str) -> Optional[HomepageSection]:
        return await HomepageSection.find_one(HomepageSection.section_key == section_key)

    @staticmethod
    async def get_or_create_section(
        section_key: str, default_data: Optional[Dict[str, Any]] = None
    ) -> HomepageSection:
        section = await HomepageSection.find_one(HomepageSection.section_key == section_key)
        if not section:
            data = default_data or {}
            section = HomepageSection(
                section_key=section_key,
                heading=data.get("heading", ""),
                subheading=data.get("subheading", ""),
                description=data.get("description", ""),
                image_url=data.get("image_url"),
                primary_cta_label=data.get("primary_cta_label"),
                primary_cta_url=data.get("primary_cta_url"),
                secondary_cta_label=data.get("secondary_cta_label"),
                secondary_cta_url=data.get("secondary_cta_url"),
                content_json=data.get("content_json", {}),
                display_order=data.get("display_order", 0),
                is_visible=data.get("is_visible", True),
            )
            await section.insert()
        return section

    @staticmethod
    async def update_section(
        section_key: str,
        update_data: HomepageSectionUpdate,
        user_email: Optional[str] = None,
    ) -> HomepageSection:
        section = await HomepageService.get_or_create_section(section_key)
        section.heading = update_data.heading
        section.subheading = update_data.subheading
        section.description = update_data.description
        section.image_url = update_data.image_url
        section.primary_cta_label = update_data.primary_cta_label
        section.primary_cta_url = update_data.primary_cta_url
        section.secondary_cta_label = update_data.secondary_cta_label
        section.secondary_cta_url = update_data.secondary_cta_url
        section.content_json = update_data.content_json
        section.display_order = update_data.display_order
        section.is_visible = update_data.is_visible
        section.updated_at = datetime.now(timezone.utc)
        await section.save()

        # Log revision
        await RevisionService.log_revision(
            entity_type="homepage_section",
            entity_id=str(section.id),
            action="update",
            data_snapshot=section.model_dump(),
            changed_by=user_email,
        )
        return section

    @staticmethod
    async def get_all_admin_sections() -> List[HomepageSectionResponse]:
        sections = await HomepageSection.find().sort("display_order").to_list()
        return [HomepageService.to_response(s) for s in sections]

    @staticmethod
    async def get_public_homepage_sections() -> Dict[str, Any]:
        """Fetch visible sections for public landing page."""
        sections = (
            await HomepageSection.find(HomepageSection.is_visible == True)
            .sort("display_order")
            .to_list()
        )
        res: Dict[str, Any] = {}
        for s in sections:
            res[s.section_key] = {
                "id": str(s.id),
                "section": s.section_key,
                "content": s.heading,
                "heading": s.heading,
                "subheading": s.subheading,
                "description": s.description,
                "image": s.image_url or "",
                "image_url": s.image_url or "",
                "primary_cta_label": s.primary_cta_label,
                "primary_cta_url": s.primary_cta_url,
                "secondary_cta_label": s.secondary_cta_label,
                "secondary_cta_url": s.secondary_cta_url,
                "extra": s.content_json.get("extra", ""),
                "content_json": s.content_json,
                "display_order": s.display_order,
                "is_visible": s.is_visible,
            }
        return res

    @staticmethod
    def to_response(section: HomepageSection) -> HomepageSectionResponse:
        return HomepageSectionResponse(
            id=str(section.id),
            section_key=section.section_key,
            heading=section.heading,
            subheading=section.subheading,
            description=section.description,
            image_url=section.image_url,
            primary_cta_label=section.primary_cta_label,
            primary_cta_url=section.primary_cta_url,
            secondary_cta_label=section.secondary_cta_label,
            secondary_cta_url=section.secondary_cta_url,
            content_json=section.content_json,
            display_order=section.display_order,
            is_visible=section.is_visible,
            created_at=section.created_at,
            updated_at=section.updated_at,
        )

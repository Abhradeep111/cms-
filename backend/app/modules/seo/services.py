from datetime import datetime, timezone
from typing import List, Optional

from app.modules.revisions.services import RevisionService
from app.modules.seo.models import SEOMetadata
from app.modules.seo.schemas import SEOMetadataResponse, SEOMetadataUpdate


class SEOService:
    @staticmethod
    async def get_or_create_page_seo(page_key: str) -> SEOMetadata:
        seo = await SEOMetadata.find_one(SEOMetadata.page_key == page_key)
        if not seo:
            defaults = {
                "homepage": {
                    "title": "CORPXCLOUD — One unified cloud platform for your entire enterprise",
                    "meta_description": "A multi-tenant enterprise cloud platform. HRMS, Hospital Management and Vendor & Inventory are live today.",
                    "keywords": [
                        "enterprise cloud platform",
                        "multi-tenant SaaS",
                        "HRMS",
                        "hospital management",
                    ],
                },
                "products": {
                    "title": "Module Catalogue · CORPXCLOUD",
                    "meta_description": "Explore modular, cloud-native enterprise tools sharing one tenant and one identity model.",
                    "keywords": ["enterprise modules", "SaaS software", "ERP", "SCM"],
                },
                "services": {
                    "title": "Solutions & Services · CORPXCLOUD",
                    "meta_description": "Enterprise cloud deployment patterns and integration services tailored for your industry.",
                    "keywords": ["cloud services", "enterprise architecture"],
                },
            }
            page_default = defaults.get(
                page_key,
                {
                    "title": f"{page_key.replace('-', ' ').title()} · CORPXCLOUD",
                    "meta_description": f"CORPXCLOUD enterprise solutions for {page_key}.",
                    "keywords": ["enterprise", "cloud"],
                },
            )
            seo = SEOMetadata(
                page_key=page_key,
                title=page_default["title"],
                meta_description=page_default["meta_description"],
                keywords=page_default.get("keywords", []),
                robots_index=True,
                robots_follow=True,
            )
            await seo.insert()
        return seo

    @staticmethod
    async def update_page_seo(
        page_key: str,
        data: SEOMetadataUpdate,
        user_email: Optional[str] = None,
    ) -> SEOMetadata:
        seo = await SEOService.get_or_create_page_seo(page_key)
        update_dict = data.model_dump(exclude_unset=True)
        for key, val in update_dict.items():
            setattr(seo, key, val)

        seo.updated_at = datetime.now(timezone.utc)
        await seo.save()

        await RevisionService.log_revision(
            entity_type="seo_metadata",
            entity_id=page_key,
            action="update",
            data_snapshot=seo.model_dump(),
            changed_by=user_email,
        )
        return seo

    @staticmethod
    async def list_all_seo() -> List[SEOMetadata]:
        # Pre-seed defaults if empty
        known_pages = [
            "homepage",
            "products",
            "services",
            "about-us",
            "enterprise-solutions",
            "contact-us",
            "careers",
        ]
        for p in known_pages:
            await SEOService.get_or_create_page_seo(p)
        return await SEOMetadata.find().to_list()

    @staticmethod
    def to_response(seo: SEOMetadata) -> SEOMetadataResponse:
        return SEOMetadataResponse(
            id=str(seo.id),
            page_key=seo.page_key,
            title=seo.title,
            meta_description=seo.meta_description,
            keywords=seo.keywords,
            og_title=seo.og_title,
            og_description=seo.og_description,
            og_image=seo.og_image,
            canonical_url=seo.canonical_url,
            robots_index=seo.robots_index,
            robots_follow=seo.robots_follow,
            json_ld=seo.json_ld,
            created_at=seo.created_at,
            updated_at=seo.updated_at,
        )

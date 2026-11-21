from app.modules.dashboard.schemas import DashboardStatsResponse, RecentActivityItem
from app.modules.faqs.models import FAQ
from app.modules.media.models import MediaAsset
from app.modules.products.models import Product
from app.modules.revisions.models import ContentRevision
from app.modules.services.models import Service
from app.modules.testimonials.models import Testimonial


class DashboardService:
    @staticmethod
    async def get_stats() -> DashboardStatsResponse:
        total_products = await Product.count()
        published_products = await Product.find(Product.status == "published").count()
        draft_products = await Product.find(Product.status == "draft").count()

        total_services = await Service.count()
        total_testimonials = await Testimonial.count()
        total_faqs = await FAQ.count()
        media_assets_count = await MediaAsset.count()

        revisions = await ContentRevision.find().sort("-created_at").limit(10).to_list()
        recent_updates = [
            RecentActivityItem(
                id=str(r.id),
                entity_type=r.entity_type,
                entity_id=r.entity_id,
                action=r.action,
                changed_by=r.changed_by,
                created_at=r.created_at,
            )
            for r in revisions
        ]

        return DashboardStatsResponse(
            total_products=total_products,
            published_products=published_products,
            draft_products=draft_products,
            total_services=total_services,
            total_testimonials=total_testimonials,
            total_faqs=total_faqs,
            media_assets_count=media_assets_count,
            recent_updates=recent_updates,
        )

import math
from datetime import datetime, timezone
from typing import List, Optional, Tuple

from app.core.exceptions import NotFoundException
from app.modules.products.models import Product
from app.modules.products.schemas import ProductCreate, ProductResponse, ProductUpdate
from app.modules.revisions.services import RevisionService
from app.utils.slug import slugify


class ProductService:
    @staticmethod
    async def get_by_id(product_id: str) -> Product:
        product = await Product.get(product_id)
        if not product:
            raise NotFoundException("Product", product_id)
        return product

    @staticmethod
    async def get_by_slug(slug: str) -> Product:
        product = await Product.find_one(Product.slug == slug)
        if not product:
            raise NotFoundException("Product", slug)
        return product

    @staticmethod
    async def ensure_unique_slug(base_slug: str, exclude_id: Optional[str] = None) -> str:
        slug = base_slug
        counter = 1
        while True:
            existing = await Product.find_one(Product.slug == slug)
            if not existing or (exclude_id and str(existing.id) == str(exclude_id)):
                return slug
            slug = f"{base_slug}-{counter}"
            counter += 1

    @staticmethod
    async def create_product(data: ProductCreate, user_email: Optional[str] = None) -> Product:
        base_slug = data.slug or slugify(data.name)
        unique_slug = await ProductService.ensure_unique_slug(base_slug)

        product = Product(
            name=data.name,
            slug=unique_slug,
            short_description=data.short_description,
            detailed_description=data.detailed_description or "",
            product_logo=data.product_logo,
            product_thumbnail=data.product_thumbnail,
            product_url=data.product_url,
            features=data.features,
            benefits=data.benefits,
            cta_label=data.cta_label or "Request Demo",
            display_order=data.display_order,
            is_featured=data.is_featured,
            status=data.status,
            seo_title=data.seo_title,
            seo_description=data.seo_description,
            code=data.code or unique_slug,
            abbr=data.abbr or data.name[:4].upper(),
            release_date=data.release_date or "Live",
        )
        await product.insert()

        await RevisionService.log_revision(
            entity_type="product",
            entity_id=str(product.id),
            action="create",
            data_snapshot=product.model_dump(),
            changed_by=user_email,
        )
        return product

    @staticmethod
    async def update_product(
        product_id: str,
        data: ProductUpdate,
        user_email: Optional[str] = None,
    ) -> Product:
        product = await ProductService.get_by_id(product_id)

        update_dict = data.model_dump(exclude_unset=True)
        if "name" in update_dict and not update_dict.get("slug"):
            # Update slug if not explicitly set
            new_slug = slugify(update_dict["name"])
            update_dict["slug"] = await ProductService.ensure_unique_slug(
                new_slug, exclude_id=product_id
            )
        elif "slug" in update_dict and update_dict["slug"]:
            update_dict["slug"] = await ProductService.ensure_unique_slug(
                slugify(update_dict["slug"]), exclude_id=product_id
            )

        for key, val in update_dict.items():
            setattr(product, key, val)

        product.updated_at = datetime.now(timezone.utc)
        await product.save()

        await RevisionService.log_revision(
            entity_type="product",
            entity_id=str(product.id),
            action="update",
            data_snapshot=product.model_dump(),
            changed_by=user_email,
        )
        return product

    @staticmethod
    async def update_status(
        product_id: str,
        status: str,
        user_email: Optional[str] = None,
    ) -> Product:
        product = await ProductService.get_by_id(product_id)
        product.status = status
        product.updated_at = datetime.now(timezone.utc)
        await product.save()

        await RevisionService.log_revision(
            entity_type="product",
            entity_id=str(product.id),
            action=f"status_change_{status}",
            data_snapshot={"status": status},
            changed_by=user_email,
        )
        return product

    @staticmethod
    async def delete_product(product_id: str, user_email: Optional[str] = None) -> bool:
        product = await ProductService.get_by_id(product_id)
        await RevisionService.log_revision(
            entity_type="product",
            entity_id=str(product.id),
            action="delete",
            data_snapshot=product.model_dump(),
            changed_by=user_email,
        )
        await product.delete()
        return True

    @staticmethod
    async def list_admin_products(
        search: Optional[str] = None,
        status: Optional[str] = None,
        is_featured: Optional[bool] = None,
        page: int = 1,
        page_size: int = 20,
    ) -> Tuple[List[Product], int, int]:
        query = {}
        if status:
            query["status"] = status
        if is_featured is not None:
            query["is_featured"] = is_featured
        if search:
            # Case insensitive regex match for name or short_description
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"short_description": {"$regex": search, "$options": "i"}},
                {"slug": {"$regex": search, "$options": "i"}},
            ]

        total = await Product.find(query).count()
        total_pages = math.ceil(total / page_size) if total > 0 else 1
        skip = (page - 1) * page_size
        items = (
            await Product.find(query).sort("display_order").skip(skip).limit(page_size).to_list()
        )
        return items, total, total_pages

    @staticmethod
    async def list_public_products() -> List[Product]:
        """Fetch all published products for public landing page."""
        return await Product.find(Product.status == "published").sort("display_order").to_list()

    @staticmethod
    async def reorder_products(items: List[dict], user_email: Optional[str] = None) -> bool:
        for item in items:
            product = await Product.get(item["id"])
            if product:
                product.display_order = item["display_order"]
                product.updated_at = datetime.now(timezone.utc)
                await product.save()
        return True

    @staticmethod
    def to_response(product: Product) -> ProductResponse:
        return ProductResponse(
            id=str(product.id),
            name=product.name,
            slug=product.slug,
            short_description=product.short_description,
            detailed_description=product.detailed_description,
            product_logo=product.product_logo,
            product_thumbnail=product.product_thumbnail,
            product_url=product.product_url,
            features=product.features,
            benefits=product.benefits,
            cta_label=product.cta_label,
            display_order=product.display_order,
            is_featured=product.is_featured,
            status=product.status,
            seo_title=product.seo_title,
            seo_description=product.seo_description,
            code=product.code,
            abbr=product.abbr,
            release_date=product.release_date,
            created_at=product.created_at,
            updated_at=product.updated_at,
        )

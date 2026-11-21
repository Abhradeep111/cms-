from typing import List, Optional

from fastapi import APIRouter, Depends, Query, status

from app.api.dependencies import get_current_admin_user
from app.modules.auth.models import User
from app.modules.products.schemas import (
    ProductCreate,
    ProductListResponse,
    ProductReorderItem,
    ProductResponse,
    ProductStatusUpdate,
    ProductUpdate,
)
from app.modules.products.services import ProductService

admin_router = APIRouter(prefix="/admin/products", tags=["Admin Products"])
public_router = APIRouter(prefix="/public/products", tags=["Public Products"])


@admin_router.get("", response_model=ProductListResponse)
async def list_admin_products(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    is_featured: Optional[bool] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    _current_user: User = Depends(get_current_admin_user),
):
    items, total, total_pages = await ProductService.list_admin_products(
        search=search, status=status, is_featured=is_featured, page=page, page_size=page_size
    )
    return ProductListResponse(
        items=[ProductService.to_response(p) for p in items],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@admin_router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    data: ProductCreate,
    current_user: User = Depends(get_current_admin_user),
):
    product = await ProductService.create_product(data, user_email=current_user.email)
    return ProductService.to_response(product)


@admin_router.post("/reorder")
async def reorder_products(
    items: List[ProductReorderItem],
    current_user: User = Depends(get_current_admin_user),
):
    await ProductService.reorder_products([item.model_dump() for item in items], current_user.email)
    return {"message": "Products reordered successfully"}


@admin_router.get("/{product_id}", response_model=ProductResponse)
async def get_admin_product(
    product_id: str,
    _current_user: User = Depends(get_current_admin_user),
):
    product = await ProductService.get_by_id(product_id)
    return ProductService.to_response(product)


@admin_router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    data: ProductUpdate,
    current_user: User = Depends(get_current_admin_user),
):
    updated = await ProductService.update_product(product_id, data, user_email=current_user.email)
    return ProductService.to_response(updated)


@admin_router.patch("/{product_id}/status", response_model=ProductResponse)
async def update_product_status(
    product_id: str,
    data: ProductStatusUpdate,
    current_user: User = Depends(get_current_admin_user),
):
    updated = await ProductService.update_status(
        product_id, data.status, user_email=current_user.email
    )
    return ProductService.to_response(updated)


@admin_router.delete("/{product_id}", status_code=status.HTTP_200_OK)
async def delete_product(
    product_id: str,
    current_user: User = Depends(get_current_admin_user),
):
    await ProductService.delete_product(product_id, user_email=current_user.email)
    return {"message": "Product deleted successfully"}


@public_router.get("", response_model=List[ProductResponse])
async def list_public_products():
    products = await ProductService.list_public_products()
    return [ProductService.to_response(p) for p in products]


@public_router.get("/{slug}", response_model=ProductResponse)
async def get_public_product(slug: str):
    product = await ProductService.get_by_slug(slug)
    return ProductService.to_response(product)

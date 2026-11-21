import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_admin_products(client: AsyncClient, auth_headers: dict):
    response = await client.get("/api/v1/admin/products", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert data["total"] >= 1


@pytest.mark.asyncio
async def test_create_and_delete_product(client: AsyncClient, auth_headers: dict):
    # 1. Create Product
    product_payload = {
        "name": "Integration Test Product",
        "short_description": "Testing product creation flow",
        "detailed_description": "Comprehensive integration test details",
        "features": ["Feature A", "Feature B"],
        "benefits": ["Benefit 1"],
        "status": "published",
        "display_order": 99,
    }
    create_res = await client.post(
        "/api/v1/admin/products",
        json=product_payload,
        headers=auth_headers,
    )
    assert create_res.status_code == 201
    created_data = create_res.json()
    product_id = created_data["id"]
    slug = created_data["slug"]
    assert slug == "integration-test-product"

    # 2. Get Public Product by Slug
    public_res = await client.get(f"/api/v1/public/products/{slug}")
    assert public_res.status_code == 200
    assert public_res.json()["name"] == "Integration Test Product"

    # 3. Update Product
    update_res = await client.put(
        f"/api/v1/admin/products/{product_id}",
        json={"short_description": "Updated short description"},
        headers=auth_headers,
    )
    assert update_res.status_code == 200
    assert update_res.json()["short_description"] == "Updated short description"

    # 4. Status to Draft
    status_res = await client.patch(
        f"/api/v1/admin/products/{product_id}/status",
        json={"status": "draft"},
        headers=auth_headers,
    )
    assert status_res.status_code == 200
    assert status_res.json()["status"] == "draft"

    # 5. Check public list: draft must NOT be returned in public list
    public_list = await client.get("/api/v1/public/products")
    assert public_list.status_code == 200
    items = public_list.json()
    assert not any(p["id"] == product_id for p in items)

    # 6. Delete Product
    del_res = await client.delete(f"/api/v1/admin/products/{product_id}", headers=auth_headers)
    assert del_res.status_code == 200


@pytest.mark.asyncio
async def test_unauthorized_product_creation(client: AsyncClient):
    response = await client.post(
        "/api/v1/admin/products",
        json={"name": "Hacker Product", "short_description": "Should fail"},
    )
    assert response.status_code == 401

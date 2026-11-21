import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_services_crud(client: AsyncClient, auth_headers: dict):
    # Create Service
    res = await client.post(
        "/api/v1/admin/services",
        json={
            "name": "Cloud Security Architecture",
            "short_description": "Enterprise cloud security review and deployment",
            "status": "published",
        },
        headers=auth_headers,
    )
    assert res.status_code == 201
    service_id = res.json()["id"]

    # Public list
    public_res = await client.get("/api/v1/public/services")
    assert public_res.status_code == 200
    assert any(s["id"] == service_id for s in public_res.json())

    # Delete
    del_res = await client.delete(f"/api/v1/admin/services/{service_id}", headers=auth_headers)
    assert del_res.status_code == 200


@pytest.mark.asyncio
async def test_testimonials_and_faqs(client: AsyncClient, auth_headers: dict):
    # Testimonial
    t_res = await client.post(
        "/api/v1/admin/testimonials",
        json={
            "customer_name": "Test Customer",
            "designation": "CTO",
            "company": "Test Co",
            "content": "This platform transformed our cloud workflow completely.",
            "rating": 5,
        },
        headers=auth_headers,
    )
    assert t_res.status_code == 201
    t_id = t_res.json()["id"]

    # FAQ
    f_res = await client.post(
        "/api/v1/admin/faqs",
        json={
            "question": "Is this test automated?",
            "answer": "Yes, tested via Pytest.",
            "category": "Testing",
        },
        headers=auth_headers,
    )
    assert f_res.status_code == 201
    f_id = f_res.json()["id"]

    # Clean up
    await client.delete(f"/api/v1/admin/testimonials/{t_id}", headers=auth_headers)
    await client.delete(f"/api/v1/admin/faqs/{f_id}", headers=auth_headers)


@pytest.mark.asyncio
async def test_homepage_and_dashboard(client: AsyncClient, auth_headers: dict):
    # Dashboard
    dash_res = await client.get("/api/v1/admin/dashboard", headers=auth_headers)
    assert dash_res.status_code == 200
    stats = dash_res.json()
    assert "total_products" in stats
    assert "recent_updates" in stats

    # Homepage Section
    hero_res = await client.get("/api/v1/admin/homepage/hero", headers=auth_headers)
    assert hero_res.status_code == 200
    assert "heading" in hero_res.json()

    # Public Homepage
    pub_res = await client.get("/api/v1/public/homepage")
    assert pub_res.status_code == 200
    assert "sections" in pub_res.json()

from fastapi import APIRouter

from app.modules.auth.routes import router as auth_router
from app.modules.dashboard.routes import router as dashboard_router
from app.modules.careers.routes import (
    admin_router as careers_admin_router,
)
from app.modules.careers.routes import (
    public_router as careers_public_router,
)
from app.modules.careers.schemas import JobApplicationCreate
from app.modules.careers.services import CareerService
from app.modules.faqs.routes import admin_router as faqs_admin_router
from app.modules.faqs.routes import public_router as faqs_public_router
from app.modules.homepage.routes import (
    admin_router as homepage_admin_router,
)
from app.modules.homepage.routes import (
    public_router as homepage_public_router,
)
from app.modules.homepage.services import HomepageService
from app.modules.media.routes import router as media_admin_router
from app.modules.navigation.routes import (
    admin_router as navigation_admin_router,
)
from app.modules.navigation.routes import (
    public_router as navigation_public_router,
)
from app.modules.products.routes import (
    admin_router as products_admin_router,
)
from app.modules.products.routes import (
    public_router as products_public_router,
)
from app.modules.products.services import ProductService
from app.modules.seo.routes import admin_router as seo_admin_router
from app.modules.seo.routes import public_router as seo_public_router
from app.modules.seo.services import SEOService
from app.modules.services.routes import (
    admin_router as services_admin_router,
)
from app.modules.services.routes import (
    public_router as services_public_router,
)
from app.modules.services.services import ServicesService
from app.modules.settings.routes import (
    admin_router as settings_admin_router,
)
from app.modules.settings.routes import (
    public_router as settings_public_router,
)
from app.modules.settings.services import SettingsService
from app.modules.testimonials.routes import (
    admin_router as testimonials_admin_router,
)
from app.modules.testimonials.routes import (
    public_router as testimonials_public_router,
)

api_router = APIRouter()

# Auth
api_router.include_router(auth_router)

# Admin
api_router.include_router(dashboard_router)
api_router.include_router(homepage_admin_router)
api_router.include_router(products_admin_router)
api_router.include_router(services_admin_router)
api_router.include_router(careers_admin_router)
api_router.include_router(testimonials_admin_router)
api_router.include_router(faqs_admin_router)
api_router.include_router(media_admin_router)
api_router.include_router(navigation_admin_router)
api_router.include_router(seo_admin_router)
api_router.include_router(settings_admin_router)

# Public
api_router.include_router(homepage_public_router)
api_router.include_router(products_public_router)
api_router.include_router(services_public_router)
api_router.include_router(careers_public_router)
api_router.include_router(testimonials_public_router)
api_router.include_router(faqs_public_router)
api_router.include_router(navigation_public_router)
api_router.include_router(seo_public_router)
api_router.include_router(settings_public_router)

# Compatibility router for existing frontend /platform/api/v1 endpoints
platform_compat_router = APIRouter(prefix="/platform/api/v1", tags=["Platform Compatibility"])


def sanitize_icon_url(val) -> str:
    if not val:
        return ""
    val_str = str(val).strip()
    if val_str.startswith("http://") or val_str.startswith("https://") or val_str.startswith("/"):
        return val_str
    if any(val_str.lower().endswith(ext) for ext in [".png", ".jpg", ".jpeg", ".svg", ".webp", ".ico", ".gif"]):
        return val_str
    return ""


@platform_compat_router.get("/homepage-cmss")
async def get_homepage_cmss():
    sections = await HomepageService.get_public_homepage_sections()
    products = await ProductService.list_public_products()
    services = await ServicesService.list_public_services()
    seo = await SEOService.get_or_create_page_seo("homepage")
    footer_setting = await SettingsService.get_setting("footer")
    general_setting = await SettingsService.get_setting("general")

    # Format into structure expected by frontend getHomepageCMS
    stats_section = sections.get("statistics", {})
    stats_list = stats_section.get("content_json", {}).get("stats", [])

    arch_section = sections.get("why_choose_us", {})
    features_list = arch_section.get("content_json", {}).get("features", [])

    categories = [
        {
            "id": str(s.id),
            "name": s.name,
            "description": s.short_description,
            "icon": sanitize_icon_url(s.thumbnail_url or s.icon),
            "iconUrl": sanitize_icon_url(s.thumbnail_url or s.icon),
            "order": s.display_order,
        }
        for s in services
    ] if services else [
        {
            "id": str(p.id),
            "name": p.name,
            "description": p.short_description,
            "icon": sanitize_icon_url(p.product_thumbnail or p.product_logo),
            "iconUrl": sanitize_icon_url(p.product_thumbnail or p.product_logo),
            "order": p.display_order,
        }
        for p in products
    ]

    product_modules = [
        {
            "id": str(p.id),
            "code": p.code or p.slug,
            "name": p.name,
            "abbr": p.abbr or p.name[:4].upper(),
            "status": "live" if (not p.release_date or p.release_date.strip().lower() == "live") else "roadmap",
            "release": p.release_date or "Live",
            "summary": p.short_description,
            "capabilities": p.features,
            "icon": sanitize_icon_url(p.product_thumbnail or p.product_logo),
            "iconUrl": sanitize_icon_url(p.product_thumbnail or p.product_logo),
            "link": p.product_url or f"/module/{p.slug}",
            "order": p.display_order,
        }
        for p in products
    ]

    aliased_sections = dict(sections)
    prod_sec = sections.get("products_section") or sections.get("products") or {}
    if prod_sec:
        aliased_sections["productGrid"] = prod_sec
        aliased_sections["products"] = prod_sec
        aliased_sections["products_section"] = prod_sec

    serv_sec = sections.get("services_section") or sections.get("services") or {}
    if serv_sec:
        aliased_sections["solutions"] = serv_sec
        aliased_sections["services"] = serv_sec
        aliased_sections["services_section"] = serv_sec

    why_sec = sections.get("why_choose_us") or {}
    if why_sec:
        aliased_sections["enterpriseArchitecture"] = why_sec
        aliased_sections["why_choose_us"] = why_sec

    cta_sec = sections.get("contact_cta") or {}
    if cta_sec:
        aliased_sections["ctaBanner"] = cta_sec
        aliased_sections["contact_cta"] = cta_sec

    stat_sec = sections.get("statistics") or {}
    if stat_sec:
        aliased_sections["heroConsole"] = stat_sec
        aliased_sections["statistics"] = stat_sec

    if stats_list:
        hero_stats = [
            {
                "id": f"stat-{i}",
                "key": s.get("key", f"stat-{i}"),
                "label": s.get("label", ""),
                "metric": s.get("numeric_value", ""),
                "caption": s.get("suffix", ""),
                "delta": s.get("delta", ""),
                "bars": s.get("bars", [40, 50, 60, 70, 80]),
                "icon": sanitize_icon_url(s.get("iconUrl") or s.get("icon")),
                "iconUrl": sanitize_icon_url(s.get("iconUrl") or s.get("icon")),
                "order": s.get("display_order", i),
            }
            for i, s in enumerate(stats_list)
        ]
    else:
        hero_stats = [
            {
                "id": "stat-hrms",
                "key": "hrms",
                "label": "HRMS",
                "metric": "1,284",
                "caption": "Employees on roll",
                "delta": "+38 this month",
                "bars": [42, 55, 48, 66, 61, 78, 84],
                "icon": "",
                "iconUrl": "",
                "order": 1,
            },
            {
                "id": "stat-hms",
                "key": "hms",
                "label": "HMS",
                "metric": "312",
                "caption": "In-patients live",
                "delta": "94% bed util.",
                "bars": [30, 45, 52, 60, 58, 71, 79],
                "icon": "",
                "iconUrl": "",
                "order": 2,
            },
            {
                "id": "stat-finance",
                "key": "finance",
                "label": "FINANCE",
                "metric": "₹4.82 Cr",
                "caption": "Q3 run-rate booked",
                "delta": "+14.2% YoY",
                "bars": [50, 55, 62, 58, 70, 75, 88],
                "icon": "",
                "iconUrl": "",
                "order": 3,
            },
            {
                "id": "stat-inventory",
                "key": "inventory",
                "label": "INVENTORY",
                "metric": "18,420",
                "caption": "SKUs reconciled",
                "delta": "99.8% precision",
                "bars": [60, 62, 65, 70, 72, 80, 85],
                "icon": "",
                "iconUrl": "",
                "order": 4,
            },
        ]

    if features_list:
        arch_pillars = [
            {
                "id": f"pillar-{i}",
                "title": f.get("title", ""),
                "body": f.get("description", ""),
                "stat": f.get("stat", ""),
                "icon": sanitize_icon_url(f.get("iconUrl") or f.get("icon")),
                "iconUrl": sanitize_icon_url(f.get("iconUrl") or f.get("icon")),
                "order": f.get("display_order", i),
            }
            for i, f in enumerate(features_list)
        ]
    else:
        arch_pillars = [
            {
                "id": "pillar-isolation",
                "title": "Cryptographic tenant isolation",
                "body": "Every enterprise runs on separate tenant spaces with hardware encryption keys and dedicated schemas.",
                "stat": "100%",
                "icon": "",
                "iconUrl": "",
                "order": 1,
            },
            {
                "id": "pillar-modularity",
                "title": "Modular composability",
                "body": "Activate HRMS, ERP, Inventory, or Healthcare with instant zero-migration interconnectivity.",
                "stat": "8 Modules",
                "icon": "",
                "iconUrl": "",
                "order": 2,
            },
            {
                "id": "pillar-telemetry",
                "title": "Live event telemetry",
                "body": "Real-time streaming ledger and sub-second metrics tracking across all operational nodes.",
                "stat": "<15ms",
                "icon": "",
                "iconUrl": "",
                "order": 3,
            },
            {
                "id": "pillar-ha",
                "title": "High availability failover",
                "body": "Active-active geographical redundancy guaranteeing enterprise uptime commitments.",
                "stat": "99.99%",
                "icon": "",
                "iconUrl": "",
                "order": 4,
            },
        ]

    roadmap_phases = [
        {
            "id": "p-1",
            "period": "Q1 2026",
            "state": "shipped",
            "items": ["Core HRMS & Directory", "Multi-tenant Isolation"],
            "order": 1,
        },
        {
            "id": "p-2",
            "period": "Q2 2026",
            "state": "next",
            "items": ["Inventory & Supply Chain", "Unified Billing Gateway"],
            "order": 2,
        },
        {
            "id": "p-3",
            "period": "Q3 2026",
            "state": "later",
            "items": ["Enterprise AI Workflows", "Custom Connector Marketplace"],
            "order": 3,
        },
    ]

    footer = {
        "columns": footer_setting.data.get("columns", []),
        "legalLinks": footer_setting.data.get("legal_links", []),
        "settings": footer_setting.data,
    }

    branding = {
        "siteName": general_setting.data.get("site_name", "CORPXCLOUD"),
        "logo": general_setting.data.get("logo_light", ""),
        "logoDark": general_setting.data.get("logo_dark", ""),
        "favicon": general_setting.data.get("favicon", ""),
    }

    payload = {
        "content": {"content": sections.get("hero", {}).get("heading", "")},
        "sections": aliased_sections,
        "seo": {
            "id": str(seo.id),
            "page": seo.page_key,
            "title": seo.title,
            "description": seo.meta_description,
            "og_title": seo.og_title,
            "og_description": seo.og_description,
            "og_image": seo.og_image,
            "keywords": seo.keywords,
            "canonical_url": seo.canonical_url,
        },
        "categories": categories,
        "productModules": product_modules,
        "modules": product_modules,
        "heroStats": hero_stats,
        "architecturePillars": arch_pillars,
        "roadmapPhases": roadmap_phases,
        "footer": footer,
        "branding": branding,
    }

    return {
        "status": "success",
        "data": payload,
        **payload,
    }


@platform_compat_router.get("/homepage-categories")
async def get_homepage_categories():
    data = await get_homepage_cmss()
    cats = data["categories"]
    return {"status": "success", "data": cats, "categories": cats}


@platform_compat_router.get("/homepage-product-modules")
async def get_homepage_product_modules():
    data = await get_homepage_cmss()
    mods = data["productModules"]
    return {"status": "success", "data": mods, "productModules": mods, "modules": mods}


@platform_compat_router.get("/enterprise-demo-requests/modules")
async def get_demo_modules():
    data = await get_homepage_cmss()
    mods = data["productModules"]
    return {"status": "success", "data": mods, "modules": mods}


@platform_compat_router.get("/homepage-hero-stats")
async def get_homepage_hero_stats():
    data = await get_homepage_cmss()
    stats = data["heroStats"]
    return {"status": "success", "data": stats, "heroStats": stats}


@platform_compat_router.get("/homepage-architecture-pillars")
async def get_homepage_architecture_pillars():
    data = await get_homepage_cmss()
    pillars = data["architecturePillars"]
    return {"status": "success", "data": pillars, "architecturePillars": pillars}


@platform_compat_router.get("/homepage-roadmap-phases")
async def get_homepage_roadmap_phases():
    phases = [
        {
            "id": "p-1",
            "period": "Q1 2026",
            "state": "shipped",
            "items": ["Core HRMS & Directory", "Multi-tenant Isolation"],
            "order": 1,
        },
        {
            "id": "p-2",
            "period": "Q2 2026",
            "state": "next",
            "items": ["Inventory & Supply Chain", "Unified Billing Gateway"],
            "order": 2,
        },
        {
            "id": "p-3",
            "period": "Q3 2026",
            "state": "later",
            "items": ["Enterprise AI Workflows", "Custom Connector Marketplace"],
            "order": 3,
        },
    ]
    return {"status": "success", "data": phases, "roadmapPhases": phases}


@platform_compat_router.get("/homepage-footer")
async def get_homepage_footer():
    data = await get_homepage_cmss()
    footer = data["footer"]
    return {"status": "success", "data": footer, "footer": footer}


@platform_compat_router.get("/homepage-branding")
async def get_homepage_branding():
    data = await get_homepage_cmss()
    branding = data["branding"]
    return {"status": "success", "data": branding, "branding": branding}


@platform_compat_router.get("/about-us")
@platform_compat_router.get("/about")
async def get_about_compat():
    general = await SettingsService.get_setting("general")
    site_name = general.data.get("site_name", "Corpxcloud")
    about_sec = await HomepageService.get_section("about")
    content_json = about_sec.content_json if (about_sec and about_sec.content_json) else {}

    title = about_sec.heading if (about_sec and about_sec.heading) else f"About {site_name}"
    subtitle = about_sec.subheading if (about_sec and about_sec.subheading) else ""
    description = about_sec.description if (about_sec and about_sec.description) else ""
    mission = content_json.get("mission") or ""
    vision = content_json.get("vision") or ""
    story = content_json.get("company_story") or content_json.get("story") or content_json.get("additional_content") or ""
    stats = content_json.get("stats") or [
        {"value": "100%", "label": "Tenant Isolation"},
        {"value": "8+", "label": "Modular Solutions"},
        {"value": "99.9%", "label": "Targeted Uptime"},
        {"value": "0", "label": "Data Redundancy"},
    ]

    about_data = {
        "id": str(about_sec.id) if about_sec else "about-page",
        "title": title,
        "heading": title,
        "subtitle": subtitle,
        "subheading": subtitle,
        "description": description,
        "company_story": story,
        "mission": mission,
        "vision": vision,
        "stats": stats,
        "company": site_name,
        "sections": [],
    }
    return {"status": "success", "data": about_data, **about_data}


@platform_compat_router.get("/privacy-policy")
@platform_compat_router.get("/privacy")
async def get_privacy_compat():
    privacy_data = {
        "title": "Privacy Policy",
        "introduction": "Corpxcloud enterprise privacy policy and compliance guidelines.",
        "sections": [],
        "last_updated": "2026-11-20",
    }
    return {"status": "success", "data": privacy_data, **privacy_data}


@platform_compat_router.get("/terms-and-conditions")
@platform_compat_router.get("/terms")
async def get_terms_compat():
    terms_data = {
        "title": "Terms and Conditions",
        "introduction": "Enterprise Terms of Service and Multi-tenant SLA.",
        "sections": [],
        "last_updated": "2026-11-20",
    }
    return {"status": "success", "data": terms_data, **terms_data}


@platform_compat_router.post("/enterprise-demo-requests")
async def create_demo_request_compat(data: dict):
    res = {
        "id": "demo_compat",
        "status": "received",
        "message": "Demo request recorded successfully",
        **data,
    }
    return {"status": "success", "data": res, **res}


@platform_compat_router.post("/contact-inquiries")
@platform_compat_router.post("/inquiries")
async def create_contact_inquiry_compat(data: dict):
    res = {
        "id": "inquiry_compat",
        "success": True,
        "message": "Contact inquiry received successfully",
        **data,
    }
    return {"status": "success", "data": res, **res}


@platform_compat_router.get("/careers/jobs")
async def get_careers_jobs_compat():
    jobs = await CareerService.list_public_jobs()
    items = [CareerService.to_job_response(j).model_dump() for j in jobs]
    return {"status": "success", "data": items, "items": items}


@platform_compat_router.post("/job-applications")
@platform_compat_router.post("/careers/apply")
async def create_job_application_compat(data: dict):
    try:
        app_data = JobApplicationCreate(
            job_id=str(data.get("job_id") or ""),
            job_title=str(data.get("job_title") or "General Application"),
            name=str(data.get("name") or data.get("fullName") or "Anonymous"),
            email=str(data.get("email") or ""),
            phone=str(data.get("phone") or ""),
            experience_range=str(data.get("experience_range") or data.get("experience") or ""),
            experience_years=float(data["experience_years"]) if data.get("experience_years") is not None else None,
            portfolio_url=str(data.get("portfolio_url") or data.get("portfolioUrl") or "") or None,
            resume_url=str(data.get("resume_url") or data.get("resumeUrl") or "") or None,
            cover_note=str(data.get("cover_note") or data.get("coverNote") or data.get("message") or "") or None,
        )
        saved_app = await CareerService.create_application(app_data)
        res = CareerService.to_app_response(saved_app).model_dump()
        return {"status": "success", "success": True, "message": "Application submitted successfully", "data": res}
    except Exception as e:
        return {"status": "error", "success": False, "message": str(e)}

import logging

from app.core.config import settings
from app.modules.auth.services import AuthService
from app.modules.faqs.models import FAQ
from app.modules.homepage.models import HomepageSection
from app.modules.navigation.models import NavigationItem
from app.modules.products.models import Product
from app.modules.services.models import Service
from app.modules.settings.models import SiteSetting
from app.modules.testimonials.models import Testimonial

logger = logging.getLogger(__name__)


async def seed_initial_data():
    """Seed the database with initial admin and CorpXcloud content if empty."""
    # 1. Admin User
    admin = await AuthService.get_by_email(settings.ADMIN_EMAIL)
    if not admin:
        logger.info(f"Creating default admin user: {settings.ADMIN_EMAIL}")
        await AuthService.create_user(
            email=settings.ADMIN_EMAIL,
            password=settings.ADMIN_PASSWORD,
            full_name="CorpXcloud Administrator",
            role="superadmin",
        )

    # 2. Homepage Sections
    existing_sections = await HomepageSection.count()
    if existing_sections == 0:
        logger.info("Seeding homepage sections...")
        default_sections = [
            {
                "section_key": "hero",
                "heading": "One unified cloud platform to power your entire enterprise architecture.",
                "subheading": "Next-gen enterprise operating system",
                "description": "From HR and healthcare to supply chain and operations — scale your organization with modular, cloud-native enterprise tools that share one tenant, one identity model and one source of truth.",
                "primary_cta_label": "Request enterprise demo",
                "primary_cta_url": "#demo",
                "secondary_cta_label": "Explore modules",
                "secondary_cta_url": "#modules",
                "display_order": 1,
                "is_visible": True,
            },
            {
                "section_key": "about",
                "heading": "About CorpXcloud",
                "subheading": "Architected for Mission-Critical Reliability",
                "description": "CorpXcloud is a multi-tenant enterprise cloud platform engineered to run enterprise operations under one unified source of truth.",
                "content_json": {
                    "mission": "Unify distributed operations under a robust, scalable cloud infrastructure.",
                    "vision": "Zero operational data silos across enterprise organizations globally.",
                    "additional_content": "Shared identity, tenant-level isolation, and real-time observability out of the box.",
                },
                "display_order": 2,
                "is_visible": True,
            },
            {
                "section_key": "products",
                "heading": "Start with one module. Add the rest without a migration.",
                "subheading": "The module catalogue",
                "description": "Every system shares the same tenant, permission model and data layer, so an employee record created in HRMS is the same record a doctor roster or a purchase approval reads from.",
                "display_order": 3,
                "is_visible": True,
            },
            {
                "section_key": "services",
                "heading": "Six industries, one deployment pattern.",
                "subheading": "Built for operators",
                "description": "Pick the modules your sector runs on. The tenant, roles and reporting layer stay identical underneath.",
                "display_order": 4,
                "is_visible": True,
            },
            {
                "section_key": "why_choose_us",
                "heading": "The parts you only notice when they fail.",
                "subheading": "Platform architecture",
                "description": "CORPXCLOUD is a single platform with many front doors. Security, availability and reporting are solved once, at the infrastructure layer, rather than re-implemented in every module.",
                "content_json": {
                    "features": [
                        {
                            "title": "Multi-tenant security",
                            "description": "Enterprise-grade isolation and zero-trust identity across all modules.",
                            "icon": "ShieldCheck",
                            "stat": "SOC 2 Type II",
                            "display_order": 1,
                        },
                        {
                            "title": "High-availability cloud",
                            "description": "99.99% SLA backed by multi-region redundancy and real-time replication.",
                            "icon": "ServerCog",
                            "stat": "99.99% uptime",
                            "display_order": 2,
                        },
                        {
                            "title": "Seamless API integration",
                            "description": "Unified REST & GraphQL APIs to interconnect third-party legacy ERPs.",
                            "icon": "Blocks",
                            "stat": "< 20ms latency",
                            "display_order": 3,
                        },
                        {
                            "title": "Real-time analytics",
                            "description": "Cross-module dashboards streaming operational metrics instantly.",
                            "icon": "Gauge",
                            "stat": "Zero lag",
                            "display_order": 4,
                        },
                    ]
                },
                "display_order": 5,
                "is_visible": True,
            },
            {
                "section_key": "statistics",
                "heading": "Live Enterprise Telemetry",
                "subheading": "Real-Time System Metrics",
                "description": "Telemetry across our multi-tenant cloud infrastructure.",
                "content_json": {
                    "stats": [
                        {
                            "label": "HRMS",
                            "numeric_value": "12,480",
                            "prefix": "",
                            "suffix": " users",
                            "display_order": 1,
                            "is_visible": True,
                            "key": "hrms",
                            "delta": "+14%",
                            "bars": [42, 55, 48, 66, 61, 78, 84],
                        },
                        {
                            "label": "HMS",
                            "numeric_value": "99.98",
                            "prefix": "",
                            "suffix": "%",
                            "display_order": 2,
                            "is_visible": True,
                            "key": "hms",
                            "delta": "99.99% SLA",
                            "bars": [60, 65, 70, 75, 80, 85, 90],
                        },
                        {
                            "label": "Inventory",
                            "numeric_value": "3.4",
                            "prefix": "$",
                            "suffix": "M",
                            "display_order": 3,
                            "is_visible": True,
                            "key": "inventory",
                            "delta": "in transit",
                            "bars": [30, 45, 55, 60, 68, 72, 85],
                        },
                    ]
                },
                "display_order": 6,
                "is_visible": True,
            },
            {
                "section_key": "testimonials",
                "heading": "Trusted by Operations and IT Leaders",
                "subheading": "Customer Testimonials",
                "description": "Learn how leading enterprise operators consolidated multiple legacy systems onto CorpXcloud.",
                "display_order": 7,
                "is_visible": True,
            },
            {
                "section_key": "faq",
                "heading": "Frequently Asked Questions",
                "subheading": "Deployment & Governance",
                "description": "Common questions regarding single-tenant vs multi-tenant isolation, onboarding timelines, and data sovereignty.",
                "display_order": 8,
                "is_visible": True,
            },
            {
                "section_key": "contact_cta",
                "heading": "Bring your hospital, your factory and your head office onto the same platform.",
                "subheading": "One Contact, Every Department",
                "description": "Tell us which modules you need first. We will map your current systems, size the tenant and give you a migration plan — no licence commitment to start.",
                "primary_cta_label": "Request enterprise demo",
                "primary_cta_url": "#demo",
                "secondary_cta_label": "Talk to sales about pricing",
                "secondary_cta_url": "mailto:sales@corpxcloud.com",
                "display_order": 9,
                "is_visible": True,
            },
        ]
        for s in default_sections:
            await HomepageSection(**s).insert()

    # 3. Products (Modules)
    if await Product.count() == 0:
        logger.info("Seeding products / modules...")
        default_products = [
            {
                "name": "Human Resource Management System",
                "slug": "hrms",
                "code": "hr.core",
                "abbr": "HRMS",
                "short_description": "Core HR, global payroll, compliance and performance tracking in one unified interface.",
                "detailed_description": "An enterprise-grade workforce operating system covering payroll calculations, tax withholding, attendance tracking, shift scheduling, and recruitment pipelines.",
                "features": [
                    "Global Payroll Engine",
                    "Attendance & Biometric Sync",
                    "Shift Scheduling",
                    "Performance Appraisals",
                ],
                "benefits": [
                    "Eliminate payroll errors",
                    "100% statutory compliance",
                    "Single employee ID across modules",
                ],
                "cta_label": "Request HRMS Demo",
                "display_order": 1,
                "is_featured": True,
                "status": "published",
                "release_date": "Live",
            },
            {
                "name": "Hospital Management System",
                "slug": "hms",
                "code": "care.hms",
                "abbr": "HMS",
                "short_description": "IPD, OPD, OT scheduling, pharmacy billing and ABDM compliant EHR integration.",
                "detailed_description": "Full clinical and administrative workflows for multi-specialty hospitals and clinics, integrating lab reports, ward allocation, and doctor rosters.",
                "features": [
                    "ABDM Compliant EHR",
                    "IPD / OPD Billing",
                    "OT Scheduling",
                    "Pharmacy Inventory",
                ],
                "benefits": [
                    "Accelerate patient turnaround",
                    "NABH-compliant recordkeeping",
                    "Direct billing integration",
                ],
                "cta_label": "Request HMS Demo",
                "display_order": 2,
                "is_featured": True,
                "status": "published",
                "release_date": "Live",
            },
            {
                "name": "Vendor & Inventory Management",
                "slug": "inventory-management",
                "code": "ops.scm",
                "abbr": "SCM",
                "short_description": "Automated procurement, multi-warehouse stock levels and vendor evaluation.",
                "detailed_description": "Track batches, serial numbers, re-order thresholds, and PO approvals seamlessly with multi-currency vendor quotes.",
                "features": [
                    "Multi-Warehouse Tracking",
                    "Barcode & QR Scanning",
                    "Automated Purchase Orders",
                    "Vendor Scorecards",
                ],
                "benefits": [
                    "Reduce holding costs by 22%",
                    "Zero stockouts on critical items",
                    "Auditable supplier portal",
                ],
                "cta_label": "Explore SCM",
                "display_order": 3,
                "is_featured": True,
                "status": "published",
                "release_date": "Live",
            },
            {
                "name": "Enterprise Resource Planning",
                "slug": "erp",
                "code": "core.erp",
                "abbr": "ERP",
                "short_description": "General ledger, multi-entity consolidation, accounts payable and automated reconciliations.",
                "detailed_description": "Real-time enterprise accounting and financial governance built for multi-company holding structures.",
                "features": [
                    "General Ledger",
                    "Multi-Entity Consolidation",
                    "Accounts Payable/Receivable",
                    "Bank Reconciliation",
                ],
                "benefits": [
                    "Close books in 2 days",
                    "Full audit trail",
                    "Automated GST/tax filings",
                ],
                "cta_label": "Join ERP Waitlist",
                "display_order": 4,
                "is_featured": False,
                "status": "published",
                "release_date": "Q3 2026",
            },
            {
                "name": "Identity Governance & Administration",
                "slug": "identity-governance",
                "code": "sec.iga",
                "abbr": "IGA",
                "short_description": "Role-based access control, automated provisioning and audit-ready access reviews.",
                "detailed_description": "Zero-trust identity plane managing user entitlements, single sign-on (SSO), and periodic privilege recertification.",
                "features": [
                    "RBAC & ABAC Policies",
                    "Automated User Provisioning",
                    "Access Certification Campaigns",
                    "SAML / OIDC SSO",
                ],
                "benefits": [
                    "Instant deprovisioning on termination",
                    "Zero orphaned accounts",
                    "Audit-ready compliance reports",
                ],
                "cta_label": "Preview IGA",
                "display_order": 5,
                "is_featured": False,
                "status": "published",
                "release_date": "Q4 2026",
            },
            {
                "name": "Customer Relationship Management",
                "slug": "crm",
                "code": "rev.crm",
                "abbr": "CRM",
                "short_description": "Track every deal from first touch to signature, with the numbers your board asks for.",
                "detailed_description": "Pipeline analytics, lead scoring, deal forecasts, and quote-to-contract workflows.",
                "features": [
                    "Configurable sales pipelines",
                    "Lead scoring and routing rules",
                    "Deal analytics and forecasting",
                    "Quote and contract handoff",
                ],
                "benefits": ["Accelerate revenue cycle", "Accurate board forecasting"],
                "cta_label": "Explore CRM",
                "display_order": 6,
                "is_featured": False,
                "status": "published",
                "release_date": "Q3 2026",
            },
            {
                "name": "Restaurant Management",
                "slug": "restaurant",
                "code": "fnb.pos",
                "abbr": "POS",
                "short_description": "Take the order, fire it to the kitchen and settle the bill on the same terminal.",
                "detailed_description": "Full dining operations with POS, KDS, split bills, table bookings, and food costing.",
                "features": [
                    "Point of sale with split billing",
                    "Table layout and reservations",
                    "Kitchen display system routing",
                    "Recipe-level ingredient costing",
                ],
                "benefits": ["Zero table delay", "Live kitchen display system"],
                "cta_label": "Explore POS",
                "display_order": 7,
                "is_featured": False,
                "status": "published",
                "release_date": "Q4 2026",
            },
            {
                "name": "Institute Management",
                "slug": "institute",
                "code": "edu.sis",
                "abbr": "SIS",
                "short_description": "Keep students, faculty and parents looking at the same academic record.",
                "detailed_description": "Full school/college system with admissions, student records, fee collection, and parent app.",
                "features": [
                    "Student information and admissions",
                    "Course grading and transcripts",
                    "Fee collection with online payments",
                    "Parent portal and attendance alerts",
                ],
                "benefits": ["Single academic profile", "Automated parent SMS/alerts"],
                "cta_label": "Explore SIS",
                "display_order": 8,
                "is_featured": False,
                "status": "published",
                "release_date": "Q4 2026",
            },
        ]
        for p in default_products:
            await Product(**p).insert()

    # 4. Services
    if await Service.count() == 0:
        logger.info("Seeding services / industries...")
        default_services = [
            {
                "name": "Healthcare & Diagnostics",
                "slug": "healthcare",
                "short_description": "Integrated hospital, lab information and pharmacy systems for clinical excellence.",
                "detailed_description": "End-to-end digital hospital workflows connecting doctor consultations to bed management and diagnostic reporting.",
                "features": [
                    "ABDM Health ID Integration",
                    "Radiology & Pathology Sync",
                    "Emergency Ward Management",
                ],
                "benefits": ["Paperless patient journey", "Instant insurance pre-authorizations"],
                "display_order": 1,
                "status": "published",
            },
            {
                "name": "Supply Chain & Manufacturing",
                "slug": "manufacturing",
                "short_description": "Raw material tracking, batch manufacturing records and automated replenishment.",
                "detailed_description": "Bill of Materials (BOM) management, production planning, machine downtime monitoring and vendor logistics.",
                "features": ["BOM Generation", "Batch Tracking", "Shop Floor Control"],
                "benefits": ["Optimize production cycles", "Complete supplier traceability"],
                "display_order": 2,
                "status": "published",
            },
            {
                "name": "Retail & Distribution",
                "slug": "retail",
                "short_description": "Centralized inventory for multiple stores, franchises and fulfillment centers.",
                "detailed_description": "Omnichannel stock synchronization with point-of-sale systems and dynamic price management.",
                "features": [
                    "Store Stock Allocation",
                    "Omnichannel Inventory",
                    "Franchise Settlement",
                ],
                "benefits": ["Unified view of store sales", "Zero discrepancy across channels"],
                "display_order": 3,
                "status": "published",
            },
            {
                "name": "Education & Institutions",
                "slug": "education",
                "short_description": "Student information systems, fee collection, faculty management and examinations.",
                "detailed_description": "Comprehensive institutional ERP managing academic calendars, grading systems, and student records.",
                "features": ["Admissions & Fees", "Grade Book & Transcripts", "Hostel & Transport"],
                "benefits": ["Automated fee reconciliations", "Self-service student portal"],
                "display_order": 4,
                "status": "published",
            },
            {
                "name": "Corporate & shared services",
                "slug": "corporate-shared-services",
                "short_description": "Shared IT, HR and finance governance across holding entities.",
                "detailed_description": "Shared IT, HR and finance governance across holding entities.",
                "features": ["Cross-Entity HR", "Unified Approvals"],
                "benefits": ["Centralized control"],
                "display_order": 5,
                "status": "published",
            },
            {
                "name": "Restaurant groups",
                "slug": "restaurant-groups",
                "short_description": "Multi-outlet point-of-sale, recipe inventory and commissary kitchens.",
                "detailed_description": "Multi-outlet point-of-sale, recipe inventory and commissary kitchens.",
                "features": ["Central Commissary", "Split Billing"],
                "benefits": ["Zero revenue leakage"],
                "display_order": 6,
                "status": "published",
            },
        ]
        for s in default_services:
            await Service(**s).insert()

    # 5. Testimonials
    if await Testimonial.count() == 0:
        logger.info("Seeding testimonials...")
        default_testimonials = [
            {
                "customer_name": "Dr. Rajesh Sharma",
                "designation": "Chief Medical Officer",
                "company": "Apex Super-Specialty Healthcare",
                "content": "Moving 400 beds and 3 regional clinics onto CorpXcloud HMS unified our patient records completely. Doctor consultation delays dropped by 35% in month one.",
                "rating": 5,
                "display_order": 1,
                "status": "published",
            },
            {
                "customer_name": "Anita Verma",
                "designation": "VP of Human Resources",
                "company": "Sterling Logistics Group",
                "content": "CorpXcloud HRMS simplified payroll across 3,500 distributed employees and warehouse operators. Monthly payroll that used to take 5 days now processes in 3 hours.",
                "rating": 5,
                "display_order": 2,
                "status": "published",
            },
            {
                "customer_name": "Siddharth Roy",
                "designation": "Director of Supply Chain",
                "company": "Zenith Manufacturing Corp",
                "content": "The unified tenant architecture means our procurement team and warehouse inventory talk to the same database. Stockouts have virtually dropped to zero.",
                "rating": 5,
                "display_order": 3,
                "status": "published",
            },
        ]
        for t in default_testimonials:
            await Testimonial(**t).insert()

    # 6. FAQs
    if await FAQ.count() == 0:
        logger.info("Seeding FAQs...")
        default_faqs = [
            {
                "question": "Can we deploy one module first and add others later?",
                "answer": "Yes. CorpXcloud is architected so every module shares the exact same tenant, identity layer and data model. You can begin with HRMS or SCM today and activate other modules later without any data migration.",
                "category": "Architecture",
                "display_order": 1,
                "status": "published",
            },
            {
                "question": "Is our data isolated from other organizations?",
                "answer": "Absolutely. Every customer has tenant-level data isolation with dedicated encryption keys at rest and in transit. We support both high-density multi-tenant cloud and isolated single-tenant dedicated deployments.",
                "category": "Security",
                "display_order": 2,
                "status": "published",
            },
            {
                "question": "How does CorpXcloud integrate with existing legacy ERPs?",
                "answer": "CorpXcloud exposes enterprise REST and webhook APIs. We offer bi-directional sync adaptors for popular accounting and ERP systems so your existing workflows remain uninterrupted during rollout.",
                "category": "Integration",
                "display_order": 3,
                "status": "published",
            },
            {
                "question": "What compliance certifications does the platform hold?",
                "answer": "The platform is built to SOC 2 Type II, ISO 27001, and HIPAA compliance standards, with full ABDM compliance for healthcare deployments in India.",
                "category": "Compliance",
                "display_order": 4,
                "status": "published",
            },
        ]
        for f in default_faqs:
            await FAQ(**f).insert()

    # 7. Navigation
    if await NavigationItem.count() == 0:
        logger.info("Seeding navigation items...")
        default_nav = [
            {"label": "Products", "url": "/module", "display_order": 1, "is_visible": True},
            {
                "label": "Solutions",
                "url": "/enterprise-solutions",
                "display_order": 2,
                "is_visible": True,
            },
            {"label": "Enterprise", "url": "/#enterprise", "display_order": 3, "is_visible": True},
            {"label": "About", "url": "/about-us", "display_order": 4, "is_visible": True},
            {"label": "Contact", "url": "/contact-us", "display_order": 5, "is_visible": True},
            {"label": "Careers", "url": "/careers", "display_order": 6, "is_visible": True},
        ]
        for n in default_nav:
            await NavigationItem(**n).insert()

    # 8. Site Settings & SEO
    if await SiteSetting.count() == 0:
        logger.info("Seeding site settings...")
        settings_defaults = [
            (
                "general",
                {
                    "site_name": "CorpXcloud",
                    "site_tagline": "Enterprise Multi-Cloud Platform",
                    "site_description": "Unified enterprise operating system and modular cloud infrastructure.",
                    "site_url": "https://corpxcloud.com",
                    "maintenance_mode": False,
                },
            ),
            (
                "contact",
                {
                    "general_email": "contact@corpxcloud.com",
                    "sales_email": "sales@corpxcloud.com",
                    "phone": "+1 (800) 555-0199",
                    "city": "San Francisco",
                    "region": "California",
                    "country": "United States",
                    "linkedin_url": "https://linkedin.com/company/corpxcloud",
                    "x_url": "https://x.com/corpxcloud",
                },
            ),
            (
                "footer",
                {
                    "description": "CorpXcloud is an enterprise cloud ecosystem built for secure multi-tenant computing.",
                    "legal_name": "CorpXcloud Technologies, Inc.",
                    "copyright_text": "© 2026 CorpXcloud Technologies, Inc. All rights reserved.",
                },
            ),
        ]
        for key, data in settings_defaults:
            await SiteSetting(setting_key=key, data=data).insert()

    # 9. Default SEO Metadata
    from app.modules.seo.models import SEOMetadata

    if await SEOMetadata.count() == 0:
        logger.info("Seeding SEO metadata...")
        seo_defaults = [
            {
                "page_key": "home",
                "title": "CorpXcloud | The Enterprise Operating Platform",
                "meta_description": "From HR to supply chain — scale your organization with modular, cloud-native enterprise tools sharing one source of truth.",
                "keywords": ["enterprise cloud", "modular erp", "cloud platform", "multi-tenant"],
            },
            {
                "page_key": "about",
                "title": "About Us | CorpXcloud",
                "meta_description": "Learn about the mission, engineering principles, and team behind CorpXcloud.",
                "keywords": ["about corpxcloud", "enterprise architecture", "cloud infrastructure"],
            },
            {
                "page_key": "solutions",
                "title": "Enterprise Solutions | CorpXcloud",
                "meta_description": "Industry-specific solutions for healthcare, finance, retail, and manufacturing.",
                "keywords": ["enterprise solutions", "healthcare cloud", "fintech erp"],
            },
            {
                "page_key": "contact",
                "title": "Contact Us | CorpXcloud",
                "meta_description": "Connect with our enterprise architecture and deployment teams.",
                "keywords": ["contact", "enterprise support", "demo request"],
            },
        ]
        for s in seo_defaults:
            await SEOMetadata(**s).insert()

    logger.info("Initial database seeding completed successfully.")

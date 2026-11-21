import logging
import re
from datetime import datetime, timezone
from typing import List, Optional, Tuple

from bson import ObjectId
from fastapi import HTTPException, status

from .models import JobApplication, JobOpening
from .schemas import (
    JobApplicationCreate,
    JobApplicationResponse,
    JobOpeningCreate,
    JobOpeningResponse,
    JobOpeningUpdate,
)

logger = logging.getLogger(__name__)


def parse_experience_years(range_str: Optional[str], explicit_years: Optional[float] = None) -> float:
    if explicit_years is not None:
        return float(explicit_years)
    if not range_str:
        return 0.0
    val = range_str.strip().lower()
    mapping = {
        "0": 0.0,
        "fresher": 0.0,
        "0-1": 0.5,
        "1-2": 1.5,
        "2-3": 2.5,
        "3-4": 3.5,
        "4-5": 4.5,
        "5-10": 7.5,
        "10-15": 12.5,
        "15+": 15.0,
    }
    if val in mapping:
        return mapping[val]
    match = re.search(r"(\d+(\.\d+)?)", val)
    if match:
        try:
            return float(match.group(1))
        except ValueError:
            pass
    return 0.0


DEFAULT_INITIAL_JOBS = [
    {
        "title": "Senior Full-Stack Engineer (Next.js & Cloud)",
        "department": "Engineering",
        "location": "Kolkata, India (Hybrid)",
        "type": "Full-time",
        "experience": "4+ years",
        "summary": "Help architect and scale our core multi-tenant engine powering HRMS, ERP, and healthcare modules with high concurrency.",
        "responsibilities": [
            "Design and ship scalable front-end and back-end micro-frontends in Next.js, React, and TypeScript.",
            "Build performant REST & Webhook API surfaces adhering to OpenAPI specifications.",
            "Optimize multi-tenant database queries and real-time event subscriptions.",
        ],
        "requirements": [
            "Strong proficiency in TypeScript, React 18+, Next.js App Router, and Tailwind CSS.",
            "Hands-on experience building multi-tenant SaaS or distributed enterprise systems.",
            "Familiarity with cloud infra (Docker, Kubernetes, AWS/GCP, PostgreSQL).",
        ],
        "display_order": 1,
        "status": "published",
    },
    {
        "title": "Enterprise Cloud Solutions Architect",
        "department": "Engineering",
        "location": "Kolkata / Remote (India)",
        "type": "Full-time",
        "experience": "6+ years",
        "summary": "Lead our architectural decisions for cryptographic tenant isolation, data sovereignty, and 99.9% high availability.",
        "responsibilities": [
            "Architect isolated database partitioning schemes across heterogeneous cloud environments.",
            "Implement zero-trust security postures, automated TLS termination, and role-based access gateways.",
            "Collaborate directly with enterprise clients on private tenant sizing and disaster recovery plans.",
        ],
        "requirements": [
            "Extensive experience in distributed cloud architectures and multi-tenant security models.",
            "Deep understanding of Linux internals, container orchestrators, and network topologies.",
            "Proven track record of managing enterprise SaaS SLAs and compliance requirements.",
        ],
        "display_order": 2,
        "status": "published",
    },
    {
        "title": "Senior UI/UX Product Designer",
        "department": "Product & Design",
        "location": "Kolkata, India (Hybrid)",
        "type": "Full-time",
        "experience": "3+ years",
        "summary": "Transform complicated enterprise workflows into intuitive, beautiful, and accessible user interfaces.",
        "responsibilities": [
            "Evolve Corpxcloud's design system tokens, lattice grid motifs, and reusable component libraries.",
            "Conduct user interviews with hospital admins, HR directors, and factory floor operators.",
            "Deliver high-fidelity prototypes with interactive micro-animations in Figma.",
        ],
        "requirements": [
            "Solid portfolio demonstrating complex B2B SaaS or enterprise web applications.",
            "Obsessive attention to detail in visual hierarchy, typography, and accessibility (WCAG AA).",
            "Familiarity with design systems in code (Tailwind CSS, design tokens).",
        ],
        "display_order": 3,
        "status": "published",
    },
    {
        "title": "Enterprise Account Executive (SaaS)",
        "department": "Sales & Solutions",
        "location": "Kolkata / Mumbai (India)",
        "type": "Full-time",
        "experience": "3+ years",
        "summary": "Lead enterprise commercial relationships with hospital chains, conglomerates, and institutional clients.",
        "responsibilities": [
            "Prospect, pitch, and close high-value multi-tenant software contracts across India.",
            "Coordinate with technical solution engineers to tailor live proof-of-concept demos.",
            "Build long-term pipeline and manage relationships with enterprise C-suite decision-makers.",
        ],
        "requirements": [
            "Proven quota-carrying experience selling B2B SaaS or enterprise ERP/HRMS solutions.",
            "Outstanding presentation, consultative discovery, and contract negotiation skills.",
            "Strong understanding of enterprise procurement cycles and software ROI.",
        ],
        "display_order": 4,
        "status": "published",
    },
    {
        "title": "Technical Implementation & Client Success Lead",
        "department": "Operations",
        "location": "Kolkata, India",
        "type": "Full-time",
        "experience": "2+ years",
        "summary": "Guide enterprise clients through tenant onboarding, historical data migration (ETL), and administrator training.",
        "responsibilities": [
            "Lead end-to-end rollout schedules from contract signature to go-live signoff.",
            "Audit and sanitize legacy datasets (Excel, legacy SQL) and map them cleanly to Corpxcloud schemas.",
            "Act as the primary technical point-of-contact for mission-critical client support.",
        ],
        "requirements": [
            "Prior experience in enterprise software implementation, customer success, or tech consulting.",
            "Strong analytical skills with SQL, CSV/JSON data transformation, and scripting.",
            "Customer-centric mindset with top-tier written and verbal communication.",
        ],
        "display_order": 5,
        "status": "published",
    },
]


class CareerService:
    @staticmethod
    def to_job_response(job: JobOpening) -> JobOpeningResponse:
        return JobOpeningResponse(
            id=str(job.id),
            title=job.title,
            department=job.department,
            location=job.location,
            type=job.type,
            experience=job.experience,
            summary=job.summary,
            responsibilities=job.responsibilities,
            requirements=job.requirements,
            display_order=job.display_order,
            status=job.status,
            created_at=job.created_at,
            updated_at=job.updated_at,
        )

    @staticmethod
    def to_app_response(app: JobApplication) -> JobApplicationResponse:
        return JobApplicationResponse(
            id=str(app.id),
            job_id=app.job_id,
            job_title=app.job_title,
            name=app.name,
            email=app.email,
            phone=app.phone,
            experience_range=app.experience_range,
            experience_years=app.experience_years,
            portfolio_url=app.portfolio_url,
            resume_url=app.resume_url,
            cover_note=app.cover_note,
            status=app.status,
            created_at=app.created_at,
            updated_at=app.updated_at,
        )

    @classmethod
    async def seed_initial_jobs(cls):
        count = await JobOpening.count()
        if count == 0:
            logger.info("Seeding initial job openings...")
            for j in DEFAULT_INITIAL_JOBS:
                await JobOpening(**j).insert()
            logger.info("Initial job openings seeded.")

    @classmethod
    async def list_admin_jobs(
        cls,
        search: Optional[str] = None,
        department: Optional[str] = None,
        status: Optional[str] = None,
        page: int = 1,
        page_size: int = 50,
    ) -> Tuple[List[JobOpening], int, int]:
        await cls.seed_initial_jobs()
        query = {}
        if status:
            query["status"] = status
        if department and department != "All":
            query["department"] = department
        if search:
            query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"location": {"$regex": search, "$options": "i"}},
                {"summary": {"$regex": search, "$options": "i"}},
            ]

        total = await JobOpening.find(query).count()
        skip = (page - 1) * page_size
        items = (
            await JobOpening.find(query)
            .sort([("display_order", 1), ("created_at", -1)])
            .skip(skip)
            .limit(page_size)
            .to_list()
        )
        total_pages = (total + page_size - 1) // page_size if total > 0 else 1
        return items, total, total_pages

    @classmethod
    async def list_public_jobs(cls) -> List[JobOpening]:
        await cls.seed_initial_jobs()
        return (
            await JobOpening.find({"status": "published"})
            .sort([("display_order", 1), ("created_at", -1)])
            .to_list()
        )

    @classmethod
    async def get_job_by_id(cls, job_id: str) -> JobOpening:
        if not ObjectId.is_valid(job_id):
            raise HTTPException(status_code=400, detail="Invalid job ID")
        job = await JobOpening.get(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job opening not found")
        return job

    @classmethod
    async def create_job(cls, data: JobOpeningCreate) -> JobOpening:
        job = JobOpening(**data.model_dump())
        await job.insert()
        return job

    @classmethod
    async def update_job(cls, job_id: str, data: JobOpeningUpdate) -> JobOpening:
        job = await cls.get_job_by_id(job_id)
        update_data = {k: v for k, v in data.model_dump(exclude_unset=True).items() if v is not None}
        update_data["updated_at"] = datetime.now(timezone.utc)
        await job.set(update_data)
        return job

    @classmethod
    async def delete_job(cls, job_id: str):
        job = await cls.get_job_by_id(job_id)
        await job.delete()

    @classmethod
    async def create_application(cls, data: JobApplicationCreate) -> JobApplication:
        exp_years = parse_experience_years(data.experience_range, data.experience_years)
        app = JobApplication(
            job_id=data.job_id,
            job_title=data.job_title,
            name=data.name.strip(),
            email=data.email.strip().lower(),
            phone=data.phone.strip(),
            experience_range=data.experience_range or "",
            experience_years=exp_years,
            portfolio_url=data.portfolio_url.strip() if data.portfolio_url else None,
            resume_url=data.resume_url.strip() if data.resume_url else None,
            cover_note=data.cover_note.strip() if data.cover_note else None,
            status="pending",
        )
        await app.insert()
        return app

    @classmethod
    async def list_applications(
        cls,
        job_id: Optional[str] = None,
        job_title: Optional[str] = None,
        experience_group: Optional[str] = None,
        min_experience: Optional[float] = None,
        max_experience: Optional[float] = None,
        status: Optional[str] = None,
        search: Optional[str] = None,
        page: int = 1,
        page_size: int = 50,
    ) -> Tuple[List[JobApplication], int, int]:
        query = {}

        if job_id and job_id != "all":
            query["$or"] = [{"job_id": job_id}, {"job_title": job_id}]
        elif job_title:
            query["job_title"] = job_title

        if status and status != "all":
            query["status"] = status

        # Experience filters
        if experience_group and experience_group != "all":
            if experience_group == "fresher" or experience_group == "0":
                query["experience_years"] = {"$lte": 0.5}
            elif experience_group == "1-2":
                query["experience_years"] = {"$gte": 1.0, "$lte": 2.5}
            elif experience_group == "2-3":
                query["experience_years"] = {"$gte": 2.0, "$lte": 3.5}
            elif experience_group == "3-5":
                query["experience_years"] = {"$gte": 3.0, "$lte": 5.5}
            elif experience_group == "5-10":
                query["experience_years"] = {"$gte": 5.0, "$lte": 10.5}
            elif experience_group == "10+":
                query["experience_years"] = {"$gte": 10.0}
        else:
            exp_conditions = {}
            if min_experience is not None:
                exp_conditions["$gte"] = min_experience
            if max_experience is not None:
                exp_conditions["$lte"] = max_experience
            if exp_conditions:
                query["experience_years"] = exp_conditions

        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"email": {"$regex": search, "$options": "i"}},
                {"phone": {"$regex": search, "$options": "i"}},
                {"job_title": {"$regex": search, "$options": "i"}},
            ]

        total = await JobApplication.find(query).count()
        skip = (page - 1) * page_size
        items = (
            await JobApplication.find(query)
            .sort([("created_at", -1)])
            .skip(skip)
            .limit(page_size)
            .to_list()
        )
        total_pages = (total + page_size - 1) // page_size if total > 0 else 1
        return items, total, total_pages

    @classmethod
    async def get_application_by_id(cls, app_id: str) -> JobApplication:
        if not ObjectId.is_valid(app_id):
            raise HTTPException(status_code=400, detail="Invalid application ID")
        app = await JobApplication.get(app_id)
        if not app:
            raise HTTPException(status_code=404, detail="Application not found")
        return app

    @classmethod
    async def update_application_status(cls, app_id: str, new_status: str) -> JobApplication:
        app = await cls.get_application_by_id(app_id)
        app.status = new_status
        app.updated_at = datetime.now(timezone.utc)
        await app.save()
        return app

    @classmethod
    async def delete_application(cls, app_id: str):
        app = await cls.get_application_by_id(app_id)
        await app.delete()

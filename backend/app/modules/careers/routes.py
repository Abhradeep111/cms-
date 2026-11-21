from typing import List, Optional

from fastapi import APIRouter, Depends, Query, status

from app.api.dependencies import get_current_admin_user
from app.modules.auth.models import User

from .schemas import (
    JobApplicationCreate,
    JobApplicationListResponse,
    JobApplicationResponse,
    JobApplicationStatusUpdate,
    JobOpeningCreate,
    JobOpeningListResponse,
    JobOpeningResponse,
    JobOpeningUpdate,
)
from .services import CareerService

admin_router = APIRouter(prefix="/admin/careers", tags=["Admin Careers"])
public_router = APIRouter(prefix="/public/careers", tags=["Public Careers"])


# ==================== JOBS (ADMIN) ====================


@admin_router.get("/jobs", response_model=JobOpeningListResponse)
async def list_admin_jobs(
    search: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    _current_user: User = Depends(get_current_admin_user),
):
    items, total, total_pages = await CareerService.list_admin_jobs(
        search=search, department=department, status=status, page=page, page_size=page_size
    )
    return JobOpeningListResponse(
        items=[CareerService.to_job_response(j) for j in items],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@admin_router.post("/jobs", response_model=JobOpeningResponse, status_code=status.HTTP_201_CREATED)
async def create_job(
    data: JobOpeningCreate,
    _current_user: User = Depends(get_current_admin_user),
):
    job = await CareerService.create_job(data)
    return CareerService.to_job_response(job)


@admin_router.get("/jobs/{job_id}", response_model=JobOpeningResponse)
async def get_job(
    job_id: str,
    _current_user: User = Depends(get_current_admin_user),
):
    job = await CareerService.get_job_by_id(job_id)
    return CareerService.to_job_response(job)


@admin_router.put("/jobs/{job_id}", response_model=JobOpeningResponse)
async def update_job(
    job_id: str,
    data: JobOpeningUpdate,
    _current_user: User = Depends(get_current_admin_user),
):
    job = await CareerService.update_job(job_id, data)
    return CareerService.to_job_response(job)


@admin_router.delete("/jobs/{job_id}", status_code=status.HTTP_200_OK)
async def delete_job(
    job_id: str,
    _current_user: User = Depends(get_current_admin_user),
):
    await CareerService.delete_job(job_id)
    return {"message": "Job opening deleted successfully"}


# ==================== APPLICATIONS (ADMIN) ====================


@admin_router.get("/applications", response_model=JobApplicationListResponse)
async def list_admin_applications(
    job_id: Optional[str] = Query(None),
    experience_group: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    _current_user: User = Depends(get_current_admin_user),
):
    items, total, total_pages = await CareerService.list_applications(
        job_id=job_id,
        experience_group=experience_group,
        status=status,
        search=search,
        page=page,
        page_size=page_size,
    )
    return JobApplicationListResponse(
        items=[CareerService.to_app_response(a) for a in items],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@admin_router.get("/applications/{app_id}", response_model=JobApplicationResponse)
async def get_application(
    app_id: str,
    _current_user: User = Depends(get_current_admin_user),
):
    app = await CareerService.get_application_by_id(app_id)
    return CareerService.to_app_response(app)


@admin_router.patch("/applications/{app_id}/status", response_model=JobApplicationResponse)
async def update_application_status(
    app_id: str,
    body: JobApplicationStatusUpdate,
    _current_user: User = Depends(get_current_admin_user),
):
    app = await CareerService.update_application_status(app_id, body.status)
    return CareerService.to_app_response(app)


@admin_router.delete("/applications/{app_id}", status_code=status.HTTP_200_OK)
async def delete_application(
    app_id: str,
    _current_user: User = Depends(get_current_admin_user),
):
    await CareerService.delete_application(app_id)
    return {"message": "Application deleted successfully"}


# ==================== PUBLIC ====================


@public_router.get("/jobs", response_model=List[JobOpeningResponse])
async def list_public_jobs():
    jobs = await CareerService.list_public_jobs()
    return [CareerService.to_job_response(j) for j in jobs]


@public_router.post("/apply", response_model=JobApplicationResponse, status_code=status.HTTP_201_CREATED)
async def apply_for_job(data: JobApplicationCreate):
    app = await CareerService.create_application(data)
    return CareerService.to_app_response(app)

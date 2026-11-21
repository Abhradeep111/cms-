from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class JobOpeningBase(BaseModel):
    title: str = Field(..., min_length=2)
    department: str = "Engineering"
    location: str = "Kolkata, India (Hybrid)"
    type: str = "Full-time"
    experience: str = "3+ years"
    summary: str = ""
    responsibilities: List[str] = Field(default_factory=list)
    requirements: List[str] = Field(default_factory=list)
    display_order: int = 0
    status: str = "published"  # published, draft, closed


class JobOpeningCreate(JobOpeningBase):
    pass


class JobOpeningUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    location: Optional[str] = None
    type: Optional[str] = None
    experience: Optional[str] = None
    summary: Optional[str] = None
    responsibilities: Optional[List[str]] = None
    requirements: Optional[List[str]] = None
    display_order: Optional[int] = None
    status: Optional[str] = None


class JobOpeningResponse(JobOpeningBase):
    id: str
    created_at: datetime
    updated_at: datetime


class JobOpeningListResponse(BaseModel):
    items: List[JobOpeningResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class JobApplicationCreate(BaseModel):
    job_id: Optional[str] = None
    job_title: str = "General Application"
    name: str = Field(..., min_length=2)
    email: str
    phone: str
    experience_range: Optional[str] = ""
    experience_years: Optional[float] = None
    portfolio_url: Optional[str] = None
    resume_url: Optional[str] = None
    cover_note: Optional[str] = None


class JobApplicationStatusUpdate(BaseModel):
    status: str  # pending, reviewed, shortlisted, rejected


class JobApplicationResponse(BaseModel):
    id: str
    job_id: Optional[str] = None
    job_title: str
    name: str
    email: str
    phone: str
    experience_range: str
    experience_years: float
    portfolio_url: Optional[str] = None
    resume_url: Optional[str] = None
    cover_note: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime


class JobApplicationListResponse(BaseModel):
    items: List[JobApplicationResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

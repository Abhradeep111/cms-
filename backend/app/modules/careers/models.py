from datetime import datetime, timezone
from typing import List, Optional

from beanie import Document
from pydantic import Field


class JobOpening(Document):
    title: str
    department: str = "Engineering"  # Engineering, Product & Design, Sales & Solutions, Operations
    location: str = "Kolkata, India (Hybrid)"
    type: str = "Full-time"  # Full-time, Part-time, Contract, Internship
    experience: str = "3+ years"
    summary: str = ""
    responsibilities: List[str] = Field(default_factory=list)
    requirements: List[str] = Field(default_factory=list)
    display_order: int = 0
    status: str = "published"  # published, draft, closed
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "job_openings"


class JobApplication(Document):
    job_id: Optional[str] = None
    job_title: str
    name: str
    email: str
    phone: str
    experience_range: str = ""  # e.g. "0", "1-2", "2-3", "3-4", "4-5", "5-10", "10-15", "15+"
    experience_years: float = 0.0  # Parsed numeric years for range filtering
    portfolio_url: Optional[str] = None
    resume_url: Optional[str] = None
    cover_note: Optional[str] = None
    status: str = "pending"  # pending, reviewed, shortlisted, rejected
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "job_applications"

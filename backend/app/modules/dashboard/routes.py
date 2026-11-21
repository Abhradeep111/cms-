from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_admin_user
from app.modules.auth.models import User
from app.modules.dashboard.schemas import DashboardStatsResponse
from app.modules.dashboard.services import DashboardService

router = APIRouter(prefix="/admin/dashboard", tags=["Admin Dashboard"])


@router.get("", response_model=DashboardStatsResponse)
async def get_dashboard_statistics(_current_user: User = Depends(get_current_admin_user)):
    return await DashboardService.get_stats()

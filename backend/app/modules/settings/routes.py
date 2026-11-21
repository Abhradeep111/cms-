from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_admin_user
from app.modules.auth.models import User
from app.modules.settings.schemas import (
    ContactSettings,
    FooterSettings,
    GeneralSettings,
    SettingResponse,
)
from app.modules.settings.services import SettingsService

admin_router = APIRouter(prefix="/admin", tags=["Admin Settings"])
public_router = APIRouter(prefix="/public", tags=["Public Settings"])


# Admin Settings
@admin_router.get("/settings", response_model=SettingResponse)
async def get_general_settings(_current_user: User = Depends(get_current_admin_user)):
    setting = await SettingsService.get_setting("general")
    return SettingResponse(
        setting_key=setting.setting_key, data=setting.data, updated_at=setting.updated_at
    )


@admin_router.put("/settings", response_model=SettingResponse)
async def update_general_settings(
    data: GeneralSettings,
    current_user: User = Depends(get_current_admin_user),
):
    setting = await SettingsService.update_setting("general", data.model_dump(), current_user.email)
    return SettingResponse(
        setting_key=setting.setting_key, data=setting.data, updated_at=setting.updated_at
    )


# Admin Contact
@admin_router.get("/contact", response_model=SettingResponse)
async def get_contact_settings(_current_user: User = Depends(get_current_admin_user)):
    setting = await SettingsService.get_setting("contact")
    return SettingResponse(
        setting_key=setting.setting_key, data=setting.data, updated_at=setting.updated_at
    )


@admin_router.put("/contact", response_model=SettingResponse)
async def update_contact_settings(
    data: ContactSettings,
    current_user: User = Depends(get_current_admin_user),
):
    setting = await SettingsService.update_setting("contact", data.model_dump(), current_user.email)
    return SettingResponse(
        setting_key=setting.setting_key, data=setting.data, updated_at=setting.updated_at
    )


# Admin Footer
@admin_router.get("/footer", response_model=SettingResponse)
async def get_footer_settings(_current_user: User = Depends(get_current_admin_user)):
    setting = await SettingsService.get_setting("footer")
    return SettingResponse(
        setting_key=setting.setting_key, data=setting.data, updated_at=setting.updated_at
    )


@admin_router.put("/footer", response_model=SettingResponse)
async def update_footer_settings(
    data: FooterSettings,
    current_user: User = Depends(get_current_admin_user),
):
    setting = await SettingsService.update_setting("footer", data.model_dump(), current_user.email)
    return SettingResponse(
        setting_key=setting.setting_key, data=setting.data, updated_at=setting.updated_at
    )


# Public Endpoints
@public_router.get("/settings")
async def get_public_settings():
    setting = await SettingsService.get_setting("general")
    return setting.data


@public_router.get("/contact")
async def get_public_contact():
    setting = await SettingsService.get_setting("contact")
    return setting.data


@public_router.get("/footer")
async def get_public_footer():
    setting = await SettingsService.get_setting("footer")
    return setting.data

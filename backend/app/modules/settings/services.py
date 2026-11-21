from datetime import datetime, timezone
from typing import Any, Dict, Optional

from app.modules.revisions.services import RevisionService
from app.modules.settings.models import SiteSetting
from app.modules.settings.schemas import ContactSettings, FooterSettings, GeneralSettings


class SettingsService:
    @staticmethod
    async def get_setting(key: str) -> SiteSetting:
        setting = await SiteSetting.find_one(SiteSetting.setting_key == key)
        if not setting:
            defaults = {
                "general": GeneralSettings().model_dump(),
                "contact": ContactSettings().model_dump(),
                "footer": FooterSettings().model_dump(),
            }
            setting = SiteSetting(
                setting_key=key,
                data=defaults.get(key, {}),
            )
            await setting.insert()
        return setting

    @staticmethod
    async def update_setting(
        key: str,
        data: Dict[str, Any],
        user_email: Optional[str] = None,
    ) -> SiteSetting:
        setting = await SettingsService.get_setting(key)
        setting.data.update(data)
        setting.updated_at = datetime.now(timezone.utc)
        await setting.save()

        await RevisionService.log_revision(
            entity_type="site_setting",
            entity_id=key,
            action="update",
            data_snapshot=setting.data,
            changed_by=user_email,
        )
        return setting

from typing import Any, Dict, Optional

from app.modules.revisions.models import ContentRevision


class RevisionService:
    @staticmethod
    async def log_revision(
        entity_type: str,
        entity_id: str,
        action: str,
        data_snapshot: Dict[str, Any],
        changed_by: Optional[str] = None,
    ) -> ContentRevision:
        revision = ContentRevision(
            entity_type=entity_type,
            entity_id=str(entity_id),
            action=action,
            data_snapshot=data_snapshot,
            changed_by=changed_by,
        )
        await revision.insert()
        return revision

    @staticmethod
    async def get_recent_revisions(limit: int = 10) -> list[ContentRevision]:
        return await ContentRevision.find().sort("-created_at").limit(limit).to_list()

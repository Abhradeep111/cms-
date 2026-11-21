from datetime import datetime, timezone
from typing import List, Optional

from app.core.exceptions import NotFoundException
from app.modules.navigation.models import NavigationItem
from app.modules.navigation.schemas import (
    NavigationItemCreate,
    NavigationItemResponse,
    NavigationItemUpdate,
)
from app.modules.revisions.services import RevisionService


class NavigationService:
    @staticmethod
    async def get_by_id(item_id: str) -> NavigationItem:
        item = await NavigationItem.get(item_id)
        if not item:
            raise NotFoundException("Navigation item", item_id)
        return item

    @staticmethod
    async def create_item(
        data: NavigationItemCreate, user_email: Optional[str] = None
    ) -> NavigationItem:
        item = NavigationItem(
            label=data.label,
            url=data.url,
            parent_id=data.parent_id,
            display_order=data.display_order,
            open_in_new_tab=data.open_in_new_tab,
            is_visible=data.is_visible,
        )
        await item.insert()

        await RevisionService.log_revision(
            entity_type="navigation_item",
            entity_id=str(item.id),
            action="create",
            data_snapshot=item.model_dump(),
            changed_by=user_email,
        )
        return item

    @staticmethod
    async def update_item(
        item_id: str,
        data: NavigationItemUpdate,
        user_email: Optional[str] = None,
    ) -> NavigationItem:
        item = await NavigationService.get_by_id(item_id)
        update_dict = data.model_dump(exclude_unset=True)
        for key, val in update_dict.items():
            setattr(item, key, val)

        item.updated_at = datetime.now(timezone.utc)
        await item.save()

        await RevisionService.log_revision(
            entity_type="navigation_item",
            entity_id=str(item.id),
            action="update",
            data_snapshot=item.model_dump(),
            changed_by=user_email,
        )
        return item

    @staticmethod
    async def delete_item(item_id: str, user_email: Optional[str] = None) -> bool:
        item = await NavigationService.get_by_id(item_id)
        # Also handle children if any by unparenting
        children = await NavigationItem.find(NavigationItem.parent_id == item_id).to_list()
        for child in children:
            child.parent_id = None
            await child.save()

        await RevisionService.log_revision(
            entity_type="navigation_item",
            entity_id=str(item.id),
            action="delete",
            data_snapshot=item.model_dump(),
            changed_by=user_email,
        )
        await item.delete()
        return True

    @staticmethod
    async def list_admin_items() -> List[NavigationItemResponse]:
        all_items = await NavigationItem.find().sort("display_order").to_list()
        # Build hierarchy tree
        return NavigationService._build_tree(all_items)

    @staticmethod
    async def list_public_items() -> List[NavigationItemResponse]:
        visible_items = (
            await NavigationItem.find(NavigationItem.is_visible == True)
            .sort("display_order")
            .to_list()
        )
        return NavigationService._build_tree(visible_items)

    @staticmethod
    def _build_tree(items: List[NavigationItem]) -> List[NavigationItemResponse]:
        id_map = {}
        for item in items:
            id_map[str(item.id)] = NavigationItemResponse(
                id=str(item.id),
                label=item.label,
                url=item.url,
                parent_id=item.parent_id,
                display_order=item.display_order,
                open_in_new_tab=item.open_in_new_tab,
                is_visible=item.is_visible,
                children=[],
                created_at=item.created_at,
                updated_at=item.updated_at,
            )

        roots = []
        for item in items:
            res_item = id_map[str(item.id)]
            if item.parent_id and item.parent_id in id_map:
                id_map[item.parent_id].children.append(res_item)
            else:
                roots.append(res_item)
        return roots

    @staticmethod
    def to_response(item: NavigationItem) -> NavigationItemResponse:
        return NavigationItemResponse(
            id=str(item.id),
            label=item.label,
            url=item.url,
            parent_id=item.parent_id,
            display_order=item.display_order,
            open_in_new_tab=item.open_in_new_tab,
            is_visible=item.is_visible,
            children=[],
            created_at=item.created_at,
            updated_at=item.updated_at,
        )

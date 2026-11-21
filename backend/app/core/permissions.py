from enum import Enum


class UserRole(str, Enum):
    SUPERADMIN = "superadmin"
    ADMIN = "admin"
    EDITOR = "editor"


def is_admin(role: str) -> bool:
    return role in [UserRole.SUPERADMIN.value, UserRole.ADMIN.value]

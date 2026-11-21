from datetime import datetime, timezone
from typing import Optional

from app.core.exceptions import BadRequestException, CredentialsException
from app.core.security import get_password_hash, verify_password
from app.modules.auth.models import User
from app.modules.auth.schemas import LoginRequest, UserResponse


class AuthService:
    @staticmethod
    async def get_by_email(email: str) -> Optional[User]:
        return await User.find_one(User.email == email.lower().strip())

    @staticmethod
    async def get_by_id(user_id: str) -> Optional[User]:
        return await User.get(user_id)

    @staticmethod
    async def authenticate(login_data: LoginRequest) -> User:
        user = await AuthService.get_by_email(login_data.email)
        if not user:
            raise CredentialsException("Invalid email or password")
        if not user.is_active:
            raise BadRequestException("User account is disabled")
        if not verify_password(login_data.password, user.hashed_password):
            raise CredentialsException("Invalid email or password")

        user.last_login = datetime.now(timezone.utc)
        await user.save()
        return user

    @staticmethod
    async def create_user(
        email: str,
        password: str,
        full_name: str = "Admin",
        role: str = "admin",
    ) -> User:
        existing = await AuthService.get_by_email(email)
        if existing:
            raise BadRequestException(f"User with email {email} already exists")

        user = User(
            email=email.lower().strip(),
            hashed_password=get_password_hash(password),
            full_name=full_name,
            role=role,
            is_active=True,
        )
        await user.insert()
        return user

    @staticmethod
    def to_user_response(user: User) -> UserResponse:
        return UserResponse(
            id=str(user.id),
            email=user.email,
            full_name=user.full_name,
            role=user.role,
            is_active=user.is_active,
            last_login=user.last_login,
            created_at=user.created_at,
            updated_at=user.updated_at,
        )

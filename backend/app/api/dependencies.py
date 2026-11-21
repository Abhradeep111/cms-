from typing import Optional

from fastapi import Cookie, Depends, Header, Request

from app.core.config import settings
from app.core.exceptions import CredentialsException, PermissionDeniedException
from app.core.permissions import is_admin
from app.core.security import decode_access_token
from app.modules.auth.models import User
from app.modules.auth.services import AuthService


async def get_token_from_request(
    request: Request,
    authorization: Optional[str] = Header(None),
    corpx_admin_token: Optional[str] = Cookie(None),
) -> str:
    """Extract token from Authorization header or HttpOnly cookie."""
    if authorization and authorization.startswith("Bearer "):
        return authorization.split(" ")[1]

    cookie_name = settings.COOKIE_NAME
    cookie_token = request.cookies.get(cookie_name) or corpx_admin_token
    if cookie_token:
        # Validate CSRF for cookie-based state-changing requests
        if request.method in ["POST", "PUT", "PATCH", "DELETE"]:
            # If CSRF cookie is present, ensure request header matches
            csrf_cookie = request.cookies.get(settings.CSRF_COOKIE_NAME)
            csrf_header = request.headers.get("X-CSRF-Token")
            if csrf_cookie and csrf_cookie != csrf_header:
                raise CredentialsException("Invalid CSRF token")
        return cookie_token

    raise CredentialsException("Authentication required")


async def get_current_user(
    token: str = Depends(get_token_from_request),
) -> User:
    """Validate token and return active user."""
    payload = decode_access_token(token)
    if not payload:
        raise CredentialsException("Invalid or expired token")

    user_id = payload.get("sub")
    if not user_id:
        raise CredentialsException("Token payload missing user identity")

    user = await AuthService.get_by_id(user_id)
    if not user:
        raise CredentialsException("User no longer exists")
    if not user.is_active:
        raise CredentialsException("User account is inactive")

    return user


async def get_current_admin_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Ensure user has admin permissions."""
    if not is_admin(current_user.role):
        raise PermissionDeniedException("Administrator role required")
    return current_user

import secrets

from fastapi import APIRouter, Depends, Response

from app.api.dependencies import get_current_user
from app.core.config import settings
from app.core.security import create_access_token
from app.modules.auth.models import User
from app.modules.auth.schemas import LoginRequest, TokenResponse, UserResponse
from app.modules.auth.services import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
async def login(login_data: LoginRequest, response: Response):
    user = await AuthService.authenticate(login_data)
    access_token = create_access_token(
        subject=str(user.id),
        claims={"email": user.email, "role": user.role},
    )

    # Set secure HttpOnly cookie for session
    response.set_cookie(
        key=settings.COOKIE_NAME,
        value=access_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )

    # Generate and set CSRF cookie
    csrf_token = secrets.token_hex(16)
    response.set_cookie(
        key=settings.CSRF_COOKIE_NAME,
        value=csrf_token,
        httponly=False,  # Client JS can read CSRF cookie to send in header
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=AuthService.to_user_response(user),
    )


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(settings.COOKIE_NAME, path="/")
    response.delete_cookie(settings.CSRF_COOKIE_NAME, path="/")
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return AuthService.to_user_response(current_user)

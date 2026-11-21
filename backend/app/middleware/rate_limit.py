from collections import defaultdict
from datetime import datetime, timezone
from typing import Dict, List

from fastapi import HTTPException, Request, status
from starlette.middleware.base import BaseHTTPMiddleware

# In-memory IP rate limiter for login
LOGIN_ATTEMPTS: Dict[str, List[float]] = defaultdict(list)
MAX_LOGIN_ATTEMPTS = 5
WINDOW_SECONDS = 60  # 5 attempts per minute


class LoginRateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path.endswith("/api/v1/auth/login") and request.method == "POST":
            client_ip = request.client.host if request.client else "unknown"
            now = datetime.now(timezone.utc).timestamp()

            # Clean old attempts
            recent = [t for t in LOGIN_ATTEMPTS[client_ip] if now - t < WINDOW_SECONDS]
            LOGIN_ATTEMPTS[client_ip] = recent

            if len(recent) >= MAX_LOGIN_ATTEMPTS:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Too many login attempts. Please wait 60 seconds before retrying.",
                )

            # Record attempt
            LOGIN_ATTEMPTS[client_ip].append(now)

        return await call_next(request)

from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    PROJECT_NAME: str = "CorpXcloud CMS API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DATABASE: str = "corpxcloud_cms"

    JWT_SECRET_KEY: str = "change-this-secret-to-a-very-secure-random-key-at-least-32-chars"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    FRONTEND_URL: str = "http://localhost:3000"
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3002",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

    MEDIA_ROOT: str = "uploads"
    COOKIE_SECURE: bool = False
    COOKIE_NAME: str = "corpx_admin_token"
    CSRF_COOKIE_NAME: str = "corpx_csrf_token"

    # Default admin credentials for initialization
    ADMIN_EMAIL: str = "admin@corpxcloud.com"
    ADMIN_PASSWORD: str = "Admin@CorpX2026!"


settings = Settings()

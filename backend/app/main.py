import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.router import api_router, platform_compat_router
from app.core.config import settings
from app.db.init_db import seed_initial_data
from app.db.mongodb import close_db, init_db
from app.middleware.rate_limit import LoginRateLimitMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("corpxcloud_cms")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to MongoDB and seed default admin/content
    if not getattr(app.state, "db_initialized", False):
        logger.info("Initializing database connection...")
        try:
            await init_db()
            await seed_initial_data()
            logger.info("Database initialized successfully.")
        except Exception as e:
            logger.warning(
                f"Database initialization warning (will retry on requests if DB offline): {e}"
            )

    yield

    # Shutdown: Close database connection
    if not getattr(app.state, "skip_db_close", False):
        logger.info("Closing database connection...")
        await close_db()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# Login Rate Limiting Middleware
app.add_middleware(LoginRateLimitMiddleware)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure Media Uploads directory exists and mount static handler
media_path = Path(settings.MEDIA_ROOT)
media_path.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.MEDIA_ROOT), name="uploads")

# Mount API Routers
app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(platform_compat_router)
app.include_router(platform_compat_router, prefix="/api")


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
    }

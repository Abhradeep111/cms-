import pytest
from httpx import ASGITransport, AsyncClient

from app.core.config import settings
from app.core.security import create_access_token
from app.db.init_db import seed_initial_data
from app.db.mongodb import close_db, init_db
from app.main import app
from app.modules.auth.services import AuthService


@pytest.fixture(autouse=True)
async def setup_test_db():
    app.state.db_initialized = True
    app.state.skip_db_close = True
    # Connect to local MongoDB with test database
    await init_db(
        mongodb_url="mongodb://127.0.0.1:27017",
        database_name="test_corpxcloud_cms",
    )
    await seed_initial_data()
    yield
    await close_db()


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
async def admin_token():
    admin = await AuthService.get_by_email(settings.ADMIN_EMAIL)
    assert admin is not None
    token = create_access_token(
        subject=str(admin.id),
        claims={"email": admin.email, "role": admin.role},
    )
    return token


@pytest.fixture
async def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}

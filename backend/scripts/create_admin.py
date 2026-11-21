import asyncio
import sys
from pathlib import Path

# Ensure backend root is on sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.core.config import settings
from app.db.mongodb import close_db, init_db
from app.modules.auth.services import AuthService


async def main():
    print("Connecting to MongoDB...")
    await init_db()

    email = sys.argv[1] if len(sys.argv) > 1 else settings.ADMIN_EMAIL
    password = sys.argv[2] if len(sys.argv) > 2 else settings.ADMIN_PASSWORD
    full_name = sys.argv[3] if len(sys.argv) > 3 else "Administrator"

    print(f"Creating administrator with email: {email}...")
    existing = await AuthService.get_by_email(email)
    if existing:
        print(f"Admin with email '{email}' already exists. Updating password...")
        from app.core.security import get_password_hash

        existing.hashed_password = get_password_hash(password)
        existing.full_name = full_name
        existing.is_active = True
        await existing.save()
        print("Admin password updated successfully.")
    else:
        user = await AuthService.create_user(
            email=email,
            password=password,
            full_name=full_name,
            role="superadmin",
        )
        print(f"Administrator successfully created with ID: {user.id}")

    await close_db()


if __name__ == "__main__":
    asyncio.run(main())

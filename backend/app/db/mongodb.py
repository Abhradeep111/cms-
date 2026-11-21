from typing import Optional

from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

# Ensure AsyncIOMotorDatabase exposes .client pointing to MongoClient for Beanie compatibility
AsyncIOMotorDatabase.client = property(lambda self: self.delegate.client)

from app.core.config import settings
from app.modules.auth.models import User
from app.modules.faqs.models import FAQ
from app.modules.homepage.models import HomepageSection
from app.modules.media.models import MediaAsset
from app.modules.navigation.models import NavigationItem
from app.modules.products.models import Product
from app.modules.revisions.models import ContentRevision
from app.modules.seo.models import SEOMetadata
from app.modules.services.models import Service
from app.modules.settings.models import SiteSetting
from app.modules.testimonials.models import Testimonial

client: Optional[AsyncIOMotorClient] = None

DOCUMENT_MODELS = [
    User,
    HomepageSection,
    Product,
    Service,
    Testimonial,
    FAQ,
    MediaAsset,
    NavigationItem,
    SiteSetting,
    SEOMetadata,
    ContentRevision,
]


async def init_db(
    mongodb_url: Optional[str] = None,
    database_name: Optional[str] = None,
    custom_client: Optional[AsyncIOMotorClient] = None,
):
    """Initialize MongoDB connection and Beanie ODM."""
    global client
    url = mongodb_url or settings.MONGODB_URL
    db_name = database_name or settings.MONGODB_DATABASE

    if custom_client:
        client = custom_client
    else:
        client = AsyncIOMotorClient(url)

    await init_beanie(
        database=client[db_name],
        document_models=DOCUMENT_MODELS,
    )


async def close_db():
    """Close MongoDB connection."""
    global client
    if client:
        client.close()
        client = None

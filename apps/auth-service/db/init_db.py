import asyncio
import logging

from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError, ProgrammingError

from db import models
from db.engine import Base, SessionLocal, engine
from db.models import RoleEnum, UserModel
from settings import ADMIN_PASSWORD, ADMIN_USERNAME
from utils.security import hash_password

logger = logging.getLogger(__name__)


def _is_concurrent_init_error(e: Exception) -> bool:
    text = str(getattr(e, "orig", e))
    return "pg_type_typname_nsp_index" in text or "already exists" in text


async def create_tables(max_attempts: int = 3) -> None:
    for attempt in range(1, max_attempts + 1):
        try:
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all, checkfirst=True)
            logger.info("Database tables are ready")
            return
        except (IntegrityError, ProgrammingError) as e:
            if not _is_concurrent_init_error(e) or attempt == max_attempts:
                logger.error(f"Error creating tables: {e}")
                raise
            logger.info("Concurrent table creation detected; retrying (%s)", attempt)
            await asyncio.sleep(1)


async def create_admin_user() -> None:
    async with SessionLocal() as db:
        users_count = await db.scalar(select(func.count(UserModel.id)))
        if users_count:
            logger.info("Admin user already exists")
            return

        if not ADMIN_PASSWORD:
            raise RuntimeError("ADMIN_PASSWORD must be set for first run")

        db.add(
            UserModel(
                username=ADMIN_USERNAME,
                password_hash=hash_password(ADMIN_PASSWORD),
                role=RoleEnum.admin.value,
            )
        )
        try:
            await db.commit()
            logger.info("Admin user created: %s", ADMIN_USERNAME)
        except IntegrityError:
            await db.rollback()
            logger.info("Admin user already exists (concurrent init handled)")


async def init_database() -> None:
    logger.info("Initializing database...")
    await create_tables()
    await create_admin_user()
    logger.info("Database initialization completed")
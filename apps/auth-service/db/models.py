from uuid import UUID, uuid4
from datetime import datetime
from enum import Enum
from typing import List, Optional
import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import DateTime

from .engine import Base


class RoleEnum(str, Enum):
    admin = "admin"


class UserModel(Base):
    __tablename__ = "users"

    username: Mapped[str] = mapped_column(
        sa.String(64), unique=True, nullable=False, index=True
    )
    password_hash: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    role: Mapped[str] = mapped_column(
        sa.String(20), default=RoleEnum.admin.value, nullable=False
    )
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=sa.func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=sa.func.now(),
        server_onupdate=sa.func.now(),
        nullable=False,
    )
    refresh_tokens: Mapped[List["RefreshTokenModel"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    id: Mapped[UUID] = mapped_column(
        sa.UUID(as_uuid=True), primary_key=True, default=uuid4
    )


class RefreshTokenModel(Base):
    __tablename__ = "refresh_tokens"

    jti: Mapped[str] = mapped_column(
        sa.String(64), unique=True, nullable=False, index=True
    )
    user_id: Mapped[UUID] = mapped_column(
        sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    revoked: Mapped[bool] = mapped_column(default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=sa.func.now(), nullable=False
    )
    user: Mapped["UserModel"] = relationship(back_populates="refresh_tokens")
    id: Mapped[UUID] = mapped_column(
        sa.UUID(as_uuid=True), primary_key=True, default=uuid4
    )
import logging
from datetime import datetime, timezone
from uuid import UUID

import sqlalchemy as sa
from sqlalchemy.ext.asyncio import AsyncSession

from db.models import UserModel, RefreshTokenModel
from schema._output import TokenOutput
from utils.jwt_manager import JWTManager, TokenError, ACCESS, REFRESH
from utils.security import hash_password, verify_password, DUMMY_HASH

logger = logging.getLogger(__name__)


class AuthError(Exception):
    """Authentication error (converts to 401)"""


class AuthService:
    def __init__(self, db_session: AsyncSession) -> None:
        self.db_session = db_session


    async def _get_user_by_username(self, username: str) -> UserModel | None:
        return await self.db_session.scalar(
            sa.select(UserModel).where(UserModel.username == username)
        )

    async def get_user_by_id(self, user_id: UUID) -> UserModel | None:
        return await self.db_session.scalar(
            sa.select(UserModel).where(UserModel.id == user_id)
        )

    async def _issue_tokens(self, user: UserModel) -> TokenOutput:
        access_token = JWTManager.create_access_token(
            user_id=user.id, username=user.username, role=user.role
        )
        refresh_token, jti, expires_at = JWTManager.create_refresh_token(user.id)

        self.db_session.add(
            RefreshTokenModel(jti=jti, user_id=user.id, expires_at=expires_at)
        )
        await self.db_session.commit()

        return TokenOutput(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=JWTManager.access_expires_in(),
        )

    async def _revoke_all_user_tokens(self, user_id: UUID) -> None:
        await self.db_session.execute(
            sa.update(RefreshTokenModel)
            .where(
                RefreshTokenModel.user_id == user_id,
                RefreshTokenModel.revoked.is_(False),
            )
            .values(revoked=True)
        )
        await self.db_session.commit()

    async def _purge_expired_tokens(self) -> None:
        await self.db_session.execute(
            sa.delete(RefreshTokenModel).where(
                RefreshTokenModel.expires_at < datetime.now(timezone.utc)
            )
        )
        await self.db_session.commit()


    async def login(self, username: str, password: str) -> TokenOutput:
        user = await self._get_user_by_username(username)

        if not user:
            verify_password(password, DUMMY_HASH)
            raise AuthError("Invalid credentials")
        if not verify_password(password, user.password_hash):
            raise AuthError("Invalid credentials")
        if not user.is_active:
            raise AuthError("Invalid credentials")

        await self._purge_expired_tokens()
        logger.info("User logged in: %s", user.username)
        return await self._issue_tokens(user)

    async def refresh(self, refresh_token: str) -> TokenOutput:
        try:
            payload = JWTManager.decode(refresh_token, REFRESH)
        except TokenError:
            raise AuthError("Invalid or expired refresh token")

        jti = payload["jti"]
        user_id = UUID(payload["sub"])

        stored = await self.db_session.scalar(
            sa.select(RefreshTokenModel).where(RefreshTokenModel.jti == jti)
        )
        if not stored:
            raise AuthError("Invalid or expired refresh token")

        if stored.revoked:
            logger.warning("Refresh token reuse detected for user %s", user_id)
            await self._revoke_all_user_tokens(user_id)
            raise AuthError("Invalid or expired refresh token")

        user = await self.get_user_by_id(user_id)
        if not user or not user.is_active:
            raise AuthError("Invalid or expired refresh token")

        stored.revoked = True
        await self.db_session.commit()
        return await self._issue_tokens(user)

    async def logout(self, refresh_token: str) -> None:
        try:
            payload = JWTManager.decode(refresh_token, REFRESH)
        except TokenError:
            return 

        await self.db_session.execute(
            sa.update(RefreshTokenModel)
            .where(RefreshTokenModel.jti == payload["jti"])
            .values(revoked=True)
        )
        await self.db_session.commit()

    async def authenticate_access_token(self, token: str) -> UserModel:
        try:
            payload = JWTManager.decode(token, ACCESS)
        except TokenError:
            raise AuthError("Invalid or expired access token")

        user = await self.get_user_by_id(UUID(payload["sub"]))
        if not user or not user.is_active:
            raise AuthError("Invalid or expired access token")
        return user

    async def change_password(
        self, user: UserModel, old_password: str, new_password: str
    ) -> None:
        if not verify_password(old_password, user.password_hash):
            raise ValueError("Current password is incorrect")
        if verify_password(new_password, user.password_hash):
            raise ValueError("New password must be different from the current one")

        user.password_hash = hash_password(new_password)
        await self.db_session.commit()
        await self._revoke_all_user_tokens(user.id)
        logger.info("Password changed for user %s", user.id)
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Tuple
from uuid import UUID, uuid4

import jwt

from settings import (
    JWT_SECRET_KEY,
    JWT_ALGORITHM,
    JWT_ISSUER,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_DAYS,
)

ACCESS = "access"
REFRESH = "refresh"


class TokenError(Exception):
    pass


class JWTManager:
    @staticmethod
    def _encode(payload: Dict[str, Any]) -> str:
        return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

    @staticmethod
    def create_access_token(user_id: UUID, username: str, role: str) -> str:
        now = datetime.now(timezone.utc)
        return JWTManager._encode(
            {
                "sub": str(user_id),
                "username": username,
                "role": role,
                "type": ACCESS,
                "iss": JWT_ISSUER,
                "iat": now,
                "exp": now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
                "jti": uuid4().hex,
            }
        )

    @staticmethod
    def create_refresh_token(user_id: UUID) -> Tuple[str, str, datetime]:
        now = datetime.now(timezone.utc)
        jti = uuid4().hex
        expires_at = now + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        token = JWTManager._encode(
            {
                "sub": str(user_id),
                "type": REFRESH,
                "iss": JWT_ISSUER,
                "iat": now,
                "exp": expires_at,
                "jti": jti,
            }
        )
        return token, jti, expires_at

    @staticmethod
    def decode(token: str, expected_type: str) -> Dict[str, Any]:
        try:
            payload = jwt.decode(
                token,
                JWT_SECRET_KEY,
                algorithms=[JWT_ALGORITHM],
                issuer=JWT_ISSUER,
                options={"require": ["exp", "iat", "sub", "jti", "type"]},
            )
        except jwt.PyJWTError as e:
            raise TokenError("Invalid or expired token") from e

        if payload.get("type") != expected_type:
            raise TokenError("Invalid token type")
        return payload

    @staticmethod
    def access_expires_in() -> int:
        return ACCESS_TOKEN_EXPIRE_MINUTES * 60
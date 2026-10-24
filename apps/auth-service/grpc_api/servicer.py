import functools
import logging
from datetime import datetime
from typing import Sequence

import grpc
from google.protobuf.timestamp_pb2 import Timestamp
from pydantic import ValidationError

from auth.v1 import auth_pb2, auth_pb2_grpc
from db.engine import SessionLocal
from db.models import RoleEnum, UserModel
from schema._input import LoginInput, ChangePasswordInput
from schema._output import TokenOutput
from services.auth import AuthService, AuthError
from settings import LOGIN_RATE_LIMIT, REFRESH_RATE_LIMIT
from utils.rate_limiter import RateLimitExceeded, limiter, parse_limits

logger = logging.getLogger(__name__)

LOGIN_LIMITS = parse_limits(LOGIN_RATE_LIMIT)
REFRESH_LIMITS = parse_limits(REFRESH_RATE_LIMIT)


def _ts(dt: datetime) -> Timestamp:
    ts = Timestamp()
    ts.FromDatetime(dt)
    return ts


def _first_validation_message(e: ValueError) -> str:
    if isinstance(e, ValidationError):
        msg = e.errors()[0]["msg"]
        return msg.removeprefix("Value error, ")
    return str(e)


def _client_ip(context: grpc.aio.ServicerContext) -> str:
    metadata = dict(context.invocation_metadata())
    forwarded = metadata.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()

    peer = context.peer() or "unknown"
    _, _, address = peer.partition(":")
    return address.rsplit(":", 1)[0] if ":" in address else address


def handle_errors(func):
    @functools.wraps(func)
    async def wrapper(self, request, context):
        try:
            return await func(self, request, context)
        except grpc.aio.AbortError:
            raise
        except RateLimitExceeded as e:
            await context.abort(grpc.StatusCode.RESOURCE_EXHAUSTED, str(e))
        except AuthError as e:
            await context.abort(grpc.StatusCode.UNAUTHENTICATED, str(e))
        except PermissionError as e:
            await context.abort(grpc.StatusCode.PERMISSION_DENIED, str(e))
        except ValueError as e:  # شامل pydantic.ValidationError
            await context.abort(
                grpc.StatusCode.INVALID_ARGUMENT, _first_validation_message(e)
            )
        except Exception:
            logger.exception("Unhandled error in %s", func.__name__)
            await context.abort(grpc.StatusCode.INTERNAL, "Internal server error")

    return wrapper


def _token_response(tokens: TokenOutput) -> auth_pb2.TokenResponse:
    return auth_pb2.TokenResponse(
        access_token=tokens.access_token,
        refresh_token=tokens.refresh_token,
        token_type=tokens.token_type,
        expires_in=tokens.expires_in,
    )


def _user_message(user: UserModel) -> auth_pb2.User:
    return auth_pb2.User(
        id=str(user.id),
        username=user.username,
        role=user.role,
        is_active=user.is_active,
        created_at=_ts(user.created_at),
        updated_at=_ts(user.updated_at),
    )


async def _current_user(
    service: AuthService,
    context: grpc.aio.ServicerContext,
    allowed_roles: Sequence[str] = (),
) -> UserModel:
    metadata = dict(context.invocation_metadata())
    scheme, _, token = metadata.get("authorization", "").partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise AuthError("Not authenticated")

    user = await service.authenticate_access_token(token)

    if allowed_roles and user.role not in allowed_roles:
        raise PermissionError(
            f"This action requires one of these roles: {', '.join(allowed_roles)}"
        )
    return user


class AuthServicer(auth_pb2_grpc.AuthServiceServicer):
    @handle_errors
    async def Login(self, request, context):
        await limiter.check("login", _client_ip(context), LOGIN_LIMITS)

        data = LoginInput(username=request.username, password=request.password)
        async with SessionLocal() as db:
            tokens = await AuthService(db).login(data.username, data.password)
        return _token_response(tokens)

    @handle_errors
    async def RefreshToken(self, request, context):
        await limiter.check("refresh", _client_ip(context), REFRESH_LIMITS)

        async with SessionLocal() as db:
            tokens = await AuthService(db).refresh(request.refresh_token)
        return _token_response(tokens)

    @handle_errors
    async def Logout(self, request, context):
        async with SessionLocal() as db:
            await AuthService(db).logout(request.refresh_token)
        return auth_pb2.LogoutResponse()

    @handle_errors
    async def GetMe(self, request, context):
        async with SessionLocal() as db:
            user = await _current_user(AuthService(db), context)
            return _user_message(user)

    @handle_errors
    async def VerifyToken(self, request, context):
        async with SessionLocal() as db:
            try:
                user = await AuthService(db).authenticate_access_token(
                    request.access_token
                )
            except AuthError:
                return auth_pb2.VerifyTokenResponse(valid=False)
        return auth_pb2.VerifyTokenResponse(
            valid=True,
            user_id=str(user.id),
            username=user.username,
            role=user.role,
        )

    @handle_errors
    async def ChangePassword(self, request, context):
        data = ChangePasswordInput(
            old_password=request.old_password, new_password=request.new_password
        )
        async with SessionLocal() as db:
            service = AuthService(db)
            user = await _current_user(service, context, (RoleEnum.admin.value,))
            await service.change_password(user, data.old_password, data.new_password)
        return auth_pb2.ChangePasswordResponse(
            message="Password changed successfully. Please login again."
        )
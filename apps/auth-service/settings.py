import os
from dotenv import load_dotenv

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv(
    "SQLALCHEMY_DATABASE_URL",
    "postgresql+asyncpg://admin:admin@postgres:5432/auth_db",
)

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_ISSUER = os.getenv("JWT_ISSUER", "auth-service")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "")

GRPC_HOST = os.getenv("GRPC_HOST", "0.0.0.0")
GRPC_PORT = int(os.getenv("GRPC_PORT", "50051"))

GRPC_REFLECTION = os.getenv("GRPC_REFLECTION", "false").lower() == "true"

REDIS_URL = os.getenv("REDIS_URL") or None
LOGIN_RATE_LIMIT = os.getenv("LOGIN_RATE_LIMIT", "5/minute;20/hour")
REFRESH_RATE_LIMIT = os.getenv("REFRESH_RATE_LIMIT", "10/minute;100/hour")

if len(JWT_SECRET_KEY) < 32:
    raise RuntimeError("JWT_SECRET_KEY must be set and at least 32 characters long")
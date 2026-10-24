import asyncio
import logging
import signal
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "gen"))

import grpc
from grpc_health.v1 import health, health_pb2, health_pb2_grpc
from grpc_reflection.v1alpha import reflection

from auth.v1 import auth_pb2, auth_pb2_grpc
from db.engine import engine 
from db.init_db import init_database
from grpc_api.servicer import AuthServicer 
from settings import GRPC_HOST, GRPC_PORT, GRPC_REFLECTION  
from utils.rate_limiter import limiter

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger("auth-service")

AUTH_SERVICE_NAME = auth_pb2.DESCRIPTOR.services_by_name["AuthService"].full_name


async def serve() -> None:
    await init_database()

    server = grpc.aio.server()
    auth_pb2_grpc.add_AuthServiceServicer_to_server(AuthServicer(), server)

    health_servicer = health.aio.HealthServicer()
    health_pb2_grpc.add_HealthServicer_to_server(health_servicer, server)

    if GRPC_REFLECTION:
        reflection.enable_server_reflection(
            (AUTH_SERVICE_NAME, reflection.SERVICE_NAME), server
        )

    server.add_insecure_port(f"{GRPC_HOST}:{GRPC_PORT}")
    await server.start()
    await health_servicer.set("", health_pb2.HealthCheckResponse.SERVING)
    await health_servicer.set(AUTH_SERVICE_NAME, health_pb2.HealthCheckResponse.SERVING)
    logger.info("Auth gRPC server listening on %s:%s", GRPC_HOST, GRPC_PORT)

    stop = asyncio.Event()
    loop = asyncio.get_running_loop()
    for sig in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(sig, stop.set)

    await stop.wait()
    logger.info("Shutting down...")
    await health_servicer.enter_graceful_shutdown()
    await server.stop(grace=5)
    await limiter.close()
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(serve())
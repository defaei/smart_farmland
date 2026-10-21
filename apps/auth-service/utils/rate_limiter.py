import logging
import time
from typing import Dict, Optional, Sequence, Tuple

from settings import REDIS_URL

logger = logging.getLogger(__name__)

Limit = Tuple[int, int]

_UNITS = {"second": 1, "minute": 60, "hour": 3600, "day": 86400}


def parse_limits(spec: str) -> Tuple[Limit, ...]:
    limits = []
    for part in spec.split(";"):
        part = part.strip()
        if not part:
            continue
        count, _, unit = part.partition("/")
        unit = unit.strip().lower().rstrip("s")
        if unit not in _UNITS:
            raise ValueError(f"Invalid rate limit spec: {part!r}")
        limits.append((int(count), _UNITS[unit]))
    if not limits:
        raise ValueError("Empty rate limit spec")
    return tuple(limits)


class RateLimitExceeded(Exception):
    pass


class RateLimiter:
    MEMORY_CLEANUP_THRESHOLD = 10_000
    REDIS_RETRY_AFTER_SECONDS = 30

    def __init__(self, redis_url: Optional[str] = None) -> None:
        self._memory: Dict[str, Tuple[int, float]] = {}
        self._redis = None
        self._redis_retry_at = 0.0

        if redis_url:
            try:
                from redis import asyncio as aioredis

                self._redis = aioredis.from_url(
                    redis_url, socket_connect_timeout=1, socket_timeout=1
                )
            except Exception as e:
                logger.warning(
                    "Failed to initialize Redis rate limiter: %s. Using in-memory fallback.",
                    e,
                )

    async def close(self) -> None:
        if self._redis is not None:
            await self._redis.aclose()

    async def _hit_redis(self, key: str, window: int) -> int:
        async with self._redis.pipeline(transaction=True) as pipe:
            pipe.set(key, 0, ex=window, nx=True)
            pipe.incr(key)
            results = await pipe.execute()
        return int(results[1])

    def _hit_memory(self, key: str, window: int) -> int:
        now = time.monotonic()
        count, reset_at = self._memory.get(key, (0, 0.0))
        if now >= reset_at:
            count, reset_at = 0, now + window
        count += 1
        self._memory[key] = (count, reset_at)

        if len(self._memory) > self.MEMORY_CLEANUP_THRESHOLD:
            self._memory = {k: v for k, v in self._memory.items() if v[1] > now}
        return count

    async def _hit(self, key: str, window: int) -> int:
        if self._redis is not None and time.monotonic() >= self._redis_retry_at:
            try:
                return await self._hit_redis(key, window)
            except Exception as e:
                self._redis_retry_at = time.monotonic() + self.REDIS_RETRY_AFTER_SECONDS
                logger.warning(
                    "Redis rate limiter unavailable (%s); using in-memory fallback for %ss",
                    e,
                    self.REDIS_RETRY_AFTER_SECONDS,
                )
        return self._hit_memory(key, window)

    async def check(
        self, scope: str, identifier: str, limits: Sequence[Limit]
    ) -> None:
        for max_requests, window in limits:
            count = await self._hit(f"rl:{scope}:{identifier}:{window}", window)
            if count > max_requests:
                raise RateLimitExceeded("Too many requests. Please try again later.")


limiter = RateLimiter(REDIS_URL)
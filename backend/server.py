"""Minimal API scaffold for the demo storefront.

The product, order, and admin services are not connected yet. Keep this API
limited to a non-sensitive health response until server-side authorization and
real business flows are implemented.
"""

import os

from fastapi import APIRouter, FastAPI
from starlette.middleware.cors import CORSMiddleware


DEFAULT_CORS_ORIGINS = "http://localhost:3000,http://127.0.0.1:3000"


def parse_allowed_origins(value: str) -> list[str]:
    """Parse an exact-origin allowlist and ignore wildcard/null entries."""
    origins: list[str] = []
    for candidate in value.split(","):
        origin = candidate.strip().rstrip("/")
        if not origin or origin.lower() in {"*", "null"}:
            continue
        if origin not in origins:
            origins.append(origin)
    return origins


allowed_origins = parse_allowed_origins(
    os.environ.get("CORS_ORIGINS", DEFAULT_CORS_ORIGINS)
)

app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)
api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root() -> dict[str, str]:
    return {"message": "Hello World"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["Accept", "Content-Type"],
    max_age=600,
)


@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers.setdefault("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'")
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
    response.headers.setdefault("Cache-Control", "no-store")
    return response

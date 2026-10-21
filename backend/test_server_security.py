"""Local security regression tests for the public API scaffold."""

import asyncio
import json
import unittest
from typing import Any

from backend.server import app, parse_allowed_origins


async def asgi_request(
    method: str = "GET",
    path: str = "/api/",
    headers: dict[str, str] | None = None,
) -> tuple[int, dict[str, str], bytes]:
    request_headers = [(b"host", b"testserver")]
    request_headers.extend(
        (name.lower().encode("latin-1"), value.encode("latin-1"))
        for name, value in (headers or {}).items()
    )
    messages: list[dict[str, Any]] = []
    request_sent = False

    async def receive() -> dict[str, Any]:
        nonlocal request_sent
        if request_sent:
            await asyncio.Future()
        request_sent = True
        return {"type": "http.request", "body": b"", "more_body": False}

    async def send(message: dict[str, Any]) -> None:
        messages.append(message)

    raw_path = path.encode("ascii")
    scope = {
        "type": "http",
        "asgi": {"version": "3.0", "spec_version": "2.3"},
        "http_version": "1.1",
        "method": method,
        "scheme": "http",
        "path": path,
        "raw_path": raw_path,
        "query_string": b"",
        "headers": request_headers,
        "client": ("127.0.0.1", 12345),
        "server": ("testserver", 80),
        "root_path": "",
    }
    await app(scope, receive, send)

    start = next(message for message in messages if message["type"] == "http.response.start")
    body = b"".join(
        message.get("body", b"")
        for message in messages
        if message["type"] == "http.response.body"
    )
    response_headers = {
        name.decode("latin-1").lower(): value.decode("latin-1")
        for name, value in start["headers"]
    }
    return start["status"], response_headers, body


class ServerSecurityTests(unittest.IsolatedAsyncioTestCase):
    def test_cors_configuration_ignores_wildcard_null_and_duplicates(self) -> None:
        self.assertEqual(
            parse_allowed_origins("https://shop.example, *, null, https://shop.example/"),
            ["https://shop.example"],
        )

    async def test_only_health_route_is_public(self) -> None:
        status, _, body = await asgi_request("GET", "/api/")
        self.assertEqual(status, 200)
        self.assertEqual(json.loads(body), {"message": "Hello World"})

        self.assertEqual((await asgi_request("GET", "/api/status"))[0], 404)
        self.assertEqual((await asgi_request("POST", "/api/status"))[0], 404)
        self.assertEqual((await asgi_request("GET", "/openapi.json"))[0], 404)

    async def test_cors_allows_local_frontend_without_credentials(self) -> None:
        status, headers, _ = await asgi_request(
            "OPTIONS",
            "/api/",
            {
                "origin": "http://localhost:3000",
                "access-control-request-method": "GET",
            },
        )
        self.assertEqual(status, 200)
        self.assertEqual(headers.get("access-control-allow-origin"), "http://localhost:3000")
        self.assertNotIn("access-control-allow-credentials", headers)

    async def test_cors_rejects_unlisted_origin(self) -> None:
        status, headers, _ = await asgi_request(
            "OPTIONS",
            "/api/",
            {
                "origin": "https://attacker.example",
                "access-control-request-method": "GET",
            },
        )
        self.assertEqual(status, 400)
        self.assertNotIn("access-control-allow-origin", headers)

    async def test_api_responses_include_security_headers(self) -> None:
        status, headers, _ = await asgi_request("GET", "/api/")
        self.assertEqual(status, 200)
        self.assertEqual(headers.get("content-security-policy"), "default-src 'none'; frame-ancestors 'none'")
        self.assertEqual(headers.get("x-content-type-options"), "nosniff")
        self.assertEqual(headers.get("x-frame-options"), "DENY")
        self.assertEqual(headers.get("referrer-policy"), "strict-origin-when-cross-origin")
        self.assertEqual(headers.get("permissions-policy"), "camera=(), microphone=(), geolocation=()")
        self.assertEqual(headers.get("cache-control"), "no-store")


if __name__ == "__main__":
    unittest.main()

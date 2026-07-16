import base64
import hashlib
import hmac
import json
from datetime import UTC, datetime, timedelta

from src.domain.entities.identity import AccessTokenClaims, User
from src.domain.services.token_service import TokenService


class InvalidTokenError(Exception):
    """Raised when a token cannot be verified."""


class JwtTokenService(TokenService):
    def __init__(
        self,
        secret_key: str,
        issuer: str,
        access_token_ttl_minutes: int,
        refresh_token_ttl_minutes: int,
    ) -> None:
        self._secret_key = secret_key.encode("utf-8")
        self._issuer = issuer
        self._access_token_ttl_minutes = access_token_ttl_minutes
        self._refresh_token_ttl_minutes = refresh_token_ttl_minutes

    def create_access_token(self, user: User) -> str:
        now = datetime.now(UTC)
        payload = {
            "sub": str(user.id),
            "email": user.email,
            "permissions": sorted(user.permissions),
            "iat": int(now.timestamp()),
            "exp": int((now + timedelta(minutes=self._access_token_ttl_minutes)).timestamp()),
            "iss": self._issuer,
            "typ": "access",
        }
        return self._encode(payload)

    def create_refresh_token(self, user: User, session_id: str) -> str:
        now = datetime.now(UTC)
        payload = {
            "sub": str(user.id),
            "session_id": session_id,
            "iat": int(now.timestamp()),
            "exp": int((now + timedelta(minutes=self._refresh_token_ttl_minutes)).timestamp()),
            "iss": self._issuer,
            "typ": "refresh",
        }
        return self._encode(payload)

    def decode_access_token(self, token: str) -> AccessTokenClaims:
        payload = self._decode(token)
        token_type = payload.get("typ")
        if token_type != "access":
            raise InvalidTokenError("Token type is not access.")

        return AccessTokenClaims(
            subject=str(payload["sub"]),
            email=str(payload["email"]),
            permissions=tuple(str(permission) for permission in payload["permissions"]),
            issued_at=int(payload["iat"]),
            expires_at=int(payload["exp"]),
            issuer=str(payload["iss"]),
        )

    def _encode(self, payload: dict[str, object]) -> str:
        header = {"alg": "HS256", "typ": "JWT"}
        encoded_header = self._urlsafe_b64encode(json.dumps(header, separators=(",", ":")).encode())
        encoded_payload = self._urlsafe_b64encode(
            json.dumps(payload, separators=(",", ":")).encode()
        )
        signing_input = f"{encoded_header}.{encoded_payload}".encode("utf-8")
        signature = hmac.new(self._secret_key, signing_input, hashlib.sha256).digest()
        encoded_signature = self._urlsafe_b64encode(signature)
        return f"{encoded_header}.{encoded_payload}.{encoded_signature}"

    def _decode(self, token: str) -> dict[str, object]:
        try:
            encoded_header, encoded_payload, encoded_signature = token.split(".")
        except ValueError as error:
            raise InvalidTokenError("Token structure is invalid.") from error

        signing_input = f"{encoded_header}.{encoded_payload}".encode("utf-8")
        expected_signature = hmac.new(self._secret_key, signing_input, hashlib.sha256).digest()
        signature = self._urlsafe_b64decode(encoded_signature)
        if not hmac.compare_digest(signature, expected_signature):
            raise InvalidTokenError("Token signature is invalid.")

        payload_bytes = self._urlsafe_b64decode(encoded_payload)
        payload = json.loads(payload_bytes.decode("utf-8"))
        if payload.get("iss") != self._issuer:
            raise InvalidTokenError("Token issuer is invalid.")

        if int(payload.get("exp", 0)) < int(datetime.now(UTC).timestamp()):
            raise InvalidTokenError("Token is expired.")

        return payload

    @staticmethod
    def _urlsafe_b64encode(data: bytes) -> str:
        return base64.urlsafe_b64encode(data).rstrip(b"=").decode("utf-8")

    @staticmethod
    def _urlsafe_b64decode(data: str) -> bytes:
        padding = "=" * (-len(data) % 4)
        return base64.urlsafe_b64decode(f"{data}{padding}".encode("utf-8"))


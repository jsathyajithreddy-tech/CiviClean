from abc import ABC, abstractmethod

from src.domain.entities.identity import AccessTokenClaims, User


class TokenService(ABC):
    @abstractmethod
    def create_access_token(self, user: User) -> str:
        """Create a signed access token."""

    @abstractmethod
    def create_refresh_token(self, user: User, session_id: str) -> str:
        """Create a signed refresh token."""

    @abstractmethod
    def decode_access_token(self, token: str) -> AccessTokenClaims:
        """Decode and validate an access token."""


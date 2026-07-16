from abc import ABC, abstractmethod


class PasswordHasher(ABC):
    @abstractmethod
    def hash_password(self, password: str) -> str:
        """Hash a password."""

    @abstractmethod
    def verify_password(self, password: str, password_hash: str) -> bool:
        """Verify a password against a hash."""


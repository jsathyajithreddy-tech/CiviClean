from abc import ABC, abstractmethod

from src.domain.entities.identity import User


class UserRepository(ABC):
    @abstractmethod
    async def get_by_email(self, email: str) -> User | None:
        """Return a user by email if it exists."""

    @abstractmethod
    async def get_by_id(self, user_id: str) -> User | None:
        """Return a user by id if it exists."""

    @abstractmethod
    async def list_users(self) -> list[User]:
        """Return all users visible to the caller context."""


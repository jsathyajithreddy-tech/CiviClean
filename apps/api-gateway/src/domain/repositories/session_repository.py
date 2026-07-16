from abc import ABC, abstractmethod

from src.domain.entities.identity import UserSession


class SessionRepository(ABC):
    @abstractmethod
    async def create(self, session: UserSession) -> None:
        """Persist a new user session."""

    @abstractmethod
    async def get_by_id(self, session_id: str) -> UserSession | None:
        """Return a session by id if it exists."""


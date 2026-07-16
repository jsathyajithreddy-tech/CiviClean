from src.domain.entities.identity import UserSession
from src.domain.repositories.session_repository import SessionRepository


class InMemorySessionRepository(SessionRepository):
    def __init__(self) -> None:
        self._sessions: dict[str, UserSession] = {}

    async def create(self, session: UserSession) -> None:
        self._sessions[str(session.id)] = session

    async def get_by_id(self, session_id: str) -> UserSession | None:
        return self._sessions.get(session_id)


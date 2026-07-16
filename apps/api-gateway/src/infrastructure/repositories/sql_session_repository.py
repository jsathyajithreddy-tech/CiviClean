from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from src.domain.entities.identity import UserSession
from src.domain.repositories.session_repository import SessionRepository
from src.infrastructure.db.models import UserSessionModel


class SqlSessionRepository(SessionRepository):
    def __init__(self, session_factory: async_sessionmaker[AsyncSession]) -> None:
        self._session_factory = session_factory

    async def create(self, session: UserSession) -> None:
        async with self._session_factory() as db_session:
            db_session.add(
                UserSessionModel(
                    id=str(session.id),
                    user_id=str(session.user_id),
                    refresh_token_hash=session.refresh_token_hash,
                    expires_at=session.expires_at,
                    created_at=session.created_at,
                )
            )
            await db_session.commit()

    async def get_by_id(self, session_id: str) -> UserSession | None:
        async with self._session_factory() as db_session:
            model = await db_session.get(UserSessionModel, session_id)
            if model is None:
                return None

            return UserSession(
                id=UUID(model.id),
                user_id=UUID(model.user_id),
                refresh_token_hash=model.refresh_token_hash,
                expires_at=model.expires_at,
                created_at=model.created_at,
            )

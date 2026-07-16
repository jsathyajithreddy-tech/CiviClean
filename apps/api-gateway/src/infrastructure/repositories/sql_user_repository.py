from collections.abc import Iterable
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
from sqlalchemy.orm import selectinload

from src.domain.entities.identity import Role, User, UserStatus
from src.domain.repositories.user_repository import UserRepository
from src.infrastructure.db.models import RoleModel, UserModel, UserRoleModel

ROLE_PERMISSIONS: dict[str, frozenset[str]] = {
    "super_admin": frozenset(
        {
            "users:read",
            "users:write",
            "agents:read",
            "agents:write",
            "dashboard:read",
        }
    ),
    "operator": frozenset({"dashboard:read"}),
}


def _to_domain_role(model: RoleModel) -> Role:
    return Role(
        name=model.name,
        permissions=ROLE_PERMISSIONS.get(model.name, frozenset()),
    )


def _to_domain_user(model: UserModel) -> User:
    return User(
        id=UUID(model.id),
        email=model.email,
        full_name=model.full_name,
        password_hash=model.password_hash,
        status=UserStatus(model.status),
        roles=tuple(_to_domain_role(user_role.role) for user_role in model.roles),
        created_at=model.created_at,
        updated_at=model.updated_at,
    )


class SqlUserRepository(UserRepository):
    def __init__(self, session_factory: async_sessionmaker[AsyncSession]) -> None:
        self._session_factory = session_factory

    async def get_by_email(self, email: str) -> User | None:
        async with self._session_factory() as session:
            statement = (
                select(UserModel)
                .where(UserModel.email == email.lower())
                .options(selectinload(UserModel.roles).selectinload(UserRoleModel.role))
            )
            result = await session.execute(statement)
            user = result.scalar_one_or_none()
            return None if user is None else _to_domain_user(user)

    async def get_by_id(self, user_id: str) -> User | None:
        async with self._session_factory() as session:
            statement = (
                select(UserModel)
                .where(UserModel.id == user_id)
                .options(selectinload(UserModel.roles).selectinload(UserRoleModel.role))
            )
            result = await session.execute(statement)
            user = result.scalar_one_or_none()
            return None if user is None else _to_domain_user(user)

    async def list_users(self) -> list[User]:
        async with self._session_factory() as session:
            statement = select(UserModel).options(
                selectinload(UserModel.roles).selectinload(UserRoleModel.role)
            )
            result = await session.execute(statement)
            users = result.scalars().all()
            return _to_domain_users(users)


def _to_domain_users(models: Iterable[UserModel]) -> list[User]:
    return [_to_domain_user(model) for model in models]

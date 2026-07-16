from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, AsyncEngine, async_sessionmaker

from src.infrastructure.db.base import Base
from src.infrastructure.db.models import RoleModel, UserModel, UserRoleModel
from src.infrastructure.repositories.sql_user_repository import ROLE_PERMISSIONS

ADMIN_USER_ID = "12be3bda-f5db-4a89-9c2e-6124278b563f"
OPERATOR_USER_ID = "d1d9d8fe-dbd8-4ef3-a7af-7d1262b72d00"


class DatabaseInitializer:
    def __init__(
        self,
        engine: AsyncEngine,
        session_factory: async_sessionmaker[AsyncSession],
        admin_password_hash: str,
        operator_password_hash: str,
    ) -> None:
        self._engine = engine
        self._session_factory = session_factory
        self._admin_password_hash = admin_password_hash
        self._operator_password_hash = operator_password_hash

    async def initialize(self) -> None:
        async with self._engine.begin() as connection:
            await connection.run_sync(Base.metadata.create_all)

        async with self._session_factory() as session:
            await self._seed_roles(session)
            await self._seed_users(session)
            await session.commit()

    async def _seed_roles(self, session: AsyncSession) -> None:
        existing_roles = await session.execute(select(RoleModel))
        by_name = {role.name: role for role in existing_roles.scalars().all()}

        for role_name, permissions in ROLE_PERMISSIONS.items():
            if role_name in by_name:
                continue

            session.add(
                RoleModel(
                    name=role_name,
                    description=f"Seeded role with permissions: {', '.join(sorted(permissions))}",
                )
            )

    async def _seed_users(self, session: AsyncSession) -> None:
        roles_result = await session.execute(select(RoleModel))
        roles_by_name = {role.name: role for role in roles_result.scalars().all()}

        await self._upsert_user(
            session=session,
            user_id=ADMIN_USER_ID,
            email="admin@smartcity.example.com",
            full_name="City Administrator",
            password_hash=self._admin_password_hash,
        )
        await self._upsert_user(
            session=session,
            user_id=OPERATOR_USER_ID,
            email="operator@smartcity.example.com",
            full_name="Operations Center Operator",
            password_hash=self._operator_password_hash,
        )

        for user_id, role_name in (
            (ADMIN_USER_ID, "super_admin"),
            (OPERATOR_USER_ID, "operator"),
        ):
            user_role = await session.get(
                UserRoleModel,
                {"user_id": user_id, "role_id": roles_by_name[role_name].id},
            )
            if user_role is None:
                session.add(
                    UserRoleModel(
                        user_id=user_id,
                        role_id=roles_by_name[role_name].id,
                    )
                )

    async def _upsert_user(
        self,
        session: AsyncSession,
        user_id: str,
        email: str,
        full_name: str,
        password_hash: str,
    ) -> None:
        user = await session.get(UserModel, user_id)
        now = datetime.now(UTC)
        if user is None:
            session.add(
                UserModel(
                    id=user_id,
                    email=email,
                    full_name=full_name,
                    password_hash=password_hash,
                    status="active",
                    created_at=now,
                    updated_at=now,
                )
            )
            return

        changed = False
        if user.email != email:
            user.email = email
            changed = True
        if user.full_name != full_name:
            user.full_name = full_name
            changed = True
        if user.password_hash != password_hash:
            user.password_hash = password_hash
            changed = True
        if user.status != "active":
            user.status = "active"
            changed = True
        if changed:
            user.updated_at = now

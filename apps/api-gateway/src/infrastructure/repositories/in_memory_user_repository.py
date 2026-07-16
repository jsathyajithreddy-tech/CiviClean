from datetime import UTC, datetime
from uuid import UUID

from src.domain.entities.identity import Role, User, UserStatus
from src.domain.repositories.user_repository import UserRepository


class InMemoryUserRepository(UserRepository):
    def __init__(self, admin_password_hash: str, operator_password_hash: str) -> None:
        now = datetime.now(UTC)
        self._users = [
            User(
                id=UUID("12be3bda-f5db-4a89-9c2e-6124278b563f"),
                email="admin@smartcity.example.com",
                full_name="City Administrator",
                password_hash=admin_password_hash,
                status=UserStatus.ACTIVE,
                roles=(
                    Role(
                        name="super_admin",
                        permissions=frozenset(
                            {
                                "users:read",
                                "users:write",
                                "agents:read",
                                "agents:write",
                                "dashboard:read",
                            }
                        ),
                    ),
                ),
                created_at=now,
                updated_at=now,
            ),
            User(
                id=UUID("d1d9d8fe-dbd8-4ef3-a7af-7d1262b72d00"),
                email="operator@smartcity.example.com",
                full_name="Operations Center Operator",
                password_hash=operator_password_hash,
                status=UserStatus.ACTIVE,
                roles=(
                    Role(
                        name="operator",
                        permissions=frozenset({"dashboard:read"}),
                    ),
                ),
                created_at=now,
                updated_at=now,
            ),
        ]

    async def get_by_email(self, email: str) -> User | None:
        for user in self._users:
            if user.email.lower() == email.lower():
                return user
        return None

    async def get_by_id(self, user_id: str) -> User | None:
        for user in self._users:
            if str(user.id) == user_id:
                return user
        return None

    async def list_users(self) -> list[User]:
        return list(self._users)

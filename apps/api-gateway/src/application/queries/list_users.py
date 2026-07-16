from src.application.dto.identity_dto import UserDto
from src.domain.repositories.user_repository import UserRepository


class ListUsersQuery:
    def __init__(self, user_repository: UserRepository) -> None:
        self._user_repository = user_repository

    async def execute(self) -> list[UserDto]:
        users = await self._user_repository.list_users()
        return [
            UserDto(
                id=str(user.id),
                email=user.email,
                full_name=user.full_name,
                status=user.status.value,
                roles=[role.name for role in user.roles],
                permissions=sorted(user.permissions),
                created_at=user.created_at,
                updated_at=user.updated_at,
            )
            for user in users
        ]


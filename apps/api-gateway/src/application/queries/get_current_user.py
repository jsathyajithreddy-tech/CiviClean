from src.application.dto.identity_dto import UserDto
from src.domain.entities.identity import AccessTokenClaims
from src.domain.repositories.user_repository import UserRepository


class CurrentUserNotFoundError(Exception):
    """Raised when the token subject no longer maps to a user."""


class GetCurrentUserQuery:
    def __init__(self, user_repository: UserRepository) -> None:
        self._user_repository = user_repository

    async def execute(self, claims: AccessTokenClaims) -> UserDto:
        user = await self._user_repository.get_by_id(claims.subject)
        if user is None:
            raise CurrentUserNotFoundError("The authenticated user could not be found.")

        return UserDto(
            id=str(user.id),
            email=user.email,
            full_name=user.full_name,
            status=user.status.value,
            roles=[role.name for role in user.roles],
            permissions=sorted(user.permissions),
            created_at=user.created_at,
            updated_at=user.updated_at,
        )


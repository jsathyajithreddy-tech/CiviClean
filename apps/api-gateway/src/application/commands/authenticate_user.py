from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from uuid import uuid4

from src.application.dto.identity_dto import LoginResponseDto, UserDto
from src.domain.entities.identity import UserSession, UserStatus
from src.domain.repositories.session_repository import SessionRepository
from src.domain.repositories.user_repository import UserRepository
from src.domain.services.password_hasher import PasswordHasher
from src.domain.services.token_service import TokenService


@dataclass(frozen=True, slots=True)
class AuthenticateUserCommandInput:
    email: str
    password: str


class InvalidCredentialsError(Exception):
    """Raised when credentials are invalid."""


class AuthenticateUserCommand:
    def __init__(
        self,
        user_repository: UserRepository,
        session_repository: SessionRepository,
        password_hasher: PasswordHasher,
        token_service: TokenService,
        refresh_token_ttl_minutes: int,
        access_token_ttl_minutes: int,
    ) -> None:
        self._user_repository = user_repository
        self._session_repository = session_repository
        self._password_hasher = password_hasher
        self._token_service = token_service
        self._refresh_token_ttl_minutes = refresh_token_ttl_minutes
        self._access_token_ttl_minutes = access_token_ttl_minutes

    async def execute(self, payload: AuthenticateUserCommandInput) -> LoginResponseDto:
        user = await self._user_repository.get_by_email(payload.email.lower())
        if user is None or user.status is not UserStatus.ACTIVE:
            raise InvalidCredentialsError("Invalid email or password.")

        if not self._password_hasher.verify_password(payload.password, user.password_hash):
            raise InvalidCredentialsError("Invalid email or password.")

        now = datetime.now(UTC)
        session_uuid = uuid4()
        session_id = str(session_uuid)
        refresh_token = self._token_service.create_refresh_token(user=user, session_id=session_id)
        refresh_token_hash = self._password_hasher.hash_password(refresh_token)
        session = UserSession(
            id=session_uuid,
            user_id=user.id,
            refresh_token_hash=refresh_token_hash,
            expires_at=now + timedelta(minutes=self._refresh_token_ttl_minutes),
            created_at=now,
        )
        await self._session_repository.create(session)

        access_token = self._token_service.create_access_token(user)
        return LoginResponseDto(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in_seconds=self._access_token_ttl_minutes * 60,
            user=UserDto(
                id=str(user.id),
                email=user.email,
                full_name=user.full_name,
                status=user.status.value,
                roles=[role.name for role in user.roles],
                permissions=sorted(user.permissions),
                created_at=user.created_at,
                updated_at=user.updated_at,
            ),
        )

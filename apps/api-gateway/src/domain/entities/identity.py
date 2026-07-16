from dataclasses import dataclass
from datetime import datetime
from enum import StrEnum
from uuid import UUID


class UserStatus(StrEnum):
    ACTIVE = "active"
    INACTIVE = "inactive"


@dataclass(frozen=True, slots=True)
class Role:
    name: str
    permissions: frozenset[str]


@dataclass(frozen=True, slots=True)
class User:
    id: UUID
    email: str
    full_name: str
    password_hash: str
    status: UserStatus
    roles: tuple[Role, ...]
    created_at: datetime
    updated_at: datetime

    @property
    def permissions(self) -> frozenset[str]:
        flattened_permissions = {
            permission for role in self.roles for permission in role.permissions
        }
        return frozenset(flattened_permissions)

    def has_permission(self, permission: str) -> bool:
        return permission in self.permissions


@dataclass(frozen=True, slots=True)
class UserSession:
    id: UUID
    user_id: UUID
    refresh_token_hash: str
    expires_at: datetime
    created_at: datetime


@dataclass(frozen=True, slots=True)
class AccessTokenClaims:
    subject: str
    email: str
    permissions: tuple[str, ...]
    issued_at: int
    expires_at: int
    issuer: str


from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class UserDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    email: EmailStr
    full_name: str
    status: str
    roles: list[str]
    permissions: list[str]
    created_at: datetime
    updated_at: datetime


class LoginResponseDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in_seconds: int
    user: UserDto


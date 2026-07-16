from datetime import datetime
from typing import Generic, TypeVar
from uuid import UUID, uuid4

from pydantic import BaseModel, ConfigDict, Field

T = TypeVar("T")


class ResponseMeta(BaseModel):
    model_config = ConfigDict(extra="forbid")

    request_id: UUID = Field(default_factory=uuid4)
    timestamp: datetime
    version: str = "v1"


class ErrorEnvelope(BaseModel):
    model_config = ConfigDict(extra="forbid")

    code: str
    message: str


class ApiResponse(BaseModel, Generic[T]):
    model_config = ConfigDict(extra="forbid")

    data: T
    meta: ResponseMeta
    error: ErrorEnvelope | None = None


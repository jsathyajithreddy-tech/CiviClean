from dataclasses import dataclass

from src.application.dto.operations_dto import CommandExecutionResultDto
from src.domain.repositories.operations_repository import OperationsRepository


@dataclass(frozen=True, slots=True)
class ExecuteCommandActionInput:
    incident_id: str
    command: str


class ExecuteCommandAction:
    def __init__(self, repository: OperationsRepository) -> None:
        self._repository = repository

    async def execute(self, payload: ExecuteCommandActionInput) -> CommandExecutionResultDto:
        result = await self._repository.execute_command(
            incident_id=payload.incident_id,
            command=payload.command,
        )
        return CommandExecutionResultDto(
            command=result.command,
            incident_id=result.incident_id,
            status=result.status,
            outcome=result.outcome,
            updated_at=result.updated_at,
        )

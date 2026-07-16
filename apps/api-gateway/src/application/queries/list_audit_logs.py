from src.application.dto.operations_dto import AuditLogEntryDto
from src.domain.repositories.operations_repository import OperationsRepository


class ListAuditLogsQuery:
    def __init__(self, repository: OperationsRepository) -> None:
        self._repository = repository

    async def execute(self) -> list[AuditLogEntryDto]:
        items = await self._repository.list_audit_logs()
        return [
            AuditLogEntryDto(
                id=item.id,
                timestamp=item.timestamp,
                agent=item.agent,
                decision=item.decision,
                reason=item.reason,
                outcome=item.outcome,
                operator=item.operator,
                status=item.status,
            )
            for item in items
        ]

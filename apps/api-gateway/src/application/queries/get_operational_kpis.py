from src.application.dto.operations_dto import OperationalKpiDto
from src.domain.repositories.operations_repository import OperationsRepository


class GetOperationalKpisQuery:
    def __init__(self, repository: OperationsRepository) -> None:
        self._repository = repository

    async def execute(self) -> list[OperationalKpiDto]:
        items = await self._repository.get_operational_kpis()
        return [
            OperationalKpiDto(
                key=item.key,
                label=item.label,
                value=item.value,
                trend=item.trend,
                status=item.status,
            )
            for item in items
        ]

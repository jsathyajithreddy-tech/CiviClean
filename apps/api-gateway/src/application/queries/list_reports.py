from src.application.dto.operations_dto import ReportDefinitionDto
from src.domain.repositories.operations_repository import OperationsRepository


class ListReportsQuery:
    def __init__(self, repository: OperationsRepository) -> None:
        self._repository = repository

    async def execute(self) -> list[ReportDefinitionDto]:
        reports = await self._repository.list_reports()
        return [
            ReportDefinitionDto(
                id=report.id,
                title=report.title,
                category=report.category,
                cadence=report.cadence,
                formats=report.formats,
                description=report.description,
            )
            for report in reports
        ]

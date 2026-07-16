from src.application.dto.operations_dto import MissionTimelineEntryDto
from src.domain.repositories.operations_repository import OperationsRepository


class ListTimelineQuery:
    def __init__(self, repository: OperationsRepository) -> None:
        self._repository = repository

    async def execute(self) -> list[MissionTimelineEntryDto]:
        timeline = await self._repository.list_timeline()
        return [
            MissionTimelineEntryDto(
                id=item.id,
                timestamp=item.timestamp,
                agent=item.agent,
                title=item.title,
                detail=item.detail,
                status=item.status,
            )
            for item in timeline
        ]

from src.application.dto.operations_dto import CityBrainBriefingDto
from src.domain.repositories.operations_repository import OperationsRepository


class GetCityBrainBriefingQuery:
    def __init__(self, repository: OperationsRepository) -> None:
        self._repository = repository

    async def execute(self) -> CityBrainBriefingDto:
        briefing = await self._repository.get_city_brain_briefing()
        return CityBrainBriefingDto(
            generated_at=briefing.generated_at,
            headline=briefing.headline,
            executive_summary=briefing.executive_summary,
            risk_score=briefing.risk_score,
            confidence_score=briefing.confidence_score,
            predicted_window_minutes=briefing.predicted_window_minutes,
            correlated_domains=briefing.correlated_domains,
            recommendations=briefing.recommendations,
            reasoning=briefing.reasoning,
            autonomous_workflows=briefing.autonomous_workflows,
        )

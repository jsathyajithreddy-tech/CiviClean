from src.application.dto.operational_data_dto import AnalyticsOverviewDto
from src.application.services.operational_data_service import OperationalDataService


class GetAnalyticsOverviewQuery:
    def __init__(self, service: OperationalDataService) -> None:
        self._service = service

    async def execute(self) -> AnalyticsOverviewDto:
        return await self._service.get_analytics_overview()

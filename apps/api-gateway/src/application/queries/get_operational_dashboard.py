from src.application.dto.operational_data_dto import OperationalDashboardDto
from src.application.services.operational_data_service import OperationalDataService


class GetOperationalDashboardQuery:
    def __init__(self, service: OperationalDataService) -> None:
        self._service = service

    async def execute(self) -> OperationalDashboardDto:
        return await self._service.get_dashboard_snapshot()

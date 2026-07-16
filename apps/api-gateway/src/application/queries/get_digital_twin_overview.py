from src.application.dto.operations_dto import (
    DigitalTwinOverviewDto,
    DigitalTwinScenarioDto,
    TwinLayerDto,
)
from src.domain.repositories.operations_repository import OperationsRepository


class GetDigitalTwinOverviewQuery:
    def __init__(self, repository: OperationsRepository) -> None:
        self._repository = repository

    async def execute(self) -> DigitalTwinOverviewDto:
        overview = await self._repository.get_digital_twin_overview()
        return DigitalTwinOverviewDto(
            generated_at=overview.generated_at,
            city_name=overview.city_name,
            layers=[
                TwinLayerDto(
                    id=layer.id,
                    label=layer.label,
                    asset_count=layer.asset_count,
                    status=layer.status,
                    telemetry=layer.telemetry,
                )
                for layer in overview.layers
            ],
            active_failures=overview.active_failures,
            simulations=[
                DigitalTwinScenarioDto(
                    name=scenario.name,
                    time_horizon_minutes=scenario.time_horizon_minutes,
                    impact=scenario.impact,
                    confidence_score=scenario.confidence_score,
                    suggested_actions=scenario.suggested_actions,
                )
                for scenario in overview.simulations
            ],
            historical_replay_available=overview.historical_replay_available,
        )

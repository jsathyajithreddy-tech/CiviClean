from src.application.dto.city_snapshot_dto import CitySnapshotDto, DomainMetricDto
from src.domain.repositories.city_snapshot_repository import CitySnapshotRepository


class GetCitySnapshotQuery:
    def __init__(self, repository: CitySnapshotRepository) -> None:
        self._repository = repository

    async def execute(self) -> CitySnapshotDto:
        snapshot = await self._repository.get_current_snapshot()
        return CitySnapshotDto(
            generated_at=snapshot.generated_at,
            active_alerts=snapshot.active_alerts,
            active_emergencies=snapshot.active_emergencies,
            traffic_flow=DomainMetricDto(
                name=snapshot.traffic_flow.name,
                value=snapshot.traffic_flow.value,
                direction=snapshot.traffic_flow.direction,
                status=snapshot.traffic_flow.status,
            ),
            air_quality_index=DomainMetricDto(
                name=snapshot.air_quality_index.name,
                value=snapshot.air_quality_index.value,
                direction=snapshot.air_quality_index.direction,
                status=snapshot.air_quality_index.status,
            ),
            energy_usage=DomainMetricDto(
                name=snapshot.energy_usage.name,
                value=snapshot.energy_usage.value,
                direction=snapshot.energy_usage.direction,
                status=snapshot.energy_usage.status,
            ),
            water_pressure=DomainMetricDto(
                name=snapshot.water_pressure.name,
                value=snapshot.water_pressure.value,
                direction=snapshot.water_pressure.direction,
                status=snapshot.water_pressure.status,
            ),
        )

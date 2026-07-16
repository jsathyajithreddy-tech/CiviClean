from datetime import UTC, datetime

from src.domain.entities.city_snapshot import CitySnapshot, DomainMetric
from src.domain.repositories.city_snapshot_repository import CitySnapshotRepository


class InMemoryCitySnapshotRepository(CitySnapshotRepository):
    async def get_current_snapshot(self) -> CitySnapshot:
        return CitySnapshot(
            generated_at=datetime.now(UTC),
            active_alerts=12,
            active_emergencies=3,
            traffic_flow=DomainMetric(
                name="Traffic Flow",
                value="78%",
                direction="up",
                status="watch",
            ),
            air_quality_index=DomainMetric(
                name="Air Quality Index",
                value="45 (Good)",
                direction="up",
                status="healthy",
            ),
            energy_usage=DomainMetric(
                name="Energy Usage",
                value="1.2 GW",
                direction="up",
                status="stable",
            ),
            water_pressure=DomainMetric(
                name="Water Pressure",
                value="5.5 bar",
                direction="steady",
                status="stable",
            ),
        )


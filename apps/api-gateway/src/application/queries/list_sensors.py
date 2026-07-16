from src.application.dto.operations_dto import SensorRecordDto
from src.domain.repositories.operations_repository import OperationsRepository


class ListSensorsQuery:
    def __init__(self, repository: OperationsRepository) -> None:
        self._repository = repository

    async def execute(self) -> list[SensorRecordDto]:
        sensors = await self._repository.list_sensors()
        return [
            SensorRecordDto(
                id=sensor.id,
                name=sensor.name,
                category=sensor.category,
                status=sensor.status,
                battery_percent=sensor.battery_percent,
                signal_strength=sensor.signal_strength,
                temperature_celsius=sensor.temperature_celsius,
                firmware_version=sensor.firmware_version,
                last_heartbeat=sensor.last_heartbeat,
                health=sensor.health,
                maintenance_due=sensor.maintenance_due,
                location=sensor.location,
            )
            for sensor in sensors
        ]

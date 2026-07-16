from abc import ABC, abstractmethod

from src.domain.entities.city_snapshot import CitySnapshot


class CitySnapshotRepository(ABC):
    @abstractmethod
    async def get_current_snapshot(self) -> CitySnapshot:
        """Return the latest city overview snapshot."""


from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True, slots=True)
class DomainMetric:
    name: str
    value: str
    direction: str
    status: str


@dataclass(frozen=True, slots=True)
class CitySnapshot:
    generated_at: datetime
    active_alerts: int
    active_emergencies: int
    traffic_flow: DomainMetric
    air_quality_index: DomainMetric
    energy_usage: DomainMetric
    water_pressure: DomainMetric


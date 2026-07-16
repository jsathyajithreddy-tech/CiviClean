from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DomainMetricDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str
    value: str
    direction: str
    status: str


class CitySnapshotDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    generated_at: datetime
    active_alerts: int
    active_emergencies: int
    traffic_flow: DomainMetricDto
    air_quality_index: DomainMetricDto
    energy_usage: DomainMetricDto
    water_pressure: DomainMetricDto


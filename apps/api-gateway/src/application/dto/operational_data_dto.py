from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SourceStatusDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str
    mode: str
    description: str
    refreshed_at: datetime


class OperationalMetricDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    key: str
    label: str
    value: float
    previous: float
    unit: str
    decimals: int = 0
    status: str
    sparkline: list[float]
    updated_at: datetime
    source: str


class WeatherSnapshotDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    condition: str
    temperature_celsius: float
    humidity_percent: float
    rainfall_mm: float
    wind_speed_kph: float
    source: str
    refreshed_at: datetime


class AirQualitySnapshotDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    aqi: int
    pm25: float
    pm10: float
    co: float
    no2: float
    ozone: float
    source: str
    refreshed_at: datetime


class EventImpactDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    module: str
    change: str


class SimulatedEventDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str
    severity: str
    started_at: datetime
    summary: str
    impacts: list[EventImpactDto]


class AiRecommendationSummaryDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    priority: str
    risk_score: int
    confidence_score: float
    recommended_actions: list[str]
    reasoning: list[str]


class OperationalNotificationDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    title: str
    detail: str
    severity: str
    timestamp: datetime
    acknowledged: bool


class MapAssetDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    label: str
    type: str
    x: float
    y: float
    heading: int
    status: str
    detail: str


class OperationalDashboardDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    generated_at: datetime
    refresh_interval_seconds: int
    live_data_message: str | None
    source_statuses: list[SourceStatusDto]
    weather: WeatherSnapshotDto
    air_quality: AirQualitySnapshotDto
    metrics: list[OperationalMetricDto]
    notifications: list[OperationalNotificationDto]
    map_assets: list[MapAssetDto]
    active_events: list[SimulatedEventDto]
    ai_recommendation: AiRecommendationSummaryDto


class TrendPointDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    timestamp: datetime
    value: float


class AnalyticsSeriesDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    metric_key: str
    title: str
    period: str
    points: list[TrendPointDto]
    summary: str


class AnalyticsOverviewDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    generated_at: datetime
    series: list[AnalyticsSeriesDto]

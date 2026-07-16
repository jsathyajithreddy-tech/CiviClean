from __future__ import annotations

import math
import random
from collections import deque
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta

import httpx

from src.application.dto.operational_data_dto import (
    AiRecommendationSummaryDto,
    AirQualitySnapshotDto,
    AnalyticsOverviewDto,
    AnalyticsSeriesDto,
    EventImpactDto,
    MapAssetDto,
    OperationalDashboardDto,
    OperationalMetricDto,
    OperationalNotificationDto,
    SimulatedEventDto,
    SourceStatusDto,
    TrendPointDto,
    WeatherSnapshotDto,
)
from src.bootstrap.config import Settings


@dataclass(frozen=True, slots=True)
class LiveSourceResult:
    mode: str
    description: str


class OperationalDataService:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._random = random.Random(42)
        self._refresh_interval_seconds = 5
        self._history: dict[str, deque[tuple[datetime, float]]] = {
            key: deque(maxlen=8_640)
            for key in (
                "traffic",
                "water",
                "energy",
                "waste",
                "air",
                "emergency",
                "reports",
                "infrastructure",
            )
        }
        self._metric_state: dict[str, OperationalMetricDto] = {}
        self._map_assets = self._seed_map_assets()
        self._notifications: list[OperationalNotificationDto] = []
        self._latest_snapshot: OperationalDashboardDto | None = None
        self._seed_state()

    def _seed_state(self) -> None:
        seeded_at = datetime.now(UTC) - timedelta(minutes=55)
        for offset in range(12):
            current_time = seeded_at + timedelta(minutes=offset * 5)
            events = self._build_events(current_time, None)
            weather = self._simulate_weather(current_time)
            air = self._simulate_air_quality(current_time, weather, events)
            metrics = self._simulate_metrics(current_time, weather, air, events)
            for metric in metrics.values():
                self._history[metric.key].append((metric.updated_at, metric.value))
            self._metric_state = metrics
        self._notifications = self._build_notifications(current_time, events, metrics)

    async def get_dashboard_snapshot(self) -> OperationalDashboardDto:
        generated_at = datetime.now(UTC)
        weather_live = await self._fetch_weather(generated_at)
        events = self._build_events(generated_at, weather_live)
        weather = weather_live or self._simulate_weather(generated_at)
        air_live = await self._fetch_air_quality(generated_at)
        air = air_live or self._simulate_air_quality(generated_at, weather, events)
        metrics = self._simulate_metrics(generated_at, weather, air, events)
        self._metric_state = metrics
        for metric in metrics.values():
            self._history[metric.key].append((metric.updated_at, metric.value))
        self._map_assets = self._advance_map_assets(events)
        self._notifications = self._build_notifications(generated_at, events, metrics)
        recommendation = self._build_ai_recommendation(weather, metrics, events, air)

        source_statuses = [
            SourceStatusDto(
                name="Weather",
                mode=weather.source,
                description=(
                    "Live weather feed active."
                    if weather.source == "live"
                    else "Live weather unavailable. Simulated operational weather is active."
                ),
                refreshed_at=weather.refreshed_at,
            ),
            SourceStatusDto(
                name="Air Quality",
                mode=air.source,
                description=(
                    "Live AQI feed active."
                    if air.source == "live"
                    else "Live AQI unavailable. Simulated environmental sensing is active."
                ),
                refreshed_at=air.refreshed_at,
            ),
            SourceStatusDto(
                name="Traffic",
                mode="simulated",
                description="Traffic API not configured. Realistic simulated operational flow is active.",
                refreshed_at=generated_at,
            ),
        ]

        live_message = None
        if weather.source != "live" or air.source != "live":
            live_message = "Live data unavailable. Showing simulated operational data."

        snapshot = OperationalDashboardDto(
            generated_at=generated_at,
            refresh_interval_seconds=self._refresh_interval_seconds,
            live_data_message=live_message,
            source_statuses=source_statuses,
            weather=weather,
            air_quality=air,
            metrics=list(metrics.values()),
            notifications=self._notifications,
            map_assets=self._map_assets,
            active_events=events,
            ai_recommendation=recommendation,
        )
        self._latest_snapshot = snapshot
        return snapshot

    async def get_analytics_overview(self) -> AnalyticsOverviewDto:
        if self._latest_snapshot is None:
            await self.get_dashboard_snapshot()

        series: list[AnalyticsSeriesDto] = []
        periods = [
            ("24h", 24 * 12),
            ("7d", 7 * 24 * 12),
            ("30d", 30 * 24 * 12),
        ]
        for metric_key, title in (
            ("traffic", "Peak traffic times"),
            ("waste", "Waste prediction"),
            ("energy", "Energy consumption"),
            ("emergency", "Incident frequency"),
            ("water", "Water pressure history"),
            ("air", "AQI history"),
        ):
            history = list(self._history[metric_key])
            for period_name, size in periods:
                points = history[-min(len(history), size) :]
                if not points:
                    continue
                values = [value for _, value in points]
                series.append(
                    AnalyticsSeriesDto(
                        metric_key=metric_key,
                        title=title,
                        period=period_name,
                        points=[
                            TrendPointDto(timestamp=timestamp, value=float(value))
                            for timestamp, value in points[-24:]
                        ],
                        summary=f"{title} average {sum(values) / len(values):.1f} over {period_name}.",
                    )
                )

        return AnalyticsOverviewDto(generated_at=datetime.now(UTC), series=series)

    async def _fetch_weather(self, generated_at: datetime) -> WeatherSnapshotDto | None:
        if (
            not self._settings.weather_api_base_url
            or not self._settings.weather_latitude
            or not self._settings.weather_longitude
        ):
            return None

        params = {
            "latitude": self._settings.weather_latitude,
            "longitude": self._settings.weather_longitude,
            "current": "temperature_2m,relative_humidity_2m,rain,wind_speed_10m,weather_code",
        }
        if self._settings.weather_api_key:
            params["apikey"] = self._settings.weather_api_key

        try:
            async with httpx.AsyncClient(timeout=6.0) as client:
                response = await client.get(self._settings.weather_api_base_url, params=params)
                response.raise_for_status()
                payload = response.json()
        except Exception:
            return None

        current = payload.get("current", {})
        if not current:
            return None

        return WeatherSnapshotDto(
            condition=self._map_weather_code(current.get("weather_code")),
            temperature_celsius=float(current.get("temperature_2m", 0.0)),
            humidity_percent=float(current.get("relative_humidity_2m", 0.0)),
            rainfall_mm=float(current.get("rain", 0.0)),
            wind_speed_kph=float(current.get("wind_speed_10m", 0.0)),
            source="live",
            refreshed_at=generated_at,
        )

    async def _fetch_air_quality(self, generated_at: datetime) -> AirQualitySnapshotDto | None:
        if (
            not self._settings.aqi_api_base_url
            or not self._settings.weather_latitude
            or not self._settings.weather_longitude
        ):
            return None

        params = {
            "latitude": self._settings.weather_latitude,
            "longitude": self._settings.weather_longitude,
            "current": "european_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,ozone",
        }
        if self._settings.aqi_api_key:
            params["apikey"] = self._settings.aqi_api_key

        try:
            async with httpx.AsyncClient(timeout=6.0) as client:
                response = await client.get(self._settings.aqi_api_base_url, params=params)
                response.raise_for_status()
                payload = response.json()
        except Exception:
            return None

        current = payload.get("current", {})
        if not current:
            return None

        return AirQualitySnapshotDto(
            aqi=int(float(current.get("european_aqi", 0))),
            pm25=float(current.get("pm2_5", 0.0)),
            pm10=float(current.get("pm10", 0.0)),
            co=float(current.get("carbon_monoxide", 0.0)),
            no2=float(current.get("nitrogen_dioxide", 0.0)),
            ozone=float(current.get("ozone", 0.0)),
            source="live",
            refreshed_at=generated_at,
        )

    def _simulate_weather(self, current_time: datetime) -> WeatherSnapshotDto:
        hour = current_time.hour + current_time.minute / 60
        temperature = 27.5 + math.sin(hour / 24 * math.tau) * 4.6
        humidity = 68 + math.cos(hour / 24 * math.tau) * 11
        rainfall = max(0.0, math.sin((hour - 13) / 8) * 4.2)
        wind = 10 + abs(math.sin(hour / 24 * math.tau * 2)) * 9
        condition = "Light Rain" if rainfall > 2 else "Cloudy" if humidity > 70 else "Partly Sunny"
        return WeatherSnapshotDto(
            condition=condition,
            temperature_celsius=round(temperature, 1),
            humidity_percent=round(humidity, 1),
            rainfall_mm=round(rainfall, 1),
            wind_speed_kph=round(wind, 1),
            source="simulated",
            refreshed_at=current_time,
        )

    def _simulate_air_quality(
        self,
        current_time: datetime,
        weather: WeatherSnapshotDto,
        events: list[SimulatedEventDto],
    ) -> AirQualitySnapshotDto:
        event_boost = 8 if any(event.name in {"Festival", "Political Rally"} for event in events) else 0
        rain_relief = 10 if weather.rainfall_mm > 2 else 0
        rush_hour = 12 if current_time.hour in {8, 9, 18, 19} else 0
        aqi = max(22, 48 + rush_hour + event_boost - rain_relief)
        return AirQualitySnapshotDto(
            aqi=int(aqi),
            pm25=round(aqi * 0.62, 1),
            pm10=round(aqi * 0.88, 1),
            co=round(0.4 + rush_hour / 70, 2),
            no2=round(19 + rush_hour / 2.2 + event_boost / 2, 1),
            ozone=round(31 + max(0, 5 - weather.rainfall_mm), 1),
            source="simulated",
            refreshed_at=current_time,
        )

    def _build_events(
        self,
        current_time: datetime,
        weather: WeatherSnapshotDto | None,
    ) -> list[SimulatedEventDto]:
        events: list[SimulatedEventDto] = []
        rainfall = weather.rainfall_mm if weather else self._simulate_weather(current_time).rainfall_mm

        if rainfall >= 2.5:
            events.append(
                SimulatedEventDto(
                    name="Heavy Rain",
                    severity="high",
                    started_at=current_time - timedelta(minutes=8),
                    summary="Heavy rain is increasing drainage and corridor pressure.",
                    impacts=[
                        EventImpactDto(module="Traffic", change="+15%"),
                        EventImpactDto(module="Water Risk", change="+40%"),
                        EventImpactDto(module="Waste Overflow", change="+20%"),
                        EventImpactDto(module="Emergency", change="+2 incidents"),
                    ],
                )
            )

        if current_time.hour in {8, 9, 17, 18, 19}:
            events.append(
                SimulatedEventDto(
                    name="Rush Hour",
                    severity="medium",
                    started_at=current_time - timedelta(minutes=15),
                    summary="Commuter demand is increasing corridor occupancy and service calls.",
                    impacts=[
                        EventImpactDto(module="Traffic", change="+8%"),
                        EventImpactDto(module="Citizen Reports", change="+12%"),
                    ],
                )
            )

        if current_time.weekday() in {4, 5} and current_time.hour in {18, 19, 20}:
            events.append(
                SimulatedEventDto(
                    name="Festival",
                    severity="medium",
                    started_at=current_time - timedelta(minutes=20),
                    summary="Festival footfall is increasing waste load and people movement.",
                    impacts=[
                        EventImpactDto(module="Waste", change="+14%"),
                        EventImpactDto(module="Traffic", change="+10%"),
                        EventImpactDto(module="Citizen Reports", change="+18%"),
                    ],
                )
            )

        return events

    def _simulate_metrics(
        self,
        current_time: datetime,
        weather: WeatherSnapshotDto,
        air_quality: AirQualitySnapshotDto,
        events: list[SimulatedEventDto],
    ) -> dict[str, OperationalMetricDto]:
        event_names = {event.name for event in events}
        rainfall_factor = weather.rainfall_mm * 2.8
        rush_hour = 10 if "Rush Hour" in event_names else 0
        festival = 8 if "Festival" in event_names else 0
        heavy_rain = 14 if "Heavy Rain" in event_names else 0
        hour_wave = math.sin((current_time.hour + current_time.minute / 60) / 24 * math.tau)

        values = {
            "traffic": 62 + rush_hour + festival + heavy_rain + max(0, hour_wave) * 8,
            "water": 5.8 - min(0.5, weather.rainfall_mm / 8) + math.cos(current_time.minute / 60 * math.tau) * 0.08,
            "energy": 1.12 + max(0, hour_wave) * 0.18 + (0.07 if "Heavy Rain" in event_names else 0.0),
            "waste": 66 + festival + heavy_rain + max(0, rainfall_factor),
            "air": float(air_quality.aqi),
            "emergency": 1 + (2 if "Heavy Rain" in event_names else 0) + (1 if rush_hour else 0),
            "reports": 86 + rush_hour * 2 + festival * 2 + heavy_rain * 3,
            "infrastructure": 95 - heavy_rain * 0.5 - festival * 0.2,
        }

        definitions = {
            "traffic": ("Traffic Flow", "%", 0, 45, 98),
            "water": ("Water Pressure", "bar", 1, 4.6, 6.5),
            "energy": ("Energy Usage", "GW", 2, 0.92, 1.6),
            "waste": ("Waste Fill", "%", 0, 40, 98),
            "air": ("Air Quality Index", "AQI", 0, 18, 180),
            "emergency": ("Active Emergencies", "", 0, 0, 8),
            "reports": ("Citizen Reports", "", 0, 40, 220),
            "infrastructure": ("Infrastructure Health", "%", 0, 72, 99),
        }

        result: dict[str, OperationalMetricDto] = {}
        for key, raw_value in values.items():
            label, unit, decimals, minimum, maximum = definitions[key]
            value = round(max(minimum, min(maximum, raw_value)), decimals)
            previous_state = self._metric_state.get(key)
            previous = previous_state.value if previous_state else value
            sparkline = (
                [*previous_state.sparkline[-11:], value] if previous_state else [value] * 12
            )
            status = self._status_for_metric(key, value)
            result[key] = OperationalMetricDto(
                key=key,
                label=label,
                value=float(value),
                previous=float(previous),
                unit=unit,
                decimals=decimals,
                status=status,
                sparkline=[float(point) for point in sparkline[-12:]],
                updated_at=current_time,
                source="simulated" if key != "air" else air_quality.source,
            )
        return result

    def _build_notifications(
        self,
        current_time: datetime,
        events: list[SimulatedEventDto],
        metrics: dict[str, OperationalMetricDto],
    ) -> list[OperationalNotificationDto]:
        notifications = [
            OperationalNotificationDto(
                id=f"notif-{index}",
                title=event.name,
                detail=event.summary,
                severity=event.severity,
                timestamp=current_time,
                acknowledged=False,
            )
            for index, event in enumerate(events, start=1)
        ]
        if metrics["waste"].value >= 80:
            notifications.append(
                OperationalNotificationDto(
                    id="notif-waste",
                    title="Garbage overflow risk",
                    detail="Waste overflow probability is elevated near the civic core.",
                    severity="high",
                    timestamp=current_time,
                    acknowledged=False,
                )
            )
        if metrics["water"].value <= 5.4:
            notifications.append(
                OperationalNotificationDto(
                    id="notif-water",
                    title="Water pressure watch",
                    detail="Pressure variance suggests drainage and leak inspection should remain staged.",
                    severity="medium",
                    timestamp=current_time,
                    acknowledged=False,
                )
            )
        return notifications

    def _build_ai_recommendation(
        self,
        weather: WeatherSnapshotDto,
        metrics: dict[str, OperationalMetricDto],
        events: list[SimulatedEventDto],
        air_quality: AirQualitySnapshotDto,
    ) -> AiRecommendationSummaryDto:
        risk_score = min(
            98,
            int(
                metrics["traffic"].value * 0.28
                + (100 - metrics["infrastructure"].value) * 1.4
                + metrics["waste"].value * 0.18
                + metrics["emergency"].value * 6
                + weather.rainfall_mm * 4
            ),
        )
        confidence = 0.88 + (0.05 if weather.rainfall_mm > 2 else 0.0) + (0.02 if events else 0.0)
        actions = [
            "Deploy additional waste trucks before peak traffic.",
            "Pre-stage drainage teams in Sector 4.",
            "Protect emergency corridors around Harbor Loop.",
        ]
        if air_quality.aqi > 70:
            actions.append("Monitor AQI hotspots along freight corridors.")

        reasoning = [
            f"{weather.condition} conditions with rainfall at {weather.rainfall_mm:.1f} mm are affecting multiple systems.",
            f"Traffic is operating at {metrics['traffic'].value:.0f}% and waste overflow risk is {metrics['waste'].value:.0f}%.",
            f"Water pressure is {metrics['water'].value:.1f} bar while active emergencies stand at {metrics['emergency'].value:.0f}.",
        ]

        priority = "Critical" if risk_score >= 80 else "High" if risk_score >= 65 else "Medium"
        return AiRecommendationSummaryDto(
            priority=priority,
            risk_score=risk_score,
            confidence_score=round(min(confidence, 0.97), 2),
            recommended_actions=actions,
            reasoning=reasoning,
        )

    def _seed_map_assets(self) -> list[MapAssetDto]:
        return [
            MapAssetDto(
                id="bus-14",
                label="Bus 14",
                type="bus",
                x=18,
                y=62,
                heading=42,
                status="active",
                detail="Moving bus on civic core route.",
            ),
            MapAssetDto(
                id="amb-7",
                label="AMB-7",
                type="ambulance",
                x=58,
                y=36,
                heading=136,
                status="active",
                detail="Ambulance pre-positioned for corridor access.",
            ),
            MapAssetDto(
                id="gar-11",
                label="WT-11",
                type="garbage-truck",
                x=42,
                y=68,
                heading=90,
                status="watch",
                detail="Garbage truck rerouted around high congestion.",
            ),
            MapAssetDto(
                id="fire-3",
                label="FIR-3",
                type="fire-vehicle",
                x=62,
                y=54,
                heading=220,
                status="active",
                detail="Fire unit covering harbor district.",
            ),
            MapAssetDto(
                id="sensor-aq",
                label="AQ-12",
                type="sensor",
                x=44,
                y=26,
                heading=0,
                status="active",
                detail="Environmental sensor broadcasting AQI telemetry.",
            ),
            MapAssetDto(
                id="incident-harbor",
                label="Harbor Incident",
                type="incident",
                x=70,
                y=43,
                heading=0,
                status="critical",
                detail="Correlated emergency and congestion incident.",
            ),
        ]

    def _advance_map_assets(self, events: list[SimulatedEventDto]) -> list[MapAssetDto]:
        movement_boost = 2.6 if any(event.name == "Heavy Rain" for event in events) else 1.6
        assets: list[MapAssetDto] = []
        for asset in self._map_assets:
            if asset.type in {"sensor", "incident"}:
                assets.append(asset)
                continue
            x = max(8.0, min(92.0, asset.x + self._random.uniform(-movement_boost, movement_boost)))
            y = max(12.0, min(88.0, asset.y + self._random.uniform(-movement_boost, movement_boost)))
            heading = (asset.heading + int(self._random.uniform(-20, 20)) + 360) % 360
            assets.append(
                MapAssetDto(
                    id=asset.id,
                    label=asset.label,
                    type=asset.type,
                    x=round(x, 1),
                    y=round(y, 1),
                    heading=heading,
                    status=asset.status,
                    detail=asset.detail,
                )
            )
        return assets

    def _status_for_metric(self, key: str, value: float) -> str:
        thresholds = {
            "traffic": (75, 88),
            "water": (5.2, 4.9),
            "energy": (1.28, 1.42),
            "waste": (78, 90),
            "air": (60, 90),
            "emergency": (3, 5),
            "reports": (120, 160),
            "infrastructure": (88, 82),
        }
        warn, critical = thresholds[key]
        if key in {"water", "infrastructure"}:
            if value <= critical:
                return "critical"
            if value <= warn:
                return "watch"
            return "healthy" if key == "infrastructure" else "stable"
        if value >= critical:
            return "critical"
        if value >= warn:
            return "watch"
        return "healthy" if key in {"air", "infrastructure"} else "stable"

    def _map_weather_code(self, code: int | float | None) -> str:
        mapping = {
            0: "Clear",
            1: "Mainly Clear",
            2: "Partly Cloudy",
            3: "Cloudy",
            45: "Fog",
            51: "Light Drizzle",
            61: "Light Rain",
            63: "Rain",
            65: "Heavy Rain",
            80: "Rain Showers",
            95: "Thunderstorm",
        }
        return mapping.get(int(code or 0), "Weather Active")

export interface ApiEnvelope<T> {
  data: T;
  meta: {
    request_id: string;
    timestamp: string;
    version: string;
  };
  error: null | {
    code: string;
    message: string;
  };
}

export interface SourceStatus {
  name: string;
  mode: string;
  description: string;
  refreshed_at: string;
}

export interface OperationalMetric {
  key: string;
  label: string;
  value: number;
  previous: number;
  unit: string;
  decimals: number;
  status: "healthy" | "watch" | "critical" | "stable";
  sparkline: number[];
  updated_at: string;
  source: string;
}

export interface WeatherSnapshot {
  condition: string;
  temperature_celsius: number;
  humidity_percent: number;
  rainfall_mm: number;
  wind_speed_kph: number;
  source: string;
  refreshed_at: string;
}

export interface AirQualitySnapshot {
  aqi: number;
  pm25: number;
  pm10: number;
  co: number;
  no2: number;
  ozone: number;
  source: string;
  refreshed_at: string;
}

export interface OperationalNotification {
  id: string;
  title: string;
  detail: string;
  severity: "critical" | "high" | "medium" | "low";
  timestamp: string;
  acknowledged: boolean;
}

export interface MapAsset {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
  heading: number;
  status: "active" | "watch" | "offline" | "critical";
  detail: string;
}

export interface SimulatedEvent {
  name: string;
  severity: string;
  started_at: string;
  summary: string;
  impacts: Array<{
    module: string;
    change: string;
  }>;
}

export interface AiRecommendation {
  priority: string;
  risk_score: number;
  confidence_score: number;
  recommended_actions: string[];
  reasoning: string[];
}

export interface OperationalDashboardSnapshot {
  generated_at: string;
  refresh_interval_seconds: number;
  live_data_message: string | null;
  source_statuses: SourceStatus[];
  weather: WeatherSnapshot;
  air_quality: AirQualitySnapshot;
  metrics: OperationalMetric[];
  notifications: OperationalNotification[];
  map_assets: MapAsset[];
  active_events: SimulatedEvent[];
  ai_recommendation: AiRecommendation;
}

const now = () => new Date().toISOString();

const fallbackSnapshot: OperationalDashboardSnapshot = {
  generated_at: now(),
  refresh_interval_seconds: 5,
  live_data_message: "Live data unavailable. Showing simulated operational data.",
  source_statuses: [
    {
      name: "Weather",
      mode: "simulated",
      description: "Live weather unavailable. Simulated operational weather is active.",
      refreshed_at: now(),
    },
    {
      name: "Air Quality",
      mode: "simulated",
      description: "Live AQI unavailable. Simulated environmental sensing is active.",
      refreshed_at: now(),
    },
  ],
  weather: {
    condition: "Cloudy",
    temperature_celsius: 29,
    humidity_percent: 68,
    rainfall_mm: 1.8,
    wind_speed_kph: 14,
    source: "simulated",
    refreshed_at: now(),
  },
  air_quality: {
    aqi: 45,
    pm25: 27.9,
    pm10: 39.6,
    co: 0.4,
    no2: 19,
    ozone: 36,
    source: "simulated",
    refreshed_at: now(),
  },
  metrics: [
    { key: "traffic", label: "Traffic Flow", value: 78, previous: 74, unit: "%", decimals: 0, status: "watch", sparkline: [64, 68, 67, 70, 74, 75, 78], updated_at: now(), source: "simulated" },
    { key: "water", label: "Water Pressure", value: 5.5, previous: 5.3, unit: "bar", decimals: 1, status: "stable", sparkline: [5.1, 5.2, 5.2, 5.3, 5.4, 5.4, 5.5], updated_at: now(), source: "simulated" },
    { key: "energy", label: "Energy Usage", value: 1.2, previous: 1.16, unit: "GW", decimals: 2, status: "watch", sparkline: [1.02, 1.04, 1.08, 1.1, 1.15, 1.17, 1.2], updated_at: now(), source: "simulated" },
    { key: "waste", label: "Waste Fill", value: 71, previous: 69, unit: "%", decimals: 0, status: "watch", sparkline: [58, 61, 63, 65, 67, 69, 71], updated_at: now(), source: "simulated" },
    { key: "air", label: "Air Quality Index", value: 45, previous: 49, unit: "AQI", decimals: 0, status: "healthy", sparkline: [53, 51, 49, 48, 47, 46, 45], updated_at: now(), source: "simulated" },
    { key: "emergency", label: "Active Emergencies", value: 3, previous: 4, unit: "", decimals: 0, status: "critical", sparkline: [6, 5, 5, 4, 4, 3, 3], updated_at: now(), source: "simulated" },
    { key: "reports", label: "Citizen Reports", value: 128, previous: 117, unit: "", decimals: 0, status: "watch", sparkline: [82, 90, 97, 105, 114, 119, 128], updated_at: now(), source: "simulated" },
    { key: "infrastructure", label: "Infrastructure Health", value: 92, previous: 90, unit: "%", decimals: 0, status: "healthy", sparkline: [85, 86, 87, 88, 90, 91, 92], updated_at: now(), source: "simulated" },
  ],
  notifications: [
    {
      id: "notif-1",
      title: "Heavy Rain",
      detail: "Heavy rain is increasing drainage and corridor pressure.",
      severity: "high",
      timestamp: now(),
      acknowledged: false,
    },
  ],
  map_assets: [
    { id: "bus-14", label: "Bus 14", type: "bus", x: 18, y: 62, heading: 42, status: "active", detail: "Moving bus on civic core route." },
    { id: "amb-7", label: "AMB-7", type: "ambulance", x: 58, y: 36, heading: 136, status: "active", detail: "Ambulance pre-positioned for corridor access." },
    { id: "gar-11", label: "WT-11", type: "garbage-truck", x: 42, y: 68, heading: 90, status: "watch", detail: "Garbage truck rerouted around high congestion." },
    { id: "sensor-aq", label: "AQ-12", type: "sensor", x: 44, y: 26, heading: 0, status: "active", detail: "Environmental sensor broadcasting AQI telemetry." },
  ],
  active_events: [
    {
      name: "Heavy Rain",
      severity: "high",
      started_at: now(),
      summary: "Heavy rain is increasing drainage and corridor pressure.",
      impacts: [
        { module: "Traffic", change: "+15%" },
        { module: "Water Risk", change: "+40%" },
      ],
    },
  ],
  ai_recommendation: {
    priority: "High",
    risk_score: 78,
    confidence_score: 0.94,
    recommended_actions: [
      "Deploy additional waste trucks before peak traffic.",
      "Pre-stage drainage teams in Sector 4.",
      "Protect emergency corridors around Harbor Loop.",
    ],
    reasoning: [
      "Traffic congestion is increasing.",
      "Overflow risk in Sector 4 is above threshold.",
    ],
  },
};

export async function getOperationalDashboardSnapshot(): Promise<OperationalDashboardSnapshot> {
  try {
    const response = await fetch("/api/v1/dashboard/operations");
    if (!response.ok) {
      throw new Error(`Operational dashboard failed with status ${response.status}`);
    }
    const payload = (await response.json()) as ApiEnvelope<OperationalDashboardSnapshot>;
    return payload.data;
  } catch {
    return fallbackSnapshot;
  }
}

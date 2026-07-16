import type { DashboardSummary } from "../features/dashboard/dashboard-types";

interface ApiEnvelope<T> {
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

const fallbackSummary: DashboardSummary = {
  generated_at: new Date().toISOString(),
  active_alerts: 12,
  active_emergencies: 3,
  traffic_flow: {
    name: "Traffic Flow",
    value: "78%",
    direction: "up",
    status: "watch",
  },
  air_quality_index: {
    name: "Air Quality Index",
    value: "45 (Good)",
    direction: "up",
    status: "healthy",
  },
  energy_usage: {
    name: "Energy Usage",
    value: "1.2 GW",
    direction: "up",
    status: "stable",
  },
  water_pressure: {
    name: "Water Pressure",
    value: "5.5 bar",
    direction: "steady",
    status: "stable",
  },
};

async function getSummary(): Promise<DashboardSummary> {
  try {
    const response = await fetch("/api/v1/dashboard/summary");

    if (!response.ok) {
      throw new Error(`Dashboard summary failed with status ${response.status}`);
    }

    const payload = (await response.json()) as ApiEnvelope<DashboardSummary>;
    return payload.data;
  } catch {
    return fallbackSummary;
  }
}

export const dashboardApi = {
  getSummary,
};

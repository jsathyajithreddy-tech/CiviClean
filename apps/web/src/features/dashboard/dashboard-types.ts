export interface DomainMetric {
  name: string;
  value: string;
  direction: string;
  status: string;
}

export interface DashboardSummary {
  generated_at: string;
  active_alerts: number;
  active_emergencies: number;
  traffic_flow: DomainMetric;
  air_quality_index: DomainMetric;
  energy_usage: DomainMetric;
  water_pressure: DomainMetric;
}

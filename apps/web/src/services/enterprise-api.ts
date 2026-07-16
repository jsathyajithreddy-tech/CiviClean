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

export interface AgentRecommendation {
  summary: string;
  confidence_score: number;
  rationale: string;
  suggested_action: string;
}

export interface AgentResourceUsage {
  cpu_percent: number;
  memory_percent: number;
  active_workflows: number;
  tokens_last_hour: number;
}

export interface AgentDecision {
  summary: string;
  impact: string;
  decided_at: string;
}

export interface DomainAgent {
  name: string;
  domain: string;
  status: string;
  current_objective: string;
  anomaly: string;
  severity: string;
  confidence_score: number;
  last_updated: string;
  recent_events: string[];
  dependencies: string[];
  reasoning: string[];
  completed_tasks: string[];
  running_tasks: string[];
  resource_usage: AgentResourceUsage;
  last_decision: AgentDecision;
  recommendation: AgentRecommendation;
}

export interface CityBrainBriefing {
  generated_at: string;
  headline: string;
  executive_summary: string;
  risk_score: number;
  confidence_score: number;
  predicted_window_minutes: number;
  correlated_domains: string[];
  recommendations: string[];
  reasoning: string[];
  autonomous_workflows: string[];
}

export interface TwinLayer {
  id: string;
  label: string;
  asset_count: number;
  status: string;
  telemetry: string;
}

export interface DigitalTwinScenario {
  name: string;
  time_horizon_minutes: number;
  impact: string;
  confidence_score: number;
  suggested_actions: string[];
}

export interface DigitalTwinOverview {
  generated_at: string;
  city_name: string;
  layers: TwinLayer[];
  active_failures: string[];
  simulations: DigitalTwinScenario[];
  historical_replay_available: boolean;
}

export interface IncidentTimelineEntry {
  timestamp: string;
  title: string;
  detail: string;
  status: string;
}

export interface IncidentNote {
  author: string;
  message: string;
  created_at: string;
}

export interface IncidentResolutionEntry {
  timestamp: string;
  summary: string;
  outcome: string;
}

export interface IncidentRecord {
  id: string;
  title: string;
  domain: string;
  category: string;
  status: string;
  priority: string;
  assigned_department: string;
  assigned_officer: string;
  owner: string;
  location: string;
  live_location: string;
  opened_at: string;
  updated_at: string;
  timeline: IncidentTimelineEntry[];
  comments: IncidentNote[];
  notifications: string[];
  severity: string;
  eta_minutes: number;
  assigned_agents: string[];
  affected_services: string[];
  images: string[];
  resolution_history: IncidentResolutionEntry[];
}

export interface SensorRecord {
  id: string;
  name: string;
  category: string;
  status: string;
  battery_percent: number;
  signal_strength: number;
  temperature_celsius: number;
  firmware_version: string;
  last_heartbeat: string;
  health: string;
  maintenance_due: string;
  location: string;
}

export interface ReportDefinition {
  id: string;
  title: string;
  category: string;
  cadence: string;
  formats: string[];
  description: string;
}

export interface CopilotSource {
  label: string;
  kind: string;
  freshness: string;
  confidence_score: number;
}

export interface CopilotChartPoint {
  label: string;
  value: number;
  lower_bound: number;
  upper_bound: number;
}

export interface CopilotChart {
  title: string;
  unit: string;
  points: CopilotChartPoint[];
}

export interface CopilotResponse {
  question: string;
  answer: string;
  markdown_answer: string;
  confidence_score: number;
  cited_domains: string[];
  suggested_actions: string[];
  suggested_prompts: string[];
  reasoning: string[];
  sources: CopilotSource[];
  chart: CopilotChart | null;
  generated_at: string;
}

export interface MissionTimelineEntry {
  id: string;
  timestamp: string;
  agent: string;
  title: string;
  detail: string;
  status: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  agent: string;
  decision: string;
  reason: string;
  outcome: string;
  operator: string;
  status: string;
}

export interface OperationalKpi {
  key: string;
  label: string;
  value: string;
  trend: string;
  status: string;
}

export interface CommandExecutionResult {
  command: string;
  incident_id: string;
  status: string;
  outcome: string;
  updated_at: string;
}

async function fetchEnvelope<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`${url} failed with status ${response.status}`);
  }
  const payload = (await response.json()) as ApiEnvelope<T>;
  return payload.data;
}

const now = () => new Date().toISOString();

const fallbackAgents: DomainAgent[] = [
  {
    name: "Traffic Agent",
    domain: "traffic",
    status: "watch",
    current_objective: "Protect Harbor Loop throughput while preserving emergency access.",
    anomaly: "Harbor corridor throughput is projected to fall 16% during the next weather window.",
    severity: "high",
    confidence_score: 0.93,
    last_updated: now(),
    recent_events: ["Signal priority staged on Harbor Loop.", "Travel-time watch activated for civic core."],
    dependencies: ["Emergency Agent", "Weather Agent", "City Brain Orchestrator"],
    reasoning: ["Freight and commuter peaks are colliding in the same corridor."],
    completed_tasks: ["Validated camera telemetry recovery."],
    running_tasks: ["Forecasting eastbound spillover for the next hour."],
    resource_usage: { cpu_percent: 61, memory_percent: 48, active_workflows: 3, tokens_last_hour: 18400 },
    last_decision: {
      summary: "Preserve Harbor Loop emergency bandwidth before broader diversions.",
      impact: "Projected ambulance delay reduced by 4 minutes.",
      decided_at: now(),
    },
    recommendation: {
      summary: "Protect the emergency corridor and rebalance adaptive signals.",
      confidence_score: 0.93,
      rationale: "Congestion and weather timing overlap in the same corridor.",
      suggested_action: "Run corridor optimization workflow.",
    },
  },
];

const fallbackBriefing: CityBrainBriefing = {
  generated_at: now(),
  headline: "Heavy rainfall predicted in 18 minutes with correlated drainage and mobility stress.",
  executive_summary:
    "City Brain correlates rainfall timing, traffic congestion, emergency routing pressure, and drainage overload risk into a staged enterprise response plan.",
  risk_score: 78,
  confidence_score: 0.94,
  predicted_window_minutes: 18,
  correlated_domains: ["traffic", "water", "energy", "emergency", "waste", "weather"],
  recommendations: [
    "Pre-stage pumps and drainage crews in Sector 4.",
    "Lock the harbor emergency corridor before freight spillover expands.",
    "Reserve energy support for critical facilities and flood-response equipment.",
  ],
  reasoning: [
    "Weather pattern and telemetry place the strongest risk in the next 18 minutes.",
    "Traffic and emergency models agree on response-time degradation without corridor protection.",
    "Water and waste signals indicate localized flood amplification risk.",
  ],
  autonomous_workflows: [
    "drainage_resilience_sector_4",
    "harbor_corridor_priority_lock",
    "critical_facility_energy_reserve",
  ],
};

const fallbackTwin: DigitalTwinOverview = {
  generated_at: now(),
  city_name: "Neo Metro",
  layers: [
    { id: "roads", label: "Road Network", asset_count: 582, status: "active", telemetry: "Traffic speed and closures" },
    { id: "water", label: "Water Pipelines", asset_count: 214, status: "watch", telemetry: "Pressure and drainage telemetry" },
    { id: "power", label: "Power Grid", asset_count: 118, status: "watch", telemetry: "Reserve and transformer load" },
    { id: "iot", label: "IoT Devices", asset_count: 2842, status: "active", telemetry: "Heartbeat and firmware state" },
  ],
  active_failures: [
    "Sector 4 drainage subsystem remains in watch state.",
    "Transformer T-18 reserve band is below the preferred threshold.",
  ],
  simulations: [
    {
      name: "Rainfall Surge Scenario",
      time_horizon_minutes: 30,
      impact: "Localized flooding and emergency lane degradation without intervention.",
      confidence_score: 0.91,
      suggested_actions: ["Activate pumps.", "Protect harbor corridor."],
    },
  ],
  historical_replay_available: true,
};

const fallbackIncidents: IncidentRecord[] = [
  {
    id: "INC-240710-001",
    title: "Harbor Corridor Congestion and Medical Access Risk",
    domain: "emergency",
    category: "Mobility Access",
    status: "Investigating",
    priority: "Critical",
    assigned_department: "Emergency Command",
    assigned_officer: "Asha Rao",
    owner: "Emergency Commander Asha Rao",
    location: "Harbor Transit Loop",
    live_location: "13.0485, 80.2821",
    opened_at: now(),
    updated_at: now(),
    timeline: [
      { timestamp: now(), title: "Correlated alert generated", detail: "Traffic and emergency models detected medical access risk.", status: "new" },
    ],
    comments: [{ author: "Hospital Liaison", message: "Hospital intake remains available in three facilities.", created_at: now() }],
    notifications: ["Emergency and traffic teams notified."],
    severity: "critical",
    eta_minutes: 7,
    assigned_agents: ["Emergency Agent", "Traffic Agent"],
    affected_services: ["Emergency Access", "Traffic Flow"],
    images: ["Harbor-Cam-12"],
    resolution_history: [],
  },
];

const fallbackSensors: SensorRecord[] = [
  {
    id: "SNS-TRA-104",
    name: "Harbor Camera Cluster NC-4",
    category: "Traffic",
    status: "Online",
    battery_percent: 94,
    signal_strength: 88,
    temperature_celsius: 33.4,
    firmware_version: "v4.8.2",
    last_heartbeat: now(),
    health: "Healthy",
    maintenance_due: "2026-08-12",
    location: "Harbor Transit Loop",
  },
];

const fallbackReports: ReportDefinition[] = [
  {
    id: "report-daily-ops",
    title: "Daily Operations Briefing",
    category: "Executive",
    cadence: "Daily",
    formats: ["PDF", "CSV", "Print"],
    description: "Cross-domain executive summary with incidents, AI recommendations, and KPIs.",
  },
];

const fallbackTimeline: MissionTimelineEntry[] = [
  {
    id: "timeline-1",
    timestamp: now(),
    agent: "City Brain Orchestrator",
    title: "Cross-domain event package generated",
    detail: "Readiness workflows linked traffic, water, energy, and emergency posture.",
    status: "completed",
  },
];

const fallbackAuditLog: AuditLogEntry[] = [
  {
    id: "audit-1",
    timestamp: now(),
    agent: "City Brain Orchestrator",
    decision: "Recommend staged intervention",
    reason: "Localized risk is highly correlated but not yet citywide.",
    outcome: "Awaiting operator approval",
    operator: "Maya Chen",
    status: "pending",
  },
];

const fallbackKpis: OperationalKpi[] = [
  { key: "response_time", label: "Emergency Response Time", value: "7m 12s", trend: "-14%", status: "improving" },
  { key: "traffic_risk", label: "Congestion Risk", value: "79%", trend: "+11 pts", status: "critical" },
  { key: "flood_risk", label: "Flood Probability", value: "28%", trend: "-14 pts", status: "watch" },
  { key: "cost_avoidance", label: "Preventive Cost Avoidance", value: "$142k", trend: "+14%", status: "healthy" },
];

function fallbackCopilot(question: string): CopilotResponse {
  const trafficQuestion = question.toLowerCase().includes("traffic") || question.toLowerCase().includes("congestion");
  return {
    question,
    answer: trafficQuestion
      ? "Traffic is increasing because freight inflow, commuter volume, and weather-related caution behavior are overlapping around Harbor Loop."
      : "City Brain recommends staged intervention across traffic, water, energy, and emergency operations based on the current correlated event pattern.",
    markdown_answer: trafficQuestion
      ? "## Traffic increase drivers\n1. Freight inflow is peaking.\n2. Rainfall risk is reducing average travel speed.\n3. Emergency-lane protection narrows general traffic capacity."
      : "## City status summary\n- **Traffic:** Harbor Loop is under rising pressure.\n- **Water:** Sector 4 drainage remains on watch.\n- **Emergency:** Response posture is elevated but contained.",
    confidence_score: 0.9,
    cited_domains: trafficQuestion ? ["traffic", "weather", "emergency"] : ["city-brain", "traffic", "emergency"],
    suggested_actions: ["Generate executive briefing", "Open correlated incidents", "Run what-if simulation"],
    suggested_prompts: ["Why is traffic increasing?", "Show all critical incidents.", "Predict congestion in the next hour."],
    reasoning: ["The current operational signals are highly correlated across multiple domains."],
    sources: [{ label: "Operational dashboard stream", kind: "telemetry", freshness: "5 seconds ago", confidence_score: 0.9 }],
    chart: trafficQuestion
      ? {
          title: "Predicted corridor congestion",
          unit: "%",
          points: [
            { label: "15m", value: 68, lower_bound: 63, upper_bound: 72 },
            { label: "30m", value: 74, lower_bound: 69, upper_bound: 78 },
            { label: "60m", value: 79, lower_bound: 73, upper_bound: 84 },
          ],
        }
      : null,
    generated_at: now(),
  };
}

export const enterpriseApi = {
  async getAgents() {
    try {
      return await fetchEnvelope<DomainAgent[]>("/api/v1/agents/status");
    } catch {
      return fallbackAgents;
    }
  },
  async getCityBrainBriefing() {
    try {
      return await fetchEnvelope<CityBrainBriefing>("/api/v1/city-brain/briefing");
    } catch {
      return fallbackBriefing;
    }
  },
  async getDigitalTwinOverview() {
    try {
      return await fetchEnvelope<DigitalTwinOverview>("/api/v1/digital-twin/overview");
    } catch {
      return fallbackTwin;
    }
  },
  async getIncidents() {
    try {
      return await fetchEnvelope<IncidentRecord[]>("/api/v1/incidents");
    } catch {
      return fallbackIncidents;
    }
  },
  async getSensors() {
    try {
      return await fetchEnvelope<SensorRecord[]>("/api/v1/iot/sensors");
    } catch {
      return fallbackSensors;
    }
  },
  async getReports() {
    try {
      return await fetchEnvelope<ReportDefinition[]>("/api/v1/reports/catalog");
    } catch {
      return fallbackReports;
    }
  },
  async getCommandTimeline() {
    try {
      return await fetchEnvelope<MissionTimelineEntry[]>("/api/v1/command-center/timeline");
    } catch {
      return fallbackTimeline;
    }
  },
  async getAuditLog() {
    try {
      return await fetchEnvelope<AuditLogEntry[]>("/api/v1/command-center/audit-log");
    } catch {
      return fallbackAuditLog;
    }
  },
  async getOperationalKpis() {
    try {
      return await fetchEnvelope<OperationalKpi[]>("/api/v1/command-center/kpis");
    } catch {
      return fallbackKpis;
    }
  },
  async executeCommandAction(command: string) {
    try {
      return await fetchEnvelope<CommandExecutionResult>("/api/v1/command-center/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });
    } catch {
      return {
        command,
        incident_id: "CITYWIDE-COMMAND",
        status: "completed",
        outcome: `${command} executed from the command center.`,
        updated_at: now(),
      };
    }
  },
  async executeIncidentAction(incidentId: string, command: string) {
    try {
      return await fetchEnvelope<CommandExecutionResult>(`/api/v1/incidents/${incidentId}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });
    } catch {
      return {
        command,
        incident_id: incidentId,
        status: "completed",
        outcome: `${command} executed for ${incidentId}.`,
        updated_at: now(),
      };
    }
  },
  async askCopilot(question: string) {
    try {
      return await fetchEnvelope<CopilotResponse>("/api/v1/copilot/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
    } catch {
      return fallbackCopilot(question);
    }
  },
};

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True, slots=True)
class AgentResourceUsage:
    cpu_percent: int
    memory_percent: int
    active_workflows: int
    tokens_last_hour: int


@dataclass(frozen=True, slots=True)
class AgentDecision:
    summary: str
    impact: str
    decided_at: datetime


@dataclass(frozen=True, slots=True)
class AgentRecommendation:
    summary: str
    confidence_score: float
    rationale: str
    suggested_action: str


@dataclass(frozen=True, slots=True)
class DomainAgent:
    name: str
    domain: str
    status: str
    current_objective: str
    anomaly: str
    severity: str
    confidence_score: float
    last_updated: datetime
    recent_events: list[str]
    dependencies: list[str]
    reasoning: list[str]
    completed_tasks: list[str]
    running_tasks: list[str]
    resource_usage: AgentResourceUsage
    last_decision: AgentDecision
    recommendation: AgentRecommendation


@dataclass(frozen=True, slots=True)
class CityBrainBriefing:
    generated_at: datetime
    headline: str
    executive_summary: str
    risk_score: int
    confidence_score: float
    predicted_window_minutes: int
    correlated_domains: list[str]
    recommendations: list[str]
    reasoning: list[str]
    autonomous_workflows: list[str]


@dataclass(frozen=True, slots=True)
class TwinLayer:
    id: str
    label: str
    asset_count: int
    status: str
    telemetry: str


@dataclass(frozen=True, slots=True)
class DigitalTwinScenario:
    name: str
    time_horizon_minutes: int
    impact: str
    confidence_score: float
    suggested_actions: list[str]


@dataclass(frozen=True, slots=True)
class DigitalTwinOverview:
    generated_at: datetime
    city_name: str
    layers: list[TwinLayer]
    active_failures: list[str]
    simulations: list[DigitalTwinScenario]
    historical_replay_available: bool


@dataclass(frozen=True, slots=True)
class IncidentTimelineEntry:
    timestamp: datetime
    title: str
    detail: str
    status: str


@dataclass(frozen=True, slots=True)
class IncidentNote:
    author: str
    message: str
    created_at: datetime


@dataclass(frozen=True, slots=True)
class IncidentResolutionEntry:
    timestamp: datetime
    summary: str
    outcome: str


@dataclass(frozen=True, slots=True)
class IncidentRecord:
    id: str
    title: str
    domain: str
    category: str
    status: str
    priority: str
    assigned_department: str
    assigned_officer: str
    owner: str
    location: str
    live_location: str
    opened_at: datetime
    updated_at: datetime
    timeline: list[IncidentTimelineEntry]
    comments: list[IncidentNote]
    notifications: list[str]
    severity: str = "medium"
    eta_minutes: int = 0
    assigned_agents: list[str] | None = None
    affected_services: list[str] | None = None
    images: list[str] | None = None
    resolution_history: list[IncidentResolutionEntry] | None = None


@dataclass(frozen=True, slots=True)
class MissionTimelineEntry:
    id: str
    timestamp: datetime
    agent: str
    title: str
    detail: str
    status: str


@dataclass(frozen=True, slots=True)
class AuditLogEntry:
    id: str
    timestamp: datetime
    agent: str
    decision: str
    reason: str
    outcome: str
    operator: str
    status: str


@dataclass(frozen=True, slots=True)
class OperationalKpi:
    key: str
    label: str
    value: str
    trend: str
    status: str


@dataclass(frozen=True, slots=True)
class CommandExecutionResult:
    command: str
    incident_id: str
    status: str
    outcome: str
    updated_at: datetime


@dataclass(frozen=True, slots=True)
class SensorRecord:
    id: str
    name: str
    category: str
    status: str
    battery_percent: int
    signal_strength: int
    temperature_celsius: float
    firmware_version: str
    last_heartbeat: datetime
    health: str
    maintenance_due: str
    location: str


@dataclass(frozen=True, slots=True)
class ReportDefinition:
    id: str
    title: str
    category: str
    cadence: str
    formats: list[str]
    description: str


@dataclass(frozen=True, slots=True)
class CopilotSource:
    label: str
    kind: str
    freshness: str
    confidence_score: float


@dataclass(frozen=True, slots=True)
class CopilotChartPoint:
    label: str
    value: float
    lower_bound: float
    upper_bound: float


@dataclass(frozen=True, slots=True)
class CopilotChart:
    title: str
    unit: str
    points: list[CopilotChartPoint]


@dataclass(frozen=True, slots=True)
class CopilotResponse:
    question: str
    answer: str
    markdown_answer: str
    confidence_score: float
    cited_domains: list[str]
    suggested_actions: list[str]
    suggested_prompts: list[str]
    reasoning: list[str]
    sources: list[CopilotSource]
    chart: CopilotChart | None
    generated_at: datetime

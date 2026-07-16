from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AgentRecommendationDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    summary: str
    confidence_score: float
    rationale: str
    suggested_action: str


class AgentResourceUsageDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    cpu_percent: int
    memory_percent: int
    active_workflows: int
    tokens_last_hour: int


class AgentDecisionDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    summary: str
    impact: str
    decided_at: datetime


class DomainAgentDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

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
    resource_usage: AgentResourceUsageDto
    last_decision: AgentDecisionDto
    recommendation: AgentRecommendationDto


class CityBrainBriefingDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

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


class TwinLayerDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    label: str
    asset_count: int
    status: str
    telemetry: str


class DigitalTwinScenarioDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str
    time_horizon_minutes: int
    impact: str
    confidence_score: float
    suggested_actions: list[str]


class DigitalTwinOverviewDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    generated_at: datetime
    city_name: str
    layers: list[TwinLayerDto]
    active_failures: list[str]
    simulations: list[DigitalTwinScenarioDto]
    historical_replay_available: bool


class IncidentTimelineEntryDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    timestamp: datetime
    title: str
    detail: str
    status: str


class IncidentNoteDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    author: str
    message: str
    created_at: datetime


class IncidentResolutionEntryDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    timestamp: datetime
    summary: str
    outcome: str


class IncidentRecordDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

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
    timeline: list[IncidentTimelineEntryDto]
    comments: list[IncidentNoteDto]
    notifications: list[str]
    severity: str
    eta_minutes: int
    assigned_agents: list[str]
    affected_services: list[str]
    images: list[str]
    resolution_history: list[IncidentResolutionEntryDto]


class SensorRecordDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

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


class ReportDefinitionDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    title: str
    category: str
    cadence: str
    formats: list[str]
    description: str


class CopilotSourceDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    label: str
    kind: str
    freshness: str
    confidence_score: float


class CopilotChartPointDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    label: str
    value: float
    lower_bound: float
    upper_bound: float


class CopilotChartDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str
    unit: str
    points: list[CopilotChartPointDto]


class CopilotResponseDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    question: str
    answer: str
    markdown_answer: str
    confidence_score: float
    cited_domains: list[str]
    suggested_actions: list[str]
    suggested_prompts: list[str]
    reasoning: list[str]
    sources: list[CopilotSourceDto]
    chart: CopilotChartDto | None
    generated_at: datetime


class MissionTimelineEntryDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    timestamp: datetime
    agent: str
    title: str
    detail: str
    status: str


class AuditLogEntryDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    timestamp: datetime
    agent: str
    decision: str
    reason: str
    outcome: str
    operator: str
    status: str


class OperationalKpiDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    key: str
    label: str
    value: str
    trend: str
    status: str


class CommandExecutionResultDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    command: str
    incident_id: str
    status: str
    outcome: str
    updated_at: datetime

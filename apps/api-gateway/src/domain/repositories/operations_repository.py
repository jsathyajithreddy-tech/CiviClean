from abc import ABC, abstractmethod

from src.domain.entities.operations import (
    AuditLogEntry,
    CityBrainBriefing,
    CommandExecutionResult,
    CopilotResponse,
    DigitalTwinOverview,
    DomainAgent,
    IncidentRecord,
    MissionTimelineEntry,
    OperationalKpi,
    ReportDefinition,
    SensorRecord,
)


class OperationsRepository(ABC):
    @abstractmethod
    async def list_agents(self) -> list[DomainAgent]:
        """Return current enterprise AI agent state."""

    @abstractmethod
    async def get_city_brain_briefing(self) -> CityBrainBriefing:
        """Return the latest City Brain decision-support briefing."""

    @abstractmethod
    async def get_digital_twin_overview(self) -> DigitalTwinOverview:
        """Return digital twin state and simulation metadata."""

    @abstractmethod
    async def list_incidents(self) -> list[IncidentRecord]:
        """Return current incidents and workflow state."""

    @abstractmethod
    async def list_sensors(self) -> list[SensorRecord]:
        """Return IoT sensor inventory and health."""

    @abstractmethod
    async def list_reports(self) -> list[ReportDefinition]:
        """Return report catalog and export support."""

    @abstractmethod
    async def ask_copilot(self, question: str) -> CopilotResponse:
        """Answer an operational copilot question."""

    @abstractmethod
    async def list_timeline(self) -> list[MissionTimelineEntry]:
        """Return live multi-agent mission timeline."""

    @abstractmethod
    async def list_audit_logs(self) -> list[AuditLogEntry]:
        """Return AI decision audit trail."""

    @abstractmethod
    async def get_operational_kpis(self) -> list[OperationalKpi]:
        """Return command center KPIs."""

    @abstractmethod
    async def execute_command(self, incident_id: str, command: str) -> CommandExecutionResult:
        """Execute a backend operation against an incident."""

from src.application.dto.operations_dto import (
    IncidentNoteDto,
    IncidentRecordDto,
    IncidentResolutionEntryDto,
    IncidentTimelineEntryDto,
)
from src.domain.repositories.operations_repository import OperationsRepository


class ListIncidentsQuery:
    def __init__(self, repository: OperationsRepository) -> None:
        self._repository = repository

    async def execute(self) -> list[IncidentRecordDto]:
        incidents = await self._repository.list_incidents()
        return [
            IncidentRecordDto(
                id=incident.id,
                title=incident.title,
                domain=incident.domain,
                category=incident.category,
                status=incident.status,
                priority=incident.priority,
                assigned_department=incident.assigned_department,
                assigned_officer=incident.assigned_officer,
                owner=incident.owner,
                location=incident.location,
                live_location=incident.live_location,
                opened_at=incident.opened_at,
                updated_at=incident.updated_at,
                timeline=[
                    IncidentTimelineEntryDto(
                        timestamp=entry.timestamp,
                        title=entry.title,
                        detail=entry.detail,
                        status=entry.status,
                    )
                    for entry in incident.timeline
                ],
                comments=[
                    IncidentNoteDto(
                        author=entry.author,
                        message=entry.message,
                        created_at=entry.created_at,
                    )
                    for entry in incident.comments
                ],
                notifications=incident.notifications,
                severity=incident.severity,
                eta_minutes=incident.eta_minutes,
                assigned_agents=incident.assigned_agents or [],
                affected_services=incident.affected_services or [],
                images=incident.images or [],
                resolution_history=[
                    IncidentResolutionEntryDto(
                        timestamp=entry.timestamp,
                        summary=entry.summary,
                        outcome=entry.outcome,
                    )
                    for entry in (incident.resolution_history or [])
                ],
            )
            for incident in incidents
        ]

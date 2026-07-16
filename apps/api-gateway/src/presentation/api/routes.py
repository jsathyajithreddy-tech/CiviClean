from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict, EmailStr

from src.application.dto.operational_data_dto import (
    AnalyticsOverviewDto,
    OperationalDashboardDto,
)
from src.application.queries.get_analytics_overview import GetAnalyticsOverviewQuery
from src.application.commands.ask_copilot import AskCopilotCommand, AskCopilotCommandInput
from src.application.commands.authenticate_user import (
    AuthenticateUserCommand,
    AuthenticateUserCommandInput,
    InvalidCredentialsError,
)
from src.application.commands.execute_command_action import (
    ExecuteCommandAction,
    ExecuteCommandActionInput,
)
from src.application.dto.city_snapshot_dto import CitySnapshotDto
from src.application.dto.identity_dto import LoginResponseDto, UserDto
from src.application.dto.operations_dto import (
    AuditLogEntryDto,
    CityBrainBriefingDto,
    CommandExecutionResultDto,
    CopilotResponseDto,
    DigitalTwinOverviewDto,
    DomainAgentDto,
    IncidentRecordDto,
    MissionTimelineEntryDto,
    OperationalKpiDto,
    ReportDefinitionDto,
    SensorRecordDto,
)
from src.application.queries.get_city_brain_briefing import GetCityBrainBriefingQuery
from src.application.queries.get_city_snapshot import GetCitySnapshotQuery
from src.application.queries.get_digital_twin_overview import GetDigitalTwinOverviewQuery
from src.application.queries.get_operational_kpis import GetOperationalKpisQuery
from src.application.queries.get_operational_dashboard import GetOperationalDashboardQuery
from src.application.queries.list_audit_logs import ListAuditLogsQuery
from src.application.queries.list_agents import ListAgentsQuery
from src.application.queries.list_incidents import ListIncidentsQuery
from src.application.queries.list_reports import ListReportsQuery
from src.application.queries.list_sensors import ListSensorsQuery
from src.application.queries.list_timeline import ListTimelineQuery
from src.application.queries.list_users import ListUsersQuery
from src.presentation.api.dependencies import (
    get_ask_copilot_command,
    get_execute_command_action,
    get_analytics_overview_query,
    get_city_brain_briefing_query,
    get_authenticate_user_command,
    get_operational_kpis_query,
    get_operational_dashboard_query,
    get_city_snapshot_query,
    get_current_authenticated_user,
    get_digital_twin_overview_query,
    get_list_audit_logs_query,
    get_list_agents_query,
    get_list_incidents_query,
    get_list_reports_query,
    get_list_sensors_query,
    get_list_timeline_query,
    get_list_users_query,
    require_permission,
)
from src.presentation.api.schemas import ApiResponse, ResponseMeta

router = APIRouter()


class LoginRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    email: EmailStr
    password: str


class CopilotQueryRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    question: str


class CommandActionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    command: str


@router.get("/health", tags=["system"])
async def healthcheck() -> ApiResponse[dict[str, str]]:
    return ApiResponse(
        data={"status": "ok"},
        meta=ResponseMeta(timestamp=datetime.now(UTC)),
    )


@router.get("/dashboard/summary", tags=["dashboard"])
async def get_dashboard_summary(
    query: GetCitySnapshotQuery = Depends(get_city_snapshot_query),
) -> ApiResponse[CitySnapshotDto]:
    summary = await query.execute()
    return ApiResponse(
        data=summary,
        meta=ResponseMeta(timestamp=datetime.now(UTC)),
    )


@router.get("/dashboard/operations", tags=["dashboard"])
async def get_dashboard_operations(
    query: GetOperationalDashboardQuery = Depends(get_operational_dashboard_query),
) -> ApiResponse[OperationalDashboardDto]:
    snapshot = await query.execute()
    return ApiResponse(
        data=snapshot,
        meta=ResponseMeta(timestamp=datetime.now(UTC)),
    )


@router.get("/analytics/overview", tags=["analytics"])
async def get_analytics_overview(
    query: GetAnalyticsOverviewQuery = Depends(get_analytics_overview_query),
) -> ApiResponse[AnalyticsOverviewDto]:
    overview = await query.execute()
    return ApiResponse(
        data=overview,
        meta=ResponseMeta(timestamp=datetime.now(UTC)),
    )


@router.get("/agents/status", tags=["agents"])
async def get_agent_status(
    _: UserDto = Depends(get_current_authenticated_user),
    query: ListAgentsQuery = Depends(get_list_agents_query),
) -> ApiResponse[list[DomainAgentDto]]:
    agents = await query.execute()
    return ApiResponse(data=agents, meta=ResponseMeta(timestamp=datetime.now(UTC)))


@router.get("/city-brain/briefing", tags=["city-brain"])
async def get_city_brain_briefing(
    _: UserDto = Depends(get_current_authenticated_user),
    query: GetCityBrainBriefingQuery = Depends(get_city_brain_briefing_query),
) -> ApiResponse[CityBrainBriefingDto]:
    briefing = await query.execute()
    return ApiResponse(data=briefing, meta=ResponseMeta(timestamp=datetime.now(UTC)))


@router.get("/digital-twin/overview", tags=["digital-twin"])
async def get_digital_twin_overview(
    _: UserDto = Depends(get_current_authenticated_user),
    query: GetDigitalTwinOverviewQuery = Depends(get_digital_twin_overview_query),
) -> ApiResponse[DigitalTwinOverviewDto]:
    overview = await query.execute()
    return ApiResponse(data=overview, meta=ResponseMeta(timestamp=datetime.now(UTC)))


@router.get("/incidents", tags=["incidents"])
async def get_incidents(
    _: UserDto = Depends(get_current_authenticated_user),
    query: ListIncidentsQuery = Depends(get_list_incidents_query),
) -> ApiResponse[list[IncidentRecordDto]]:
    incidents = await query.execute()
    return ApiResponse(data=incidents, meta=ResponseMeta(timestamp=datetime.now(UTC)))


@router.get("/iot/sensors", tags=["iot"])
async def get_sensors(
    _: UserDto = Depends(get_current_authenticated_user),
    query: ListSensorsQuery = Depends(get_list_sensors_query),
) -> ApiResponse[list[SensorRecordDto]]:
    sensors = await query.execute()
    return ApiResponse(data=sensors, meta=ResponseMeta(timestamp=datetime.now(UTC)))


@router.get("/reports/catalog", tags=["reports"])
async def get_reports_catalog(
    _: UserDto = Depends(get_current_authenticated_user),
    query: ListReportsQuery = Depends(get_list_reports_query),
) -> ApiResponse[list[ReportDefinitionDto]]:
    reports = await query.execute()
    return ApiResponse(data=reports, meta=ResponseMeta(timestamp=datetime.now(UTC)))


@router.post("/copilot/query", tags=["copilot"])
async def ask_copilot(
    payload: CopilotQueryRequest,
    _: UserDto = Depends(get_current_authenticated_user),
    command: AskCopilotCommand = Depends(get_ask_copilot_command),
) -> ApiResponse[CopilotResponseDto]:
    response = await command.execute(AskCopilotCommandInput(question=payload.question))
    return ApiResponse(data=response, meta=ResponseMeta(timestamp=datetime.now(UTC)))


@router.get("/command-center/timeline", tags=["command-center"])
async def get_command_timeline(
    _: UserDto = Depends(get_current_authenticated_user),
    query: ListTimelineQuery = Depends(get_list_timeline_query),
) -> ApiResponse[list[MissionTimelineEntryDto]]:
    return ApiResponse(data=await query.execute(), meta=ResponseMeta(timestamp=datetime.now(UTC)))


@router.get("/command-center/audit-log", tags=["command-center"])
async def get_audit_log(
    _: UserDto = Depends(get_current_authenticated_user),
    query: ListAuditLogsQuery = Depends(get_list_audit_logs_query),
) -> ApiResponse[list[AuditLogEntryDto]]:
    return ApiResponse(data=await query.execute(), meta=ResponseMeta(timestamp=datetime.now(UTC)))


@router.get("/command-center/kpis", tags=["command-center"])
async def get_command_center_kpis(
    _: UserDto = Depends(get_current_authenticated_user),
    query: GetOperationalKpisQuery = Depends(get_operational_kpis_query),
) -> ApiResponse[list[OperationalKpiDto]]:
    return ApiResponse(data=await query.execute(), meta=ResponseMeta(timestamp=datetime.now(UTC)))


@router.post("/command-center/actions", tags=["command-center"])
async def execute_command_center_action(
    payload: CommandActionRequest,
    _: UserDto = Depends(get_current_authenticated_user),
    command: ExecuteCommandAction = Depends(get_execute_command_action),
) -> ApiResponse[CommandExecutionResultDto]:
    result = await command.execute(
        ExecuteCommandActionInput(
            incident_id="CITYWIDE-COMMAND",
            command=payload.command,
        )
    )
    return ApiResponse(data=result, meta=ResponseMeta(timestamp=datetime.now(UTC)))


@router.post("/incidents/{incident_id}/actions", tags=["incidents"])
async def execute_incident_action(
    incident_id: str,
    payload: CommandActionRequest,
    _: UserDto = Depends(get_current_authenticated_user),
    command: ExecuteCommandAction = Depends(get_execute_command_action),
) -> ApiResponse[CommandExecutionResultDto]:
    result = await command.execute(
        ExecuteCommandActionInput(
            incident_id=incident_id,
            command=payload.command,
        )
    )
    return ApiResponse(data=result, meta=ResponseMeta(timestamp=datetime.now(UTC)))


@router.post("/auth/login", tags=["auth"])
async def login(
    payload: LoginRequest,
    command: AuthenticateUserCommand = Depends(get_authenticate_user_command),
) -> ApiResponse[LoginResponseDto]:
    try:
        result = await command.execute(
            AuthenticateUserCommandInput(email=payload.email, password=payload.password)
        )
    except InvalidCredentialsError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(error),
        ) from error

    return ApiResponse(
        data=result,
        meta=ResponseMeta(timestamp=datetime.now(UTC)),
    )


@router.get("/auth/me", tags=["auth"])
async def me(
    current_user: UserDto = Depends(get_current_authenticated_user),
) -> ApiResponse[UserDto]:
    return ApiResponse(
        data=current_user,
        meta=ResponseMeta(timestamp=datetime.now(UTC)),
    )


@router.get("/users", tags=["users"])
async def list_users(
    _: UserDto = Depends(require_permission("users:read")),
    query: ListUsersQuery = Depends(get_list_users_query),
) -> ApiResponse[list[UserDto]]:
    users = await query.execute()
    return ApiResponse(
        data=users,
        meta=ResponseMeta(timestamp=datetime.now(UTC)),
    )

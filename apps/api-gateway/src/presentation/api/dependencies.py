from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from src.application.queries.get_analytics_overview import GetAnalyticsOverviewQuery
from src.application.commands.ask_copilot import AskCopilotCommand
from src.application.commands.authenticate_user import AuthenticateUserCommand
from src.application.commands.execute_command_action import ExecuteCommandAction

from src.application.dto.identity_dto import UserDto
from src.application.queries.get_city_brain_briefing import GetCityBrainBriefingQuery
from src.application.queries.get_city_snapshot import GetCitySnapshotQuery
from src.application.queries.get_current_user import GetCurrentUserQuery
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
from src.domain.entities.identity import AccessTokenClaims
from src.infrastructure.security.jwt_token_service import InvalidTokenError, JwtTokenService


def get_city_snapshot_query(request: Request) -> GetCitySnapshotQuery:
    return request.app.container.get_city_snapshot_query()  # type: ignore[attr-defined]


def get_operational_dashboard_query(request: Request) -> GetOperationalDashboardQuery:
    return request.app.container.get_operational_dashboard_query()  # type: ignore[attr-defined]


def get_analytics_overview_query(request: Request) -> GetAnalyticsOverviewQuery:
    return request.app.container.get_analytics_overview_query()  # type: ignore[attr-defined]


def get_authenticate_user_command(request: Request) -> AuthenticateUserCommand:
    return request.app.container.authenticate_user_command()  # type: ignore[attr-defined]


def get_ask_copilot_command(request: Request) -> AskCopilotCommand:
    return request.app.container.ask_copilot_command()  # type: ignore[attr-defined]


def get_execute_command_action(request: Request) -> ExecuteCommandAction:
    return request.app.container.execute_command_action()  # type: ignore[attr-defined]


def get_current_user_query(request: Request) -> GetCurrentUserQuery:
    return request.app.container.get_current_user_query()  # type: ignore[attr-defined]


def get_list_users_query(request: Request) -> ListUsersQuery:
    return request.app.container.list_users_query()  # type: ignore[attr-defined]


def get_city_brain_briefing_query(request: Request) -> GetCityBrainBriefingQuery:
    return request.app.container.get_city_brain_briefing_query()  # type: ignore[attr-defined]


def get_digital_twin_overview_query(request: Request) -> GetDigitalTwinOverviewQuery:
    return request.app.container.get_digital_twin_overview_query()  # type: ignore[attr-defined]


def get_list_agents_query(request: Request) -> ListAgentsQuery:
    return request.app.container.list_agents_query()  # type: ignore[attr-defined]


def get_list_incidents_query(request: Request) -> ListIncidentsQuery:
    return request.app.container.list_incidents_query()  # type: ignore[attr-defined]


def get_list_sensors_query(request: Request) -> ListSensorsQuery:
    return request.app.container.list_sensors_query()  # type: ignore[attr-defined]


def get_list_reports_query(request: Request) -> ListReportsQuery:
    return request.app.container.list_reports_query()  # type: ignore[attr-defined]


def get_list_timeline_query(request: Request) -> ListTimelineQuery:
    return request.app.container.list_timeline_query()  # type: ignore[attr-defined]


def get_list_audit_logs_query(request: Request) -> ListAuditLogsQuery:
    return request.app.container.list_audit_logs_query()  # type: ignore[attr-defined]


def get_operational_kpis_query(request: Request) -> GetOperationalKpisQuery:
    return request.app.container.operational_kpis_query()  # type: ignore[attr-defined]


def get_token_service(request: Request) -> JwtTokenService:
    return request.app.container.token_service()  # type: ignore[attr-defined]


bearer_scheme = HTTPBearer(auto_error=True)


def get_access_token_claims(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    token_service: JwtTokenService = Depends(get_token_service),
) -> AccessTokenClaims:
    try:
        return token_service.decode_access_token(credentials.credentials)
    except InvalidTokenError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(error),
        ) from error


async def get_current_authenticated_user(
    claims: AccessTokenClaims = Depends(get_access_token_claims),
    query: GetCurrentUserQuery = Depends(get_current_user_query),
) -> UserDto:
    return await query.execute(claims)


def require_permission(required_permission: str):
    async def dependency(
        user: UserDto = Depends(get_current_authenticated_user),
    ) -> UserDto:
        if required_permission not in user.permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource.",
            )
        return user

    return dependency

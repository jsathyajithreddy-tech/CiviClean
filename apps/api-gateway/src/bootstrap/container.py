from dependency_injector import containers, providers

from src.application.commands.ask_copilot import AskCopilotCommand
from src.application.commands.authenticate_user import AuthenticateUserCommand
from src.application.commands.execute_command_action import ExecuteCommandAction
from src.application.queries.get_analytics_overview import GetAnalyticsOverviewQuery
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
from src.application.services.operational_data_service import OperationalDataService
from src.bootstrap.config import Settings, get_settings
from src.infrastructure.db.initializer import DatabaseInitializer
from src.infrastructure.db.session import create_engine, create_session_factory
from src.infrastructure.repositories.in_memory_city_snapshot_repository import (
    InMemoryCitySnapshotRepository,
)
from src.infrastructure.repositories.in_memory_operations_repository import (
    InMemoryOperationsRepository,
)
from src.infrastructure.repositories.sql_session_repository import SqlSessionRepository
from src.infrastructure.repositories.sql_user_repository import SqlUserRepository
from src.infrastructure.security.jwt_token_service import JwtTokenService
from src.infrastructure.security.scrypt_password_hasher import ScryptPasswordHasher


def _seed_password_hash(hasher: ScryptPasswordHasher, password: str) -> str:
    return hasher.hash_password(password)


class Container(containers.DeclarativeContainer):
    wiring_config = containers.WiringConfiguration(
        modules=["src.presentation.api.dependencies", "src.presentation.api.routes"]
    )

    settings: providers.Singleton[Settings] = providers.Singleton(get_settings)
    password_hasher = providers.Singleton(ScryptPasswordHasher)
    admin_password_hash = providers.Callable(
        _seed_password_hash,
        hasher=password_hasher,
        password="admin123",
    )
    operator_password_hash = providers.Callable(
        _seed_password_hash,
        hasher=password_hasher,
        password="operator123",
    )
    engine = providers.Singleton(
        create_engine,
        database_url=settings.provided.database_url,
    )
    session_factory = providers.Singleton(
        create_session_factory,
        database_url=settings.provided.database_url,
    )
    database_initializer = providers.Factory(
        DatabaseInitializer,
        engine=engine,
        session_factory=session_factory,
        admin_password_hash=admin_password_hash,
        operator_password_hash=operator_password_hash,
    )
    user_repository = providers.Singleton(
        SqlUserRepository,
        session_factory=session_factory,
    )
    session_repository = providers.Singleton(
        SqlSessionRepository,
        session_factory=session_factory,
    )
    token_service = providers.Singleton(
        JwtTokenService,
        secret_key=settings.provided.jwt_secret_key,
        issuer=settings.provided.jwt_issuer,
        access_token_ttl_minutes=settings.provided.access_token_ttl_minutes,
        refresh_token_ttl_minutes=settings.provided.refresh_token_ttl_minutes,
    )
    city_snapshot_repository = providers.Singleton(InMemoryCitySnapshotRepository)
    operations_repository = providers.Singleton(InMemoryOperationsRepository)
    operational_data_service = providers.Singleton(
        OperationalDataService,
        settings=settings,
    )
    get_city_snapshot_query = providers.Factory(
        GetCitySnapshotQuery,
        repository=city_snapshot_repository,
    )
    get_operational_dashboard_query = providers.Factory(
        GetOperationalDashboardQuery,
        service=operational_data_service,
    )
    get_analytics_overview_query = providers.Factory(
        GetAnalyticsOverviewQuery,
        service=operational_data_service,
    )
    get_city_brain_briefing_query = providers.Factory(
        GetCityBrainBriefingQuery,
        repository=operations_repository,
    )
    get_digital_twin_overview_query = providers.Factory(
        GetDigitalTwinOverviewQuery,
        repository=operations_repository,
    )
    list_agents_query = providers.Factory(
        ListAgentsQuery,
        repository=operations_repository,
    )
    list_incidents_query = providers.Factory(
        ListIncidentsQuery,
        repository=operations_repository,
    )
    list_sensors_query = providers.Factory(
        ListSensorsQuery,
        repository=operations_repository,
    )
    list_reports_query = providers.Factory(
        ListReportsQuery,
        repository=operations_repository,
    )
    ask_copilot_command = providers.Factory(
        AskCopilotCommand,
        repository=operations_repository,
    )
    execute_command_action = providers.Factory(
        ExecuteCommandAction,
        repository=operations_repository,
    )
    authenticate_user_command = providers.Factory(
        AuthenticateUserCommand,
        user_repository=user_repository,
        session_repository=session_repository,
        password_hasher=password_hasher,
        token_service=token_service,
        refresh_token_ttl_minutes=settings.provided.refresh_token_ttl_minutes,
        access_token_ttl_minutes=settings.provided.access_token_ttl_minutes,
    )
    get_current_user_query = providers.Factory(
        GetCurrentUserQuery,
        user_repository=user_repository,
    )
    list_users_query = providers.Factory(
        ListUsersQuery,
        user_repository=user_repository,
    )
    list_timeline_query = providers.Factory(
        ListTimelineQuery,
        repository=operations_repository,
    )
    list_audit_logs_query = providers.Factory(
        ListAuditLogsQuery,
        repository=operations_repository,
    )
    operational_kpis_query = providers.Factory(
        GetOperationalKpisQuery,
        repository=operations_repository,
    )

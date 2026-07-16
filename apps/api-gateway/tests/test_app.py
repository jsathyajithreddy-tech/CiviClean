from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from src.bootstrap.config import get_settings
from src.bootstrap.app import create_app


@pytest.fixture(autouse=True)
def configure_test_database(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    monkeypatch.setenv("DATABASE_URL", f"sqlite+aiosqlite:///{tmp_path / 'test.db'}")
    get_settings.cache_clear()
    yield
    get_settings.cache_clear()


def login_as_admin(client: TestClient) -> dict[str, str]:
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@smartcity.example.com", "password": "admin123"},
    )
    assert response.status_code == 200
    payload = response.json()["data"]
    return {"Authorization": f"Bearer {payload['access_token']}"}


def test_healthcheck_returns_ok() -> None:
    client = TestClient(create_app())

    response = client.get("/api/v1/health")

    assert response.status_code == 200
    payload = response.json()
    assert payload["data"]["status"] == "ok"
    assert payload["error"] is None


def test_dashboard_summary_returns_seeded_metrics() -> None:
    client = TestClient(create_app())

    response = client.get("/api/v1/dashboard/summary")

    assert response.status_code == 200
    payload = response.json()
    assert payload["data"]["active_alerts"] == 12
    assert payload["data"]["traffic_flow"]["value"] == "78%"


def test_dashboard_operations_returns_source_aware_snapshot() -> None:
    client = TestClient(create_app())

    response = client.get("/api/v1/dashboard/operations")

    assert response.status_code == 200
    payload = response.json()["data"]
    assert payload["refresh_interval_seconds"] == 5
    assert len(payload["metrics"]) >= 8
    assert len(payload["source_statuses"]) >= 2
    assert payload["weather"]["source"] in {"live", "simulated"}


def test_analytics_overview_returns_historical_series() -> None:
    client = TestClient(create_app())

    client.get("/api/v1/dashboard/operations")
    response = client.get("/api/v1/analytics/overview")

    assert response.status_code == 200
    payload = response.json()["data"]
    assert len(payload["series"]) >= 3
    assert payload["series"][0]["period"] in {"24h", "7d", "30d"}


def test_login_returns_access_token_and_user_profile() -> None:
    client = TestClient(create_app())

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@smartcity.example.com", "password": "admin123"},
    )

    assert response.status_code == 200
    payload = response.json()["data"]
    assert payload["token_type"] == "bearer"
    assert payload["user"]["email"] == "admin@smartcity.example.com"
    assert "users:read" in payload["user"]["permissions"]


def test_me_returns_authenticated_user() -> None:
    client = TestClient(create_app())

    response = client.get("/api/v1/auth/me", headers=login_as_admin(client))

    assert response.status_code == 200
    payload = response.json()["data"]
    assert payload["full_name"] == "City Administrator"


def test_operator_cannot_list_users() -> None:
    client = TestClient(create_app())
    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "operator@smartcity.example.com", "password": "operator123"},
    )
    headers = {"Authorization": f"Bearer {login_response.json()['data']['access_token']}"}

    response = client.get("/api/v1/users", headers=headers)

    assert response.status_code == 403


def test_admin_can_list_users() -> None:
    client = TestClient(create_app())

    response = client.get("/api/v1/users", headers=login_as_admin(client))

    assert response.status_code == 200
    payload = response.json()["data"]
    assert len(payload) >= 2


def test_agents_endpoint_returns_orchestrated_agents() -> None:
    client = TestClient(create_app())

    response = client.get("/api/v1/agents/status", headers=login_as_admin(client))

    assert response.status_code == 200
    payload = response.json()["data"]
    assert any(agent["name"] == "City Brain Orchestrator" for agent in payload)
    assert any(agent["domain"] == "traffic" for agent in payload)


def test_city_brain_briefing_returns_cross_domain_plan() -> None:
    client = TestClient(create_app())

    response = client.get("/api/v1/city-brain/briefing", headers=login_as_admin(client))

    assert response.status_code == 200
    payload = response.json()["data"]
    assert payload["predicted_window_minutes"] == 18
    assert "traffic" in payload["correlated_domains"]
    assert len(payload["autonomous_workflows"]) >= 1


def test_digital_twin_overview_returns_layers_and_simulations() -> None:
    client = TestClient(create_app())

    response = client.get("/api/v1/digital-twin/overview", headers=login_as_admin(client))

    assert response.status_code == 200
    payload = response.json()["data"]
    assert payload["city_name"] == "Neo Metro"
    assert len(payload["layers"]) >= 5
    assert payload["historical_replay_available"] is True


def test_incidents_reports_and_sensors_are_available() -> None:
    client = TestClient(create_app())
    headers = login_as_admin(client)

    incidents = client.get("/api/v1/incidents", headers=headers)
    sensors = client.get("/api/v1/iot/sensors", headers=headers)
    reports = client.get("/api/v1/reports/catalog", headers=headers)

    assert incidents.status_code == 200
    assert sensors.status_code == 200
    assert reports.status_code == 200
    assert incidents.json()["data"][0]["status"] in {"New", "Assigned", "Acknowledged", "Investigating", "Resolved", "Closed"}
    assert sensors.json()["data"][0]["category"] in {"Traffic", "Water", "Air"}
    assert "PDF" in reports.json()["data"][0]["formats"]


def test_copilot_query_returns_answer_and_actions() -> None:
    client = TestClient(create_app())

    response = client.post(
        "/api/v1/copilot/query",
        headers=login_as_admin(client),
        json={"question": "Show all water leaks in the last 48 hours."},
    )

    assert response.status_code == 200
    payload = response.json()["data"]
    assert payload["confidence_score"] > 0.8
    assert "water" in payload["answer"].lower()
    assert len(payload["suggested_actions"]) >= 1

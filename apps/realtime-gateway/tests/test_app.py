import sys
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
import types

from fastapi.testclient import TestClient

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

PACKAGE = types.ModuleType("src")
PACKAGE.__path__ = [str(PROJECT_ROOT / "src")]
sys.modules.setdefault("src", PACKAGE)

APP_PATH = PROJECT_ROOT / "src" / "app.py"
SPEC = spec_from_file_location("smart_city_realtime_app", APP_PATH)
assert SPEC is not None and SPEC.loader is not None
MODULE = module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)
create_app = MODULE.create_app


def test_healthcheck_returns_ok() -> None:
    client = TestClient(create_app())

    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_dashboard_websocket_echoes_messages() -> None:
    client = TestClient(create_app())

    with client.websocket_connect("/ws/v1/dashboard") as websocket:
        connected_payload = websocket.receive_json()
        assert connected_payload["type"] == "dashboard.connected"

        websocket.send_text("ping")
        echo_payload = websocket.receive_json()
        assert echo_payload["type"] == "dashboard.echo"
        assert echo_payload["message"] == "ping"


def test_dashboard_websocket_streams_operations_snapshot() -> None:
    client = TestClient(create_app())

    with client.websocket_connect("/ws/v1/dashboard") as websocket:
        websocket.receive_json()
        websocket.send_text("subscribe:operations")
        payload = websocket.receive_json()
        assert payload["type"] == "operations.snapshot"
        assert payload["active_incidents"] >= 1
        assert any(agent["name"] == "City Brain Orchestrator" for agent in payload["agents"])


def test_dashboard_websocket_streams_digital_twin_snapshot() -> None:
    client = TestClient(create_app())

    with client.websocket_connect("/ws/v1/dashboard") as websocket:
        websocket.receive_json()
        websocket.send_text("subscribe:digital-twin")
        payload = websocket.receive_json()
        assert payload["type"] == "digital_twin.snapshot"
        assert payload["historical_replay_available"] is True
        assert len(payload["layers"]) >= 2

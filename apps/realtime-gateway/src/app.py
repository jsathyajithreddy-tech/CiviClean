from datetime import UTC, datetime

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from src.config import get_settings


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=f"{settings.project_name} Realtime Gateway", version="0.1.0")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health")
    async def healthcheck() -> dict[str, str]:
        return {"status": "ok"}

    @app.websocket("/ws/v1/dashboard")
    async def dashboard_channel(websocket: WebSocket) -> None:
        await websocket.accept()
        try:
            await websocket.send_json(
                {
                    "type": "dashboard.connected",
                    "timestamp": datetime.now(UTC).isoformat(),
                    "message": "Realtime dashboard channel established.",
                }
            )
            while True:
                message = await websocket.receive_text()
                normalized = message.strip().lower()
                if normalized == "subscribe:operations":
                    await websocket.send_json(
                        {
                            "type": "operations.snapshot",
                            "timestamp": datetime.now(UTC).isoformat(),
                            "agents": [
                                {
                                    "name": "City Brain Orchestrator",
                                    "status": "active",
                                    "confidence_score": 0.94,
                                },
                                {
                                    "name": "Traffic Agent",
                                    "status": "watch",
                                    "confidence_score": 0.93,
                                },
                            ],
                            "headline": "Heavy rainfall predicted in 18 minutes with correlated corridor and drainage risk.",
                            "active_incidents": 2,
                        }
                    )
                    continue
                if normalized == "subscribe:digital-twin":
                    await websocket.send_json(
                        {
                            "type": "digital_twin.snapshot",
                            "timestamp": datetime.now(UTC).isoformat(),
                            "layers": [
                                {"id": "roads", "status": "active"},
                                {"id": "water", "status": "watch"},
                                {"id": "power", "status": "watch"},
                            ],
                            "simulations": 2,
                            "historical_replay_available": True,
                        }
                    )
                    continue
                await websocket.send_json(
                    {
                        "type": "dashboard.echo",
                        "timestamp": datetime.now(UTC).isoformat(),
                        "message": message,
                    }
                )
        except WebSocketDisconnect:
            return

    return app

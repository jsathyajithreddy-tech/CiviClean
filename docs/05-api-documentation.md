# API Documentation

## API Style

- Primary style: REST over HTTPS
- Real-time style: WebSocket
- Payload format: JSON
- Authentication: Bearer JWT for user APIs, API key for service APIs where approved
- Versioning: `/api/v1`

## Authentication Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/auth/login` | Authenticate user and issue tokens |
| `POST` | `/api/v1/auth/refresh` | Refresh access token |
| `POST` | `/api/v1/auth/logout` | Revoke current session |
| `GET` | `/api/v1/auth/me` | Retrieve current user profile |
| `POST` | `/api/v1/auth/api-keys` | Create service API key |
| `GET` | `/api/v1/auth/api-keys` | List service API keys |
| `DELETE` | `/api/v1/auth/api-keys/{keyId}` | Revoke API key |

## User and Admin Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/users` | List users |
| `POST` | `/api/v1/users` | Create user |
| `GET` | `/api/v1/users/{userId}` | Get user |
| `PATCH` | `/api/v1/users/{userId}` | Update user |
| `POST` | `/api/v1/users/{userId}/roles` | Assign roles |
| `GET` | `/api/v1/admin/agents` | List agents and status |
| `POST` | `/api/v1/admin/agents/{agentId}/restart` | Restart agent |
| `GET` | `/api/v1/admin/datasets` | List datasets |
| `POST` | `/api/v1/admin/datasets` | Register dataset |
| `POST` | `/api/v1/admin/datasets/{datasetId}/ingest` | Trigger ingestion |
| `GET` | `/api/v1/admin/audit-logs` | Search audit logs |

## City Topology Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/city/zones` | List zones |
| `POST` | `/api/v1/city/zones` | Create zone |
| `GET` | `/api/v1/city/assets` | List assets |
| `POST` | `/api/v1/city/assets` | Create asset |
| `GET` | `/api/v1/city/sensors` | List sensors |
| `POST` | `/api/v1/city/sensors` | Register sensor |

## Domain Data Endpoints

### Traffic

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/traffic/readings` | Query traffic telemetry |
| `GET` | `/api/v1/traffic/incidents` | List traffic incidents |
| `POST` | `/api/v1/traffic/incidents` | Create traffic incident |
| `GET` | `/api/v1/traffic/predictions` | Get congestion predictions |
| `POST` | `/api/v1/traffic/agent/runs` | Trigger traffic agent |

### Waste

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/waste/readings` | Query smart bin telemetry |
| `GET` | `/api/v1/waste/predictions` | Get overflow predictions |
| `POST` | `/api/v1/waste/agent/runs` | Trigger waste agent |

### Water

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/water/readings` | Query water telemetry |
| `GET` | `/api/v1/water/anomalies` | List leak or shortage anomalies |
| `GET` | `/api/v1/water/predictions` | Get shortage predictions |
| `POST` | `/api/v1/water/agent/runs` | Trigger water agent |

### Energy

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/energy/readings` | Query energy telemetry |
| `GET` | `/api/v1/energy/predictions` | Get overload predictions |
| `POST` | `/api/v1/energy/agent/runs` | Trigger energy agent |

### Air Quality

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/air-quality/readings` | Query AQI telemetry |
| `GET` | `/api/v1/air-quality/predictions` | Get pollution forecasts |
| `POST` | `/api/v1/air-quality/agent/runs` | Trigger air quality agent |

### Emergency

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/emergencies` | List active emergencies |
| `POST` | `/api/v1/emergencies` | Create emergency record |
| `GET` | `/api/v1/emergencies/{emergencyId}/routes` | Get recommended response routes |
| `POST` | `/api/v1/emergency/agent/runs` | Trigger emergency agent |

## Coordinator and Decision Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/city-brain/runs` | Trigger coordinator cycle |
| `GET` | `/api/v1/city-brain/decisions` | List decisions |
| `GET` | `/api/v1/city-brain/decisions/{decisionId}` | Get decision detail |
| `POST` | `/api/v1/city-brain/decisions/{decisionId}/approve` | Approve recommendation |
| `POST` | `/api/v1/city-brain/decisions/{decisionId}/reject` | Reject recommendation |
| `GET` | `/api/v1/city-brain/explanations/{decisionId}` | Get explainability record |

## Alerts and Notifications

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/alerts` | List alerts |
| `GET` | `/api/v1/alerts/{alertId}` | Get alert |
| `POST` | `/api/v1/alerts/{alertId}/acknowledge` | Acknowledge alert |
| `POST` | `/api/v1/alerts/{alertId}/resolve` | Resolve alert |
| `GET` | `/api/v1/notifications` | List notifications |

## Analytics Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/analytics/kpis` | Retrieve dashboard KPIs |
| `GET` | `/api/v1/analytics/charts/{chartKey}` | Retrieve chart data |
| `GET` | `/api/v1/analytics/heatmaps/{layer}` | Retrieve map heatmap layer |
| `GET` | `/api/v1/analytics/trends` | Retrieve historical trends |
| `GET` | `/api/v1/analytics/performance/agents` | Agent performance metrics |

## Simulation Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/simulation/scenarios` | Create simulation scenario |
| `GET` | `/api/v1/simulation/scenarios` | List scenarios |
| `POST` | `/api/v1/simulation/scenarios/{scenarioId}/start` | Start scenario |
| `POST` | `/api/v1/simulation/scenarios/{scenarioId}/stop` | Stop scenario |
| `GET` | `/api/v1/simulation/scenarios/{scenarioId}/state` | Fetch simulation state |

## WebSocket Channels

| Channel | Purpose |
| --- | --- |
| `/ws/v1/dashboard` | Global live dashboard metrics and alert stream |
| `/ws/v1/agents` | Agent runs, logs, and collaboration messages |
| `/ws/v1/incidents` | Emergency and incident updates |
| `/ws/v1/notifications` | User-specific notification feed |
| `/ws/v1/map` | Map overlay live refresh |

## Common Response Envelope

```json
{
  "data": {},
  "meta": {
    "request_id": "b95ab3a0-cf8e-4aad-bdfc-765d2f986f8b",
    "timestamp": "2026-07-08T10:30:00Z",
    "version": "v1"
  },
  "error": null
}
```

## Example Coordinator Decision Response

```json
{
  "data": {
    "decision_id": "8f83056e-9ae2-43b9-84e6-7d77a3b6c021",
    "decision_type": "cross_domain_incident_response",
    "severity": "high",
    "summary": "Traffic diversion and emergency corridor activation recommended for Sector 4.",
    "recommended_actions": [
      {
        "action_type": "traffic_signal_override",
        "priority": 1,
        "target_zone_id": "9f9ab647-3d96-43a5-b3b0-61977652bb3f"
      },
      {
        "action_type": "dispatch_water_inspection_unit",
        "priority": 2,
        "target_zone_id": "9f9ab647-3d96-43a5-b3b0-61977652bb3f"
      }
    ],
    "explanation": {
      "observations": [
        "Water pressure dropped 22% in the last 15 minutes.",
        "Traffic congestion is trending upward near the incident corridor."
      ],
      "tradeoffs": [
        "Signal override may increase congestion in adjacent zone for 12 to 18 minutes."
      ],
      "confidence_score": 0.91
    }
  },
  "meta": {
    "request_id": "b95ab3a0-cf8e-4aad-bdfc-765d2f986f8b",
    "timestamp": "2026-07-08T10:30:00Z",
    "version": "v1"
  },
  "error": null
}
```

## Error Model

| Code | Meaning |
| --- | --- |
| `AUTH_001` | Invalid credentials |
| `AUTH_002` | Token expired |
| `AUTH_003` | Forbidden |
| `VAL_001` | Validation error |
| `RES_404` | Resource not found |
| `AGENT_409` | Agent run conflict |
| `LLM_502` | Provider unavailable |
| `SYS_500` | Internal server error |

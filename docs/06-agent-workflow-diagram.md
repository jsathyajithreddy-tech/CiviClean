# Agent Workflow Diagram

## Core Workflow

```mermaid
flowchart TD
    A[Telemetry / Simulation Inputs] --> B[Validation and Normalization]
    B --> C[Domain Event Bus]

    C --> T[Traffic Agent]
    C --> W[Waste Agent]
    C --> WA[Water Agent]
    C --> E[Energy Agent]
    C --> AQ[Air Quality Agent]
    C --> EM[Emergency Agent]

    T --> T1[Traffic Memory]
    W --> W1[Waste Memory]
    WA --> WA1[Water Memory]
    E --> E1[Energy Memory]
    AQ --> AQ1[Air Memory]
    EM --> EM1[Emergency Memory]

    T --> TO[Structured Output]
    W --> WO[Structured Output]
    WA --> WAO[Structured Output]
    E --> EO[Structured Output]
    AQ --> AQO[Structured Output]
    EM --> EMO[Structured Output]

    TO --> COLLAB[Agent Collaboration Layer]
    WO --> COLLAB
    WAO --> COLLAB
    EO --> COLLAB
    AQO --> COLLAB
    EMO --> COLLAB

    COLLAB --> COORD[Coordinator Agent]
    COORD --> RETRIEVE[Retrieve Memory and Policies]
    RETRIEVE --> LLM[Structured LLM Reasoning]
    LLM --> DECISION[Decision Recommendation]
    DECISION --> ALERT[Alert / Notification / Workflow Actions]
    DECISION --> DASH[Realtime Dashboard]
    DECISION --> HISTORY[Decision History and Audit]
```

## Agent Execution Lifecycle

```mermaid
sequenceDiagram
    participant Ingest as Ingestion/Simulation
    participant Bus as RabbitMQ Event Bus
    participant Agent as Domain Agent
    participant Chroma as Chroma Memory
    participant Redis as Redis Cache
    participant PG as PostgreSQL
    participant Coord as Coordinator Agent
    participant UI as Web Dashboard

    Ingest->>Bus: Publish normalized event
    Bus->>Agent: Deliver domain event
    Agent->>Redis: Load recent context
    Agent->>Chroma: Retrieve semantic memory
    Agent->>Agent: Analyze and score scenario
    Agent->>PG: Store run, logs, output
    Agent->>Bus: Publish structured output
    Bus->>Coord: Deliver agent outputs
    Coord->>Redis: Load shared state
    Coord->>Chroma: Retrieve historical decisions
    Coord->>Coord: Compose cross-domain context
    Coord->>PG: Persist decision record
    Coord->>Bus: Publish decision event
    Bus->>UI: Stream live update through gateway
```

## Standard Agent Output Contract

```json
{
  "agent_name": "traffic_management_agent",
  "run_id": "uuid",
  "scenario_id": "uuid",
  "status": "completed",
  "observations": [
    {
      "type": "congestion_hotspot",
      "zone_id": "uuid",
      "severity": "high",
      "confidence": 0.93
    }
  ],
  "predictions": [
    {
      "metric": "congestion_index",
      "forecast_horizon_minutes": 30,
      "predicted_value": 0.82
    }
  ],
  "recommended_actions": [
    {
      "action_type": "reroute_traffic",
      "priority": 1,
      "reason": "accident spillover risk"
    }
  ],
  "requested_collaboration": [
    {
      "target_agent": "emergency_response_agent",
      "question": "Confirm emergency corridor constraints for Sector 4."
    }
  ],
  "explanation": {
    "summary": "Congestion is accelerating near the northern arterial corridor.",
    "confidence_score": 0.93
  }
}
```

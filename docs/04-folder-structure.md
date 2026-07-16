# Proposed Folder Structure

```text
agentic-smart-city-brain/
├── docs/
│   ├── 01-srs.md
│   ├── 02-high-level-architecture.md
│   ├── 03-database-er-diagram.md
│   ├── 04-folder-structure.md
│   ├── 05-api-documentation.md
│   ├── 06-agent-workflow-diagram.md
│   ├── 07-ui-wireframes.md
│   └── 08-development-roadmap.md
├── apps/
│   ├── web/
│   │   ├── public/
│   │   └── src/
│   │       ├── app/
│   │       │   ├── router/
│   │       │   ├── providers/
│   │       │   └── store/
│   │       ├── components/
│   │       │   ├── ui/
│   │       │   ├── layout/
│   │       │   ├── charts/
│   │       │   ├── maps/
│   │       │   └── domain/
│   │       ├── features/
│   │       │   ├── auth/
│   │       │   ├── dashboard/
│   │       │   ├── traffic/
│   │       │   ├── waste/
│   │       │   ├── water/
│   │       │   ├── energy/
│   │       │   ├── air-quality/
│   │       │   ├── emergency/
│   │       │   ├── city-brain/
│   │       │   ├── analytics/
│   │       │   ├── admin/
│   │       │   └── profile/
│   │       ├── hooks/
│   │       ├── lib/
│   │       ├── services/
│   │       ├── types/
│   │       ├── styles/
│   │       └── test/
│   ├── api-gateway/
│   │   ├── src/
│   │   │   ├── presentation/
│   │   │   ├── application/
│   │   │   ├── domain/
│   │   │   ├── infrastructure/
│   │   │   └── bootstrap/
│   │   └── tests/
│   └── realtime-gateway/
│       ├── src/
│       └── tests/
├── services/
│   ├── identity-service/
│   ├── city-core-service/
│   ├── simulation-service/
│   ├── alerts-service/
│   ├── analytics-service/
│   ├── admin-service/
│   ├── traffic-agent-service/
│   ├── waste-agent-service/
│   ├── water-agent-service/
│   ├── energy-agent-service/
│   ├── air-agent-service/
│   ├── emergency-agent-service/
│   └── coordinator-agent-service/
│       ├── src/
│       │   ├── presentation/
│       │   ├── application/
│       │   ├── domain/
│       │   ├── infrastructure/
│       │   └── bootstrap/
│       └── tests/
├── packages/
│   ├── shared-kernel/
│   │   ├── src/
│   │   │   ├── contracts/
│   │   │   ├── enums/
│   │   │   ├── events/
│   │   │   ├── schemas/
│   │   │   └── utils/
│   ├── design-system/
│   ├── config/
│   ├── observability/
│   └── sdk/
├── infra/
│   ├── docker/
│   ├── compose/
│   ├── nginx/
│   ├── postgres/
│   ├── rabbitmq/
│   ├── redis/
│   ├── chroma/
│   ├── scripts/
│   └── monitoring/
├── migrations/
│   └── alembic/
├── datasets/
│   ├── raw/
│   ├── processed/
│   ├── scenarios/
│   └── seeds/
├── tests/
│   ├── contract/
│   ├── integration/
│   ├── performance/
│   ├── security/
│   └── e2e/
├── .github/
│   └── workflows/
├── .env.example
├── docker-compose.yml
├── Makefile
├── pyproject.toml
├── package.json
└── README.md
```

## Structure Rationale

- `apps/` contains externally facing applications.
- `services/` contains independently deployable domain services.
- `packages/` contains reusable shared modules and design system assets.
- `infra/` centralizes deployment, local environment, and platform config.
- `datasets/` is isolated for simulation and ingestion workflows.
- `tests/` captures cross-service verification that does not belong to one service.

## Per-Service Internal Layout

```text
service-name/
├── src/
│   ├── presentation/
│   │   ├── api/
│   │   ├── schemas/
│   │   └── websocket/
│   ├── application/
│   │   ├── commands/
│   │   ├── queries/
│   │   ├── handlers/
│   │   ├── dto/
│   │   └── services/
│   ├── domain/
│   │   ├── entities/
│   │   ├── value_objects/
│   │   ├── repositories/
│   │   ├── policies/
│   │   └── events/
│   ├── infrastructure/
│   │   ├── db/
│   │   ├── cache/
│   │   ├── messaging/
│   │   ├── llm/
│   │   ├── vector_store/
│   │   └── observability/
│   └── bootstrap/
│       ├── config.py
│       ├── container.py
│       └── app.py
├── tests/
│   ├── unit/
│   ├── integration/
│   └── api/
└── Dockerfile
```

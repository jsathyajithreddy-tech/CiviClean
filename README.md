# Agentic Smart City Brain

This repository contains the enterprise planning pack plus the initial production foundation for Agentic Smart City Brain.

## Planning Documents

- [Software Requirements Specification](docs/01-srs.md)
- [High-Level Architecture](docs/02-high-level-architecture.md)
- [Database ER Diagram](docs/03-database-er-diagram.md)
- [Folder Structure](docs/04-folder-structure.md)
- [API Documentation](docs/05-api-documentation.md)
- [Agent Workflow Diagram](docs/06-agent-workflow-diagram.md)
- [UI Wireframes](docs/07-ui-wireframes.md)
- [Development Roadmap](docs/08-development-roadmap.md)

## Foundation Layer

The repository now includes:

- a typed FastAPI API gateway in `apps/api-gateway`
- a typed FastAPI realtime gateway in `apps/realtime-gateway`
- a React dashboard shell in `apps/web`
- SQLAlchemy and Alembic foundation wiring for backend persistence
- a shared kernel package for reusable event primitives
- Docker Compose orchestration for local infrastructure
- GitHub Actions CI scaffolding
- root developer tooling and environment configuration

## Local Startup

1. Copy `.env.example` to `.env`.
2. Install backend and frontend dependencies.
3. Start infrastructure with `docker compose up --build`.
4. Visit the web app on `http://localhost:3000`.

## Next Step

The next implementation slice should convert the in-memory identity layer to persistent SQL-backed repositories and then continue with city core and simulation modules.

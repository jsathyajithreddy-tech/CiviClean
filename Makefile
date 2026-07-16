SHELL := /bin/zsh

.PHONY: install-web install-api install-realtime dev-web dev-api dev-realtime lint test tree

install-web:
	cd apps/web && npm install

install-api:
	cd apps/api-gateway && python3 -m pip install -e ".[dev]"

install-realtime:
	cd apps/realtime-gateway && python3 -m pip install -e ".[dev]"

dev-web:
	cd apps/web && npm run dev -- --host 0.0.0.0 --port 3000

dev-api:
	cd apps/api-gateway && uvicorn src.bootstrap.app:create_app --factory --host 0.0.0.0 --port 8000 --reload

dev-realtime:
	cd apps/realtime-gateway && uvicorn src.app:create_app --factory --host 0.0.0.0 --port 8010 --reload

lint:
	cd apps/api-gateway && python3 -m ruff check src tests
	cd apps/realtime-gateway && python3 -m ruff check src tests
	cd apps/web && npm run lint

test:
	cd apps/api-gateway && pytest
	cd apps/realtime-gateway && pytest

tree:
	find . -maxdepth 3 | sort

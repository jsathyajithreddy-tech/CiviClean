from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.bootstrap.config import get_settings
from src.bootstrap.container import Container
from src.presentation.api.routes import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    initializer = app.container.database_initializer()  # type: ignore[attr-defined]
    await initializer.initialize()
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    container = Container()

    app = FastAPI(
        title=settings.project_name,
        version="0.1.0",
        docs_url=f"{settings.api_prefix}/docs",
        openapi_url=f"{settings.api_prefix}/openapi.json",
        lifespan=lifespan,
    )
    app.container = container  # type: ignore[attr-defined]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(router, prefix=settings.api_prefix)
    return app


app = create_app()

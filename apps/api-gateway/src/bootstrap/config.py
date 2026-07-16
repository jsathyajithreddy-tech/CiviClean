from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    project_name: str = Field(default="Agentic Smart City Brain", alias="PROJECT_NAME")
    environment: str = Field(default="development", alias="ENVIRONMENT")
    api_host: str = Field(default="0.0.0.0", alias="API_HOST")
    api_port: int = Field(default=8000, alias="API_PORT")
    api_prefix: str = Field(default="/api/v1", alias="API_PREFIX")
    jwt_secret_key: str = Field(
        default="change-this-in-production-to-a-long-random-secret",
        alias="JWT_SECRET_KEY",
    )
    jwt_issuer: str = Field(default="agentic-smart-city-brain", alias="JWT_ISSUER")
    access_token_ttl_minutes: int = Field(default=30, alias="ACCESS_TOKEN_TTL_MINUTES")
    refresh_token_ttl_minutes: int = Field(default=10080, alias="REFRESH_TOKEN_TTL_MINUTES")
    cors_allowed_origins: str = Field(
        default="http://localhost:3000,http://127.0.0.1:3000",
        alias="CORS_ALLOWED_ORIGINS",
    )
    database_url_override: str | None = Field(default=None, alias="DATABASE_URL")
    postgres_db: str = Field(default="smart_city", alias="POSTGRES_DB")
    postgres_user: str = Field(default="smart_city", alias="POSTGRES_USER")
    postgres_password: str = Field(default="smart_city", alias="POSTGRES_PASSWORD")
    postgres_host: str = Field(default="postgres", alias="POSTGRES_HOST")
    postgres_port: int = Field(default=5432, alias="POSTGRES_PORT")
    redis_host: str = Field(default="redis", alias="REDIS_HOST")
    redis_port: int = Field(default=6379, alias="REDIS_PORT")
    rabbitmq_host: str = Field(default="rabbitmq", alias="RABBITMQ_HOST")
    rabbitmq_port: int = Field(default=5672, alias="RABBITMQ_PORT")
    chroma_host: str = Field(default="chromadb", alias="CHROMA_HOST")
    chroma_port: int = Field(default=8001, alias="CHROMA_PORT")
    weather_api_base_url: str | None = Field(default=None, alias="WEATHER_API_BASE_URL")
    weather_api_key: str | None = Field(default=None, alias="WEATHER_API_KEY")
    weather_latitude: float | None = Field(default=None, alias="WEATHER_LATITUDE")
    weather_longitude: float | None = Field(default=None, alias="WEATHER_LONGITUDE")
    aqi_api_base_url: str | None = Field(default=None, alias="AQI_API_BASE_URL")
    aqi_api_key: str | None = Field(default=None, alias="AQI_API_KEY")
    traffic_api_base_url: str | None = Field(default=None, alias="TRAFFIC_API_BASE_URL")
    traffic_api_key: str | None = Field(default=None, alias="TRAFFIC_API_KEY")

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_allowed_origins.split(",") if origin.strip()]

    @property
    def database_url(self) -> str:
        if self.database_url_override:
            return self.database_url_override
        return (
            "postgresql+asyncpg://"
            f"{self.postgres_user}:{self.postgres_password}@"
            f"{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()

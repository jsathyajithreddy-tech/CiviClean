FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY apps/realtime-gateway/pyproject.toml ./pyproject.toml
COPY apps/realtime-gateway/src ./src

RUN pip install --no-cache-dir .

EXPOSE 8010

CMD ["uvicorn", "src.app:create_app", "--factory", "--host", "0.0.0.0", "--port", "8010"]

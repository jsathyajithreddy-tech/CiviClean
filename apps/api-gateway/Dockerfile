FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY apps/api-gateway/pyproject.toml ./pyproject.toml
COPY apps/api-gateway/src ./src

RUN pip install --no-cache-dir .

EXPOSE 8000

CMD ["uvicorn", "src.bootstrap.app:create_app", "--factory", "--host", "0.0.0.0", "--port", "8000"]


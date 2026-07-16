from dataclasses import dataclass

from src.application.dto.operations_dto import CopilotResponseDto
from src.domain.repositories.operations_repository import OperationsRepository


@dataclass(frozen=True, slots=True)
class AskCopilotCommandInput:
    question: str


class AskCopilotCommand:
    def __init__(self, repository: OperationsRepository) -> None:
        self._repository = repository

    async def execute(self, payload: AskCopilotCommandInput) -> CopilotResponseDto:
        response = await self._repository.ask_copilot(payload.question)
        return CopilotResponseDto(
            question=response.question,
            answer=response.answer,
            markdown_answer=response.markdown_answer,
            confidence_score=response.confidence_score,
            cited_domains=response.cited_domains,
            suggested_actions=response.suggested_actions,
            suggested_prompts=response.suggested_prompts,
            reasoning=response.reasoning,
            sources=[
                {
                    "label": source.label,
                    "kind": source.kind,
                    "freshness": source.freshness,
                    "confidence_score": source.confidence_score,
                }
                for source in response.sources
            ],
            chart=(
                {
                    "title": response.chart.title,
                    "unit": response.chart.unit,
                    "points": [
                        {
                            "label": point.label,
                            "value": point.value,
                            "lower_bound": point.lower_bound,
                            "upper_bound": point.upper_bound,
                        }
                        for point in response.chart.points
                    ],
                }
                if response.chart
                else None
            ),
            generated_at=response.generated_at,
        )

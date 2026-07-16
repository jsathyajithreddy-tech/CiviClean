from src.application.dto.operations_dto import (
    AgentDecisionDto,
    AgentRecommendationDto,
    AgentResourceUsageDto,
    DomainAgentDto,
)
from src.domain.repositories.operations_repository import OperationsRepository


class ListAgentsQuery:
    def __init__(self, repository: OperationsRepository) -> None:
        self._repository = repository

    async def execute(self) -> list[DomainAgentDto]:
        agents = await self._repository.list_agents()
        return [
            DomainAgentDto(
                name=agent.name,
                domain=agent.domain,
                status=agent.status,
                current_objective=agent.current_objective,
                anomaly=agent.anomaly,
                severity=agent.severity,
                confidence_score=agent.confidence_score,
                last_updated=agent.last_updated,
                recent_events=agent.recent_events,
                dependencies=agent.dependencies,
                reasoning=agent.reasoning,
                completed_tasks=agent.completed_tasks,
                running_tasks=agent.running_tasks,
                resource_usage=AgentResourceUsageDto(
                    cpu_percent=agent.resource_usage.cpu_percent,
                    memory_percent=agent.resource_usage.memory_percent,
                    active_workflows=agent.resource_usage.active_workflows,
                    tokens_last_hour=agent.resource_usage.tokens_last_hour,
                ),
                last_decision=AgentDecisionDto(
                    summary=agent.last_decision.summary,
                    impact=agent.last_decision.impact,
                    decided_at=agent.last_decision.decided_at,
                ),
                recommendation=AgentRecommendationDto(
                    summary=agent.recommendation.summary,
                    confidence_score=agent.recommendation.confidence_score,
                    rationale=agent.recommendation.rationale,
                    suggested_action=agent.recommendation.suggested_action,
                ),
            )
            for agent in agents
        ]

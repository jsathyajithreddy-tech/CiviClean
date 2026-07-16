import { Activity, Bot, ChevronRight, Download, Radio, Siren, Waves } from "lucide-react";
import { PageIntro } from "../../components/ui/page-intro";
import {
  AnimatedMetricCard,
  LoadingSkeleton,
  OperationsMap,
  SectionCard,
  StatusBadge,
} from "../../components/ui/enterprise-widgets";
import { useAgentStatus, useCityBrainBriefing, useIncidents } from "../enterprise/use-enterprise-operations";
import { usePlatform } from "../platform/platform-context";

export function DashboardPage(): JSX.Element {
  const { activeEvents, aiRecommendation, notifications, triggerQuickAction } = usePlatform();
  const { data: agents, isLoading: isAgentsLoading } = useAgentStatus();
  const { data: incidents, isLoading: isIncidentsLoading } = useIncidents();
  const { data: briefing, isLoading: isBriefingLoading } = useCityBrainBriefing();

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="City Overview"
        title="Command and coordination workspace"
        summary="A realtime control surface for multi-agent urban intelligence across traffic, utilities, environment, and incident response."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AnimatedMetricCard helper="live" metricKey="traffic" title="Traffic" />
        <AnimatedMetricCard helper="stable" metricKey="water" title="Water" />
        <AnimatedMetricCard helper="watch" metricKey="energy" title="Energy" />
        <AnimatedMetricCard helper="healthy" metricKey="air" title="Air Quality" />
        <AnimatedMetricCard helper="critical" metricKey="emergency" title="Emergencies" />
        <AnimatedMetricCard helper="rising" metricKey="reports" title="Citizen Reports" />
        <AnimatedMetricCard helper="healthy" metricKey="infrastructure" title="Infrastructure Health" />
        <AnimatedMetricCard helper="watch" metricKey="waste" title="Waste Fill Levels" />
      </section>

      <OperationsMap />

      <section className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          title="City Brain Recommendations"
          description="Flagship multi-agent decision support with confidence scoring and explainable rationale"
          action={
            <StatusBadge
              label={
                briefing ? `Confidence ${(briefing.confidence_score * 100).toFixed(0)}%` : "Analyzing"
              }
              tone="success"
            />
          }
        >
          {isBriefingLoading || !briefing ? (
            <LoadingSkeleton rows={4} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {aiRecommendation.recommended_actions.map((item) => (
                <div key={item} className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm leading-6 text-muted">
                  {item}
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Real-Time Agent Activity"
          description="Cross-domain streaming events and autonomous coordination outputs"
          action={<StatusBadge label="Auto-refresh" tone="accent" pulse />}
        >
          <div className="space-y-3">
            {(activeEvents.length > 0 ? activeEvents : [{ name: "City Brain", severity: "medium", summary: "Operational event stream is synchronizing.", started_at: "", impacts: [] }]).map((event) => (
              <div key={`${event.name}-${event.summary}`} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                <div className="flex items-start gap-3">
                  {event.name === "Heavy Rain" ? (
                    <Waves className="h-4 w-4 text-accent-300" />
                  ) : event.name === "Rush Hour" ? (
                    <Radio className="h-4 w-4 text-accent-300" />
                  ) : event.severity === "high" ? (
                    <Siren className="h-4 w-4 text-danger" />
                  ) : (
                    <Bot className="h-4 w-4 text-accent-300" />
                  )}
                  <p className="text-sm leading-6 text-muted">{event.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Incident and Agent Watch"
          description="Current high-priority incidents and the AI agents coordinating responses"
          action={<StatusBadge label="Live coordination" tone="accent" pulse />}
        >
          {isAgentsLoading || isIncidentsLoading || !agents || !incidents ? (
            <LoadingSkeleton rows={5} />
          ) : (
            <div className="space-y-3">
              {incidents.slice(0, 2).map((incident) => (
                <div key={incident.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-primary">{incident.title}</p>
                    <StatusBadge
                      label={incident.priority}
                      tone={incident.priority === "Critical" ? "danger" : "warning"}
                    />
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    {incident.location} • {incident.status} • {incident.owner}
                  </p>
                </div>
              ))}
              {agents.slice(0, 2).map((agent) => (
                <button
                  key={agent.name}
                  className="flex w-full items-start justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm text-primary transition hover:border-accent-400/30 hover:bg-accent-500/10"
                  onClick={() => triggerQuickAction(agent.recommendation.suggested_action)}
                  type="button"
                >
                  <span>
                    <span className="block font-medium">{agent.name}</span>
                    <span className="mt-2 block text-muted">{agent.recommendation.summary}</span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted" />
                </button>
              ))}
              <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                <p className="text-sm font-medium text-primary">Active alerts</p>
                <p className="mt-2 text-sm text-muted">
                  {notifications.filter((item) => !item.acknowledged).length} alerts require acknowledgement across traffic, water, and emergency domains.
                </p>
              </div>
            </div>
          )}
        </SectionCard>
      </section>
    </div>
  );
}

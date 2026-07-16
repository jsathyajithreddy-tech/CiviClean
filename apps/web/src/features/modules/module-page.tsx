import { ArrowRight, Bot, Download, Play, ShieldCheck } from "lucide-react";
import { ErrorStateCard } from "../../components/ui/error-state-card";
import { PageIntro } from "../../components/ui/page-intro";
import {
  AnimatedMetricCard,
  LoadingSkeleton,
  OperationsMap,
  SectionCard,
  Sparkline,
  StatusBadge,
} from "../../components/ui/enterprise-widgets";
import { usePlatform } from "../platform/platform-context";
import { ModuleDefinition } from "./module-config";

export function ModulePage({ module }: { module: ModuleDefinition }): JSX.Element {
  const { liveMetrics, triggerQuickAction } = usePlatform();

  if (!module) {
    return (
      <section className="space-y-6">
        <ErrorStateCard
          title="This module is unavailable"
          description="The selected workspace could not be loaded because its route configuration is missing."
        />
      </section>
    );
  }

  const metricKeys = [
    module.primaryMetricKey,
    module.secondaryMetricKey,
    module.tertiaryMetricKey,
    module.quaternaryMetricKey,
  ];
  const availableMetrics = metricKeys.map((metricKey) => ({
    metricKey,
    metric: liveMetrics[metricKey],
  }));
  const missingMetrics = availableMetrics.filter((item) => !item.metric).map((item) => item.metricKey);
  const primaryMetric = liveMetrics[module.primaryMetricKey];

  if (missingMetrics.length > 0) {
    return (
      <section className="space-y-6">
        <PageIntro eyebrow={module.eyebrow} title={module.title} summary={module.summary} />
        <ErrorStateCard
          title="This workspace is temporarily unavailable"
          description="One or more live metrics required by this page are missing. The navigation shell is still working and the issue has been contained."
          detail={`Missing metrics: ${missingMetrics.join(", ")}`}
          onAction={() => window.location.reload()}
        />
        <LoadingSkeleton rows={3} />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <PageIntro eyebrow={module.eyebrow} title={module.title} summary={module.summary} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricKeys.map((metricKey) => (
          <AnimatedMetricCard
            key={metricKey}
            helper={liveMetrics[metricKey]?.status ?? "loading"}
            metricKey={metricKey}
            title={liveMetrics[metricKey]?.label ?? metricKey}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <SectionCard
          title="Operational Workspace"
          description={module.workspaceLabel}
          action={
            <div className="flex flex-wrap gap-2">
              <button
                className="rounded-full border border-accent-400/25 bg-accent-500/10 px-4 py-2 text-sm text-accent-200 transition hover:bg-accent-500/20"
                onClick={() => triggerQuickAction(module.actionLabel)}
                type="button"
              >
                {module.actionLabel}
              </button>
              <button
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-primary transition hover:border-accent-400/25 hover:bg-white/5"
                onClick={() => triggerQuickAction(`${module.title} export pack`)}
                type="button"
              >
                Export
              </button>
            </div>
          }
        >
          <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary">Trend Window</p>
                  <p className="mt-1 text-sm text-muted">Live multi-signal telemetry across the last 35 minutes</p>
                </div>
                <StatusBadge label="Streaming" tone="accent" pulse />
              </div>
              <Sparkline points={primaryMetric?.sparkline ?? [0, 0, 0, 0, 0, 0, 0]} />
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {module.assets.map((asset) => (
                  <div key={asset.name} className="rounded-2xl border border-white/8 bg-surface-900/60 p-4">
                    <p className="text-sm font-medium text-primary">{asset.name}</p>
                    <p className="mt-2 text-sm leading-6 text-muted">{asset.detail}</p>
                    <div className="mt-3">
                      <StatusBadge
                        label={asset.status}
                        tone={
                          asset.status === "critical"
                            ? "danger"
                            : asset.status === "watch"
                              ? "warning"
                              : asset.status === "healthy"
                                ? "success"
                                : "accent"
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {module.workflows.map((workflow) => (
                <button
                  key={workflow}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm text-primary transition hover:border-accent-400/30 hover:bg-accent-500/10"
                  onClick={() => triggerQuickAction(workflow)}
                  type="button"
                >
                  <span>{workflow}</span>
                  <ArrowRight className="h-4 w-4 text-muted" />
                </button>
              ))}
              <div className="rounded-2xl border border-accent-400/20 bg-accent-500/10 p-4">
                <div className="flex items-center gap-3 text-primary">
                  <Bot className="h-4 w-4 text-accent-300" />
                  <p className="text-sm font-medium">AI Recommendation</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Prioritize {module.priorities[0].toLowerCase()} Confidence remains above 92%.
                </p>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Action Queue"
          description="Operator priorities, escalation cues, and execution-ready workflows"
          action={<StatusBadge label="Priority queue" tone="warning" />}
        >
          <div className="space-y-3">
            {module.priorities.map((priority, index) => (
              <div key={priority} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-primary">{priority}</p>
                  <StatusBadge label={`P${index + 1}`} tone={index === 0 ? "danger" : "accent"} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <OperationsMap title={`${module.title} GIS Dashboard`} compact />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard
          title="AI and Analyst Insights"
          description="Decision-support summaries, anomaly explanations, and operational rationale"
          action={
            <button
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-primary transition hover:border-accent-400/30 hover:bg-accent-500/10"
              onClick={() => triggerQuickAction(`Generate ${module.title} executive summary`)}
              type="button"
            >
              Generate summary
            </button>
          }
        >
          <div className="space-y-3">
            {module.insights.map((insight) => (
              <div key={insight} className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm leading-6 text-muted">
                {insight}
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Enterprise Controls"
          description="Exports, auditability, workflow triggers, and operational governance"
          action={<StatusBadge label="Ready" tone="success" />}
        >
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { label: "Run simulation", icon: <Play className="h-4 w-4" /> },
              { label: "Export PDF", icon: <Download className="h-4 w-4" /> },
              { label: "Review compliance", icon: <ShieldCheck className="h-4 w-4" /> },
              { label: "Open briefing", icon: <Bot className="h-4 w-4" /> },
            ].map((control) => (
              <button
                key={control.label}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-primary transition hover:border-accent-400/30 hover:bg-accent-500/10"
                onClick={() => triggerQuickAction(`${module.title}: ${control.label}`)}
                type="button"
              >
                <span className="flex items-center gap-3">
                  {control.icon}
                  {control.label}
                </span>
                <ArrowRight className="h-4 w-4 text-muted" />
              </button>
            ))}
          </div>
        </SectionCard>
      </div>
    </section>
  );
}

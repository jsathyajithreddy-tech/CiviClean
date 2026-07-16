import { useState } from "react";
import { BellRing, BrainCircuit, CarFront, Radio, ShieldAlert, Siren, Waves } from "lucide-react";
import { PageIntro } from "../../components/ui/page-intro";
import { LoadingSkeleton, SectionCard, StatusBadge } from "../../components/ui/enterprise-widgets";
import {
  useAuditLog,
  useCommandAction,
  useCommandTimeline,
  useOperationalKpis,
} from "../enterprise/use-enterprise-operations";
import { usePlatform } from "../platform/platform-context";
import { formatLocalTimestamp } from "../../lib/date";

const quickActions = [
  { label: "Dispatch ambulance", icon: Siren },
  { label: "Close road", icon: CarFront },
  { label: "Send alert", icon: BellRing },
  { label: "Activate drainage", icon: Waves },
  { label: "Increase signal timing", icon: Radio },
  { label: "Broadcast emergency", icon: ShieldAlert },
] as const;

export function CommandCenterPage(): JSX.Element {
  const { data: kpis, isLoading: isKpiLoading } = useOperationalKpis();
  const { data: timeline, isLoading: isTimelineLoading } = useCommandTimeline();
  const { data: auditLog, isLoading: isAuditLoading } = useAuditLog();
  const commandAction = useCommandAction();
  const { notifications, pushToast } = usePlatform();
  const [pendingCommand, setPendingCommand] = useState<string | null>(null);

  const confirmAction = async () => {
    if (!pendingCommand) {
      return;
    }
    const result = await commandAction.mutateAsync(pendingCommand);
    pushToast("Command executed", result.outcome);
    setPendingCommand(null);
  };

  return (
    <section className="space-y-6">
      <PageIntro
        eyebrow="Operator Controls"
        title="Command center"
        summary="Operator-grade quick actions, mission timeline, KPI posture, and AI auditability for live command-center execution."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isKpiLoading || !kpis ? (
          <LoadingSkeleton rows={4} />
        ) : (
          kpis.map((kpi) => (
            <SectionCard
              key={kpi.key}
              title={kpi.label}
              description={kpi.trend}
              action={<StatusBadge label={kpi.status} tone={kpi.status === "critical" ? "danger" : kpi.status === "watch" ? "warning" : "success"} />}
            >
              <p className="text-3xl font-semibold text-primary">{kpi.value}</p>
            </SectionCard>
          ))
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard
          title="Quick actions"
          description="Every action requires confirmation and updates the mission timeline"
          action={<StatusBadge label="Operator ready" tone="accent" pulse />}
        >
          <div className="grid gap-3 md:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm text-primary transition hover:border-accent-400/30 hover:bg-accent-500/10"
                  onClick={() => setPendingCommand(action.label)}
                  type="button"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {action.label}
                  </span>
                  <BrainCircuit className="h-4 w-4 text-accent-300" />
                </button>
              );
            })}
          </div>
          {pendingCommand ? (
            <div className="mt-4 rounded-2xl border border-accent-400/25 bg-accent-500/10 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-primary">Confirm `{pendingCommand}`</p>
                <div className="flex gap-2">
                  <button
                    className="rounded-full border border-white/10 px-4 py-2 text-sm text-primary"
                    onClick={() => setPendingCommand(null)}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded-full border border-accent-400/25 bg-accent-500/15 px-4 py-2 text-sm text-primary"
                    onClick={() => void confirmAction()}
                    type="button"
                  >
                    {commandAction.isPending ? "Executing..." : "Confirm action"}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
          {commandAction.data ? (
            <div className="mt-4 rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-muted">
              {commandAction.data.outcome}
            </div>
          ) : null}
        </SectionCard>

        <SectionCard
          title="Live mission timeline"
          description="Autonomous and operator-driven actions sequenced in operational order"
          action={<StatusBadge label="Streaming" tone="success" pulse />}
        >
          {isTimelineLoading || !timeline ? (
            <LoadingSkeleton rows={4} />
          ) : (
            <div className="space-y-3">
              {timeline.map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-primary">{entry.title}</p>
                      <p className="mt-2 text-sm text-muted">{entry.detail}</p>
                    </div>
                    <StatusBadge label={entry.status} tone="accent" />
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">
                    {entry.agent} • {formatLocalTimestamp(new Date(entry.timestamp))}
                  </p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard
          title="Notification pressure"
          description="Unacknowledged alerts flowing into the command floor"
          action={<StatusBadge label={`${notifications.filter((item) => !item.acknowledged).length} open`} tone="warning" />}
        >
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-primary">{notification.title}</p>
                    <p className="mt-2 text-sm text-muted">{notification.detail}</p>
                  </div>
                  <StatusBadge label={notification.severity} tone={notification.severity === "critical" ? "danger" : notification.severity === "high" ? "warning" : "accent"} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="AI audit trail"
          description="Decision-level visibility into why automated actions were recommended"
          action={<StatusBadge label="Explainable AI" tone="accent" />}
        >
          {isAuditLoading || !auditLog ? (
            <LoadingSkeleton rows={4} />
          ) : (
            <div className="space-y-3">
              {auditLog.map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-primary">{entry.decision}</p>
                    <StatusBadge label={entry.status} tone={entry.status === "pending" ? "warning" : "success"} />
                  </div>
                  <p className="mt-2 text-sm text-muted">{entry.reason}</p>
                  <p className="mt-2 text-sm text-muted">{entry.outcome}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">
                    {entry.agent} • {entry.operator} • {formatLocalTimestamp(new Date(entry.timestamp))}
                  </p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </section>
  );
}

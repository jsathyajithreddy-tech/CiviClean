import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowRightLeft, CheckCircle2, FileText, ShieldAlert, UserPlus } from "lucide-react";
import { PageIntro } from "../../components/ui/page-intro";
import { LoadingSkeleton, SectionCard, StatusBadge } from "../../components/ui/enterprise-widgets";
import { useIncidentAction, useIncidents } from "../enterprise/use-enterprise-operations";
import { usePlatform } from "../platform/platform-context";
import { formatLocalTimestamp } from "../../lib/date";

const incidentActions = [
  { label: "Assign", command: "Assign incident", icon: UserPlus },
  { label: "Escalate", command: "Escalate incident", icon: ShieldAlert },
  { label: "Transfer", command: "Transfer incident", icon: ArrowRightLeft },
  { label: "Close", command: "Close incident", icon: CheckCircle2 },
  { label: "Generate report", command: "Generate report", icon: FileText },
] as const;

export function IncidentCenterPage(): JSX.Element {
  const { data: incidents, isLoading } = useIncidents();
  const incidentAction = useIncidentAction();
  const { pushToast } = usePlatform();
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pendingCommand, setPendingCommand] = useState<string | null>(null);

  const filteredIncidents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (incidents ?? []).filter((incident) => {
      const matchesQuery =
        query.length === 0 ||
        incident.title.toLowerCase().includes(query) ||
        incident.id.toLowerCase().includes(query) ||
        incident.assigned_officer.toLowerCase().includes(query) ||
        incident.location.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "all" || incident.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesQuery && matchesStatus;
    });
  }, [incidents, search, statusFilter]);

  useEffect(() => {
    if (!selectedIncidentId && filteredIncidents[0]) {
      setSelectedIncidentId(filteredIncidents[0].id);
    }
    if (selectedIncidentId && !filteredIncidents.some((incident) => incident.id === selectedIncidentId)) {
      setSelectedIncidentId(filteredIncidents[0]?.id ?? "");
    }
  }, [filteredIncidents, selectedIncidentId]);

  const selectedIncident =
    filteredIncidents.find((incident) => incident.id === selectedIncidentId) ?? filteredIncidents[0];

  const confirmAction = async () => {
    if (!selectedIncident || !pendingCommand) {
      return;
    }
    const result = await incidentAction.mutateAsync({
      incidentId: selectedIncident.id,
      command: pendingCommand,
    });
    pushToast("Incident workflow updated", result.outcome);
    setPendingCommand(null);
  };

  return (
    <section className="space-y-6">
      <PageIntro
        eyebrow="Incident Workflow"
        title="Incident management center"
        summary="Assignment, escalation, transfer, closure, and reporting workflows with live command history and operational context."
      />

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <SectionCard
          title="Active incident board"
          description="Searchable queue with severity, ownership, and workflow posture"
          action={<StatusBadge label={`${filteredIncidents.length} incidents`} tone="warning" />}
        >
          <div className="flex flex-wrap gap-3">
            <input
              aria-label="Search incidents"
              className="min-w-[220px] flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-primary outline-none placeholder:text-muted"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search incident, officer, location..."
              value={search}
            />
            <select
              aria-label="Filter incidents by status"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-primary outline-none"
              onChange={(event) => setStatusFilter(event.target.value)}
              value={statusFilter}
            >
              <option value="all">All statuses</option>
              <option value="Investigating">Investigating</option>
              <option value="Acknowledged">Acknowledged</option>
              <option value="Assigned">Assigned</option>
              <option value="Escalated">Escalated</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          <div className="mt-4 space-y-3">
            {isLoading ? (
              <LoadingSkeleton rows={4} />
            ) : (
              filteredIncidents.map((incident) => (
                <button
                  key={incident.id}
                  className={[
                    "w-full rounded-2xl border px-4 py-4 text-left transition",
                    selectedIncident?.id === incident.id
                      ? "border-accent-400/30 bg-accent-500/10"
                      : "border-white/8 bg-white/5 hover:border-accent-400/20 hover:bg-white/7",
                  ].join(" ")}
                  onClick={() => setSelectedIncidentId(incident.id)}
                  type="button"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-primary">{incident.title}</p>
                      <p className="mt-2 text-sm text-muted">
                        {incident.id} • {incident.category} • {incident.location}
                      </p>
                    </div>
                    <StatusBadge
                      label={incident.priority}
                      tone={incident.priority === "Critical" ? "danger" : incident.priority === "High" ? "warning" : "accent"}
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <StatusBadge label={incident.status} tone="accent" />
                    <StatusBadge label={`ETA ${incident.eta_minutes}m`} tone="success" />
                  </div>
                </button>
              ))
            )}
          </div>
        </SectionCard>

        <SectionCard
          title={selectedIncident ? selectedIncident.title : "Incident details"}
          description="Operational timeline, assignment state, evidence, and resolution history"
          action={
            selectedIncident ? (
              <StatusBadge
                label={selectedIncident.status}
                tone={selectedIncident.priority === "Critical" ? "danger" : "warning"}
              />
            ) : undefined
          }
        >
          {!selectedIncident ? (
            <LoadingSkeleton rows={4} />
          ) : (
            <div className="space-y-5">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Assigned Department", value: selectedIncident.assigned_department },
                  { label: "Assigned Officer", value: selectedIncident.assigned_officer },
                  { label: "Live Location", value: selectedIncident.live_location },
                  { label: "Affected Services", value: selectedIncident.affected_services.join(", ") },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">{item.label}</p>
                    <p className="mt-2 text-sm text-primary">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                {incidentActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.command}
                      className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-primary transition hover:border-accent-400/25 hover:bg-accent-500/10"
                      onClick={() => setPendingCommand(action.command)}
                      type="button"
                    >
                      <Icon className="h-4 w-4" />
                      {action.label}
                    </button>
                  );
                })}
              </div>

              {pendingCommand ? (
                <div className="rounded-2xl border border-accent-400/25 bg-accent-500/10 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-primary">Confirm action</p>
                      <p className="mt-2 text-sm text-muted">
                        {pendingCommand} for {selectedIncident.id}.
                      </p>
                    </div>
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
                        {incidentAction.isPending ? "Executing..." : "Confirm"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <p className="text-sm font-medium text-primary">Timeline</p>
                  <div className="mt-3 space-y-3">
                    {selectedIncident.timeline.map((entry) => (
                      <div key={`${entry.timestamp}-${entry.title}`} className="rounded-xl border border-white/8 bg-surface-900/50 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm text-primary">{entry.title}</p>
                          <StatusBadge label={entry.status} tone="accent" />
                        </div>
                        <p className="mt-2 text-sm text-muted">{entry.detail}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">
                          {formatLocalTimestamp(new Date(entry.timestamp))}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <p className="text-sm font-medium text-primary">Notes and evidence</p>
                  <div className="mt-3 space-y-3">
                    {selectedIncident.comments.map((comment) => (
                      <div key={`${comment.author}-${comment.created_at}`} className="rounded-xl border border-white/8 bg-surface-900/50 p-3">
                        <p className="text-sm text-primary">{comment.author}</p>
                        <p className="mt-2 text-sm text-muted">{comment.message}</p>
                      </div>
                    ))}
                    <div className="rounded-xl border border-white/8 bg-surface-900/50 p-3">
                      <p className="text-sm text-primary">Snapshots</p>
                      <p className="mt-2 text-sm text-muted">{selectedIncident.images.join(", ") || "No evidence attached"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                <p className="text-sm font-medium text-primary">Resolution history</p>
                {selectedIncident.resolution_history.length === 0 ? (
                  <div className="mt-3 flex items-center gap-2 text-sm text-muted">
                    <AlertTriangle className="h-4 w-4" />
                    Incident remains active. No resolution steps recorded yet.
                  </div>
                ) : (
                  <div className="mt-3 space-y-3">
                    {selectedIncident.resolution_history.map((entry) => (
                      <div key={`${entry.timestamp}-${entry.summary}`} className="rounded-xl border border-white/8 bg-surface-900/50 p-3">
                        <p className="text-sm text-primary">{entry.summary}</p>
                        <p className="mt-2 text-sm text-muted">{entry.outcome}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </SectionCard>
      </div>
    </section>
  );
}

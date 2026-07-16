import { InsightList } from "../../components/ui/insight-list";
import { MetricTile } from "../../components/ui/metric-tile";
import { PageIntro } from "../../components/ui/page-intro";

interface ModuleOverviewPageProps {
  eyebrow: string;
  title: string;
  summary: string;
  primaryMetric: string;
  secondaryMetric: string;
  insights: string[];
}

export function ModuleOverviewPage({
  eyebrow,
  title,
  summary,
  primaryMetric,
  secondaryMetric,
  insights,
}: ModuleOverviewPageProps): JSX.Element {
  return (
    <section className="space-y-6">
      <PageIntro eyebrow={eyebrow} title={title} summary={summary} />

      <div className="grid gap-4 md:grid-cols-2">
        <MetricTile title="Primary Signal" value={primaryMetric} helper="live" tone="accent" />
        <MetricTile
          title="Secondary Signal"
          value={secondaryMetric}
          helper="tracked"
          tone="success"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[28px] border border-white/10 bg-surface-850/85 p-6 shadow-glow">
          <h3 className="text-lg font-semibold text-white">Operations Canvas</h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            This page is wired into the shared React app shell and ready for deeper feature work.
            The layout, route registration, animations, query-provider stack, and design tokens are
            already in place, so future domain implementation can focus on real data and workflows.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-accent-400/20 bg-accent-500/10 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-accent-300/80">Frontend Ready</p>
              <p className="mt-3 text-2xl font-semibold text-white">Module shell</p>
              <p className="mt-2 text-sm text-slate-200">
                Shared page primitives and routing are active for this domain.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Next Integration</p>
              <p className="mt-3 text-2xl font-semibold text-white">API binding</p>
              <p className="mt-2 text-sm text-slate-300">
                Domain queries, charts, maps, and realtime streams can land without changing layout structure.
              </p>
            </div>
          </div>
        </article>

        <InsightList title="Operator Insights" items={insights} />
      </div>
    </section>
  );
}


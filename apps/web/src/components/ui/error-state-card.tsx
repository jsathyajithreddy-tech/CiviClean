import { AlertTriangle, RefreshCcw } from "lucide-react";

interface ErrorStateCardProps {
  title: string;
  description: string;
  detail?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorStateCard({
  title,
  description,
  detail,
  actionLabel = "Retry",
  onAction,
}: ErrorStateCardProps): JSX.Element {
  return (
    <article className="rounded-[28px] border border-danger/20 bg-danger/10 p-6 shadow-glow backdrop-blur-xl">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl border border-danger/25 bg-danger/10 p-3 text-danger">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-primary">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
          {detail ? <p className="mt-3 text-sm leading-6 text-muted">{detail}</p> : null}
          {onAction ? (
            <button
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-primary transition hover:border-accent-400/25 hover:bg-white/10"
              onClick={onAction}
              type="button"
            >
              <RefreshCcw className="h-4 w-4" />
              {actionLabel}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

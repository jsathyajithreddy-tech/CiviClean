import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BatteryCharging,
  Bell,
  Bot,
  CheckCircle2,
  ChevronRight,
  CloudRain,
  Flame,
  Gauge,
  Leaf,
  ShieldAlert,
  Truck,
  Waves,
  Wind,
  Zap,
} from "lucide-react";
import { ReactNode, useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { usePlatform } from "../../features/platform/platform-context";
import { formatLocalTimestamp } from "../../lib/date";

type Tone = "accent" | "success" | "warning" | "danger" | "neutral";

const toneClasses: Record<Tone, string> = {
  accent: "border-accent-400/25 bg-accent-500/10 text-accent-300",
  success: "border-success/25 bg-success/10 text-success",
  warning: "border-warning/25 bg-warning/10 text-warning",
  danger: "border-danger/25 bg-danger/10 text-danger",
  neutral: "border-white/10 bg-white/5 text-slate-200",
};

export function StatusBadge({
  label,
  tone = "neutral",
  pulse = false,
}: {
  label: string;
  tone?: Tone;
  pulse?: boolean;
}): JSX.Element {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
        toneClasses[tone],
      ].join(" ")}
    >
      <span className={pulse ? "h-2 w-2 animate-pulse rounded-full bg-current" : "h-2 w-2 rounded-full bg-current"} />
      {label}
    </span>
  );
}

export function SectionCard({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}): JSX.Element {
  return (
    <article className="rounded-[28px] border border-white/10 bg-panel p-5 shadow-glow backdrop-blur-xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-primary">{title}</h3>
          {description ? <p className="mt-2 text-sm leading-6 text-muted">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </article>
  );
}

export function AnimatedMetricCard({
  title,
  metricKey,
  helper,
}: {
  title: string;
  metricKey: string;
  helper: string;
}): JSX.Element {
  const { liveMetrics } = usePlatform();
  const metric = liveMetrics[metricKey];

  if (!metric) {
    return (
      <motion.article
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[28px] border border-danger/20 bg-danger/10 p-5 shadow-glow backdrop-blur-xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted">{title}</p>
            <p className="mt-4 text-xl font-semibold text-primary">Metric unavailable</p>
          </div>
          <StatusBadge label="fallback" tone="warning" />
        </div>
        <p className="mt-4 text-sm leading-6 text-muted">
          The live metric for <span className="text-primary">{metricKey}</span> is unavailable. A route-safe fallback prevented this page from crashing.
        </p>
      </motion.article>
    );
  }

  const delta = metric.value - metric.previous;
  const percentChange = metric.previous === 0 ? 0 : (delta / metric.previous) * 100;
  const tone: Tone =
    metric.status === "critical"
      ? "danger"
      : metric.status === "watch"
        ? "warning"
        : metric.status === "healthy"
          ? "success"
          : "accent";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[28px] border border-white/10 bg-panel-elevated p-5 shadow-glow backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{title}</p>
          <div className="mt-4 flex items-end gap-3">
            <AnimatedValue
              value={metric.value}
              decimals={metric.decimals ?? 0}
              suffix={metric.unit ? ` ${metric.unit}` : ""}
            />
            <StatusBadge label={helper} tone={tone} pulse />
          </div>
        </div>
        <StatusBadge
          label={`${percentChange >= 0 ? "+" : ""}${percentChange.toFixed(1)}%`}
          tone={delta >= 0 ? "accent" : "success"}
        />
      </div>
      <div className="mt-5 flex items-center gap-3 text-sm text-muted">
        <span>{metric.previous.toFixed(metric.decimals ?? 0)} previous</span>
        <span className="text-primary">{delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(metric.decimals ?? 0)}</span>
      </div>
      <Sparkline points={metric.sparkline} tone={tone} />
      <p className="mt-3 text-xs uppercase tracking-[0.22em] text-muted">
        Updated {formatLocalTimestamp(new Date(metric.updatedAt))}
      </p>
    </motion.article>
  );
}

export function AnimatedValue({
  value,
  decimals = 0,
  suffix = "",
}: {
  value: number;
  decimals?: number;
  suffix?: string;
}): JSX.Element {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const start = displayValue;
    const end = value;
    const startedAt = performance.now();
    const duration = 500;
    let frame = 0;

    const tick = (timestamp: number) => {
      const progress = Math.min(1, (timestamp - startedAt) / duration);
      const next = start + (end - start) * progress;
      setDisplayValue(next);
      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [value]);

  return (
    <p className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">
      {displayValue.toFixed(decimals)}
      {suffix}
    </p>
  );
}

export function Sparkline({
  points,
  tone = "accent",
  height = 72,
}: {
  points: number[];
  tone?: Tone;
  height?: number;
}): JSX.Element {
  const { path, area } = useMemo(() => {
    const max = Math.max(...points);
    const min = Math.min(...points);
    const width = 220;
    const safeRange = Math.max(1, max - min);
    const coordinates = points.map((point, index) => {
      const x = (index / Math.max(1, points.length - 1)) * width;
      const y = height - ((point - min) / safeRange) * (height - 10) - 5;
      return [x, y] as const;
    });
    const line = coordinates.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
    const fill = `${line} L ${width} ${height} L 0 ${height} Z`;
    return { path: line, area: fill };
  }, [height, points]);

  const stroke =
    tone === "danger"
      ? "#ff6b6b"
      : tone === "success"
        ? "#45d483"
        : tone === "warning"
          ? "#f7b955"
          : "#37d6d4";

  return (
    <svg className="mt-4 h-[72px] w-full" viewBox={`0 0 220 ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`spark-${tone}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${tone})`} />
      <path d={path} fill="none" stroke={stroke} strokeLinecap="round" strokeWidth="3" />
    </svg>
  );
}

export function LoadingSkeleton({ rows = 3 }: { rows?: number }): JSX.Element {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="h-16 animate-pulse rounded-2xl border border-white/10 bg-white/5"
        />
      ))}
    </div>
  );
}

export function ToastViewport(): JSX.Element {
  const { toasts, dismissToast } = usePlatform();
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-50 space-y-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="pointer-events-auto w-[320px] rounded-3xl border border-white/10 bg-panel p-4 shadow-glow backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-primary">{toast.title}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{toast.detail}</p>
              </div>
              <button
                className="rounded-full border border-white/10 px-2 py-1 text-xs text-muted transition hover:border-accent-400/30 hover:text-primary"
                onClick={() => dismissToast(toast.id)}
                type="button"
              >
                Close
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function CommandPalette(): JSX.Element {
  const {
    commandPaletteOpen,
    globalSearchResults,
    searchQuery,
    setSearchQuery,
    toggleCommandPalette,
    triggerQuickAction,
  } = usePlatform();

  return (
    <AnimatePresence>
      {commandPaletteOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-surface-950/70 p-4 backdrop-blur-md"
          onClick={() => toggleCommandPalette(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="mx-auto mt-16 max-w-2xl rounded-[32px] border border-white/10 bg-panel p-5 shadow-glow"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <input
                aria-label="Global search"
                autoFocus
                className="w-full border-0 bg-transparent text-base text-primary outline-none placeholder:text-muted"
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search routes, modules, workflows, and settings"
                value={searchQuery}
              />
            </div>
            <div className="mt-4 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-2">
                {globalSearchResults.map((result) => (
                  <Link
                    key={result.path}
                    className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-primary transition hover:border-accent-400/30 hover:bg-accent-500/10"
                    onClick={() => toggleCommandPalette(false)}
                    to={result.path}
                  >
                    <span>{result.label}</span>
                    <span className="flex items-center gap-2 text-muted">
                      {result.badge ? <StatusBadge label={result.badge} tone="accent" /> : null}
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </Link>
                ))}
              </div>
              <div className="space-y-2">
                {["Dispatch emergency corridor", "Generate daily briefing", "Run leak response playbook"].map(
                  (action) => (
                    <button
                      key={action}
                      className="flex w-full items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-left text-sm text-primary transition hover:border-accent-400/30 hover:bg-accent-500/10"
                      onClick={() => {
                        triggerQuickAction(action);
                        toggleCommandPalette(false);
                      }}
                      type="button"
                    >
                      <span>{action}</span>
                      <Bot className="h-4 w-4 text-accent-300" />
                    </button>
                  ),
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function NotificationCenter(): JSX.Element {
  const { notificationCenterOpen, notifications, acknowledgeNotification, toggleNotificationCenter } =
    usePlatform();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const visibleNotifications = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();
    return notifications.filter((notification) => {
      const matchesFilter = filter === "all" || notification.severity === filter;
      const matchesSearch =
        query.length === 0 ||
        notification.title.toLowerCase().includes(query) ||
        notification.detail.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [deferredSearch, filter, notifications]);

  return (
    <AnimatePresence>
      {notificationCenterOpen ? (
        <motion.aside
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          className="fixed right-4 top-20 z-30 w-[360px] rounded-[28px] border border-white/10 bg-panel p-5 shadow-glow backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-primary">Notification Center</h3>
            <button
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted transition hover:text-primary"
              onClick={() => toggleNotificationCenter(false)}
              type="button"
            >
              Close
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <input
              aria-label="Search notifications"
              className="min-w-[180px] flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-primary outline-none placeholder:text-muted"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search alerts..."
              value={search}
            />
            <select
              aria-label="Filter notifications by severity"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-primary outline-none"
              onChange={(event) => setFilter(event.target.value)}
              value={filter}
            >
              <option value="all">All severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="mt-5 space-y-3">
            {visibleNotifications.map((notification) => (
              <div key={notification.id} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-primary">{notification.title}</p>
                    <p className="mt-2 text-sm leading-6 text-muted">{notification.detail}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted">
                      {formatLocalTimestamp(new Date(notification.timestamp))}
                    </p>
                  </div>
                  <StatusBadge
                    label={notification.severity}
                    tone={
                      notification.severity === "critical"
                        ? "danger"
                        : notification.severity === "high"
                          ? "warning"
                          : notification.severity === "medium"
                            ? "accent"
                            : "success"
                    }
                  />
                </div>
                <button
                  className="mt-4 rounded-full border border-white/10 px-3 py-1 text-xs text-primary transition hover:border-accent-400/30 hover:bg-accent-500/10"
                  disabled={notification.acknowledged}
                  onClick={() => acknowledgeNotification(notification.id)}
                  type="button"
                >
                  {notification.acknowledged ? "Acknowledged" : "Acknowledge"}
                </button>
              </div>
            ))}
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}

export function OperationsMap({
  title = "Live City Map",
  compact = false,
}: {
  title?: string;
  compact?: boolean;
}): JSX.Element {
  const { mapUnits, triggerQuickAction, weather } = usePlatform();
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(mapUnits[0]?.id ?? null);
  const selectedAsset = mapUnits.find((unit) => unit.id === selectedAssetId) ?? mapUnits[0];

  const unitIcon = (type: string) => {
    switch (type) {
      case "ambulance":
        return <Activity className="h-3.5 w-3.5" />;
      case "police":
        return <ShieldAlert className="h-3.5 w-3.5" />;
      case "fire":
        return <Flame className="h-3.5 w-3.5" />;
      case "waste":
        return <Truck className="h-3.5 w-3.5" />;
      case "water":
        return <Waves className="h-3.5 w-3.5" />;
      case "energy":
        return <Zap className="h-3.5 w-3.5" />;
      case "sensor":
        return <Leaf className="h-3.5 w-3.5" />;
      case "drone":
        return <Wind className="h-3.5 w-3.5" />;
      default:
        return <Gauge className="h-3.5 w-3.5" />;
    }
  };

  return (
    <SectionCard
      title={title}
      description="Heat overlays, moving field units, sensor clusters, and response corridors are being streamed into the same operational canvas."
      action={
        <div className="flex flex-wrap gap-2">
          <StatusBadge label="Traffic heatmap" tone="danger" />
          <StatusBadge label="Weather radar" tone="accent" />
          <button
            className="rounded-full border border-white/10 px-3 py-1 text-xs text-primary transition hover:border-accent-400/30 hover:bg-accent-500/10"
            onClick={() => triggerQuickAction("Focused incident zoom")}
            type="button"
          >
            Focus incident
          </button>
        </div>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[1fr_260px]">
        <div className={compact ? "relative h-[320px] overflow-hidden rounded-[24px] border border-white/10 bg-map" : "relative h-[420px] overflow-hidden rounded-[24px] border border-white/10 bg-map"}>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute inset-0 opacity-80">
            <div className="absolute left-[15%] top-[54%] h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(255,107,107,0.88),rgba(255,107,107,0.14),transparent_72%)]" />
            <div className="absolute left-[48%] top-[28%] h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(247,185,85,0.84),rgba(247,185,85,0.16),transparent_74%)]" />
            <div className="absolute left-[58%] top-[46%] h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(55,214,212,0.72),rgba(55,214,212,0.12),transparent_72%)]" />
            <div className="absolute left-[24%] top-[18%] h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(69,212,131,0.75),rgba(69,212,131,0.12),transparent_72%)]" />
          </div>
          <div className="absolute left-[10%] top-[70%] h-2 w-[78%] rotate-[-18deg] rounded-full bg-accent-400/20" />
          <div className="absolute left-[12%] top-[32%] h-2 w-[66%] rotate-[12deg] rounded-full bg-white/10" />
          <div className="absolute left-[22%] top-[22%] h-[54%] w-2 rounded-full bg-white/10" />
          <div className="absolute right-[18%] top-[16%] h-[58%] w-2 rounded-full bg-white/10" />
          {mapUnits.map((unit) => (
            <motion.div
              key={unit.id}
              animate={{ left: `${unit.x}%`, top: `${unit.y}%`, rotate: unit.heading }}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              transition={{ duration: 4.8, ease: "easeInOut" }}
              style={{ left: `${unit.x}%`, top: `${unit.y}%` }}
            >
              <button
                className="flex items-center gap-2 rounded-full border border-white/15 bg-surface-900/85 px-3 py-1.5 text-[11px] text-slate-50 shadow-lg backdrop-blur-xl transition hover:border-accent-400/30"
                onClick={() => setSelectedAssetId(unit.id)}
                type="button"
              >
                <span className="text-accent-300">{unitIcon(unit.type)}</span>
                <span>{unit.label}</span>
              </button>
            </motion.div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3 text-primary">
              <CloudRain className="h-4 w-4 text-accent-300" />
              <p className="text-sm font-medium">Weather Overlay</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">
              {weather.condition}, {weather.temperatureC} C, humidity {weather.humidity}%, wind {weather.windKph} kph, rainfall {weather.rainfallMm} mm.
            </p>
          </div>
          {[
            "Emergency corridor protection active",
            "Flood watch zone monitored in Sector 4",
            "Waste collection route 11 optimized",
            "AQI sensor cluster stable across harbor district",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-muted">
              {item}
            </div>
          ))}
          {selectedAsset ? (
            <div className="rounded-2xl border border-accent-400/20 bg-accent-500/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-primary">{selectedAsset.label}</p>
                <StatusBadge label={selectedAsset.status} tone={selectedAsset.status === "critical" ? "danger" : selectedAsset.status === "watch" ? "warning" : "success"} />
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">{selectedAsset.detail}</p>
            </div>
          ) : null}
        </div>
      </div>
    </SectionCard>
  );
}

export function ProfileMenu(): JSX.Element {
  const { profileMenuOpen, toggleProfileMenu, triggerQuickAction } = usePlatform();

  return (
    <AnimatePresence>
      {profileMenuOpen ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="absolute right-0 top-16 z-30 w-[280px] rounded-[28px] border border-white/10 bg-panel p-4 shadow-glow"
        >
          <div className="rounded-2xl border border-accent-400/20 bg-accent-500/10 p-4">
            <p className="text-sm font-semibold text-primary">Maya Chen</p>
            <p className="mt-1 text-sm text-muted">Super Admin • Operations Director</p>
          </div>
          <div className="mt-3 space-y-2">
            {[
              "Open profile workspace",
              "Manage notification preferences",
              "Export executive briefing",
            ].map((item) => (
              <button
                key={item}
                className="flex w-full items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-primary transition hover:border-accent-400/30 hover:bg-accent-500/10"
                onClick={() => {
                  triggerQuickAction(item);
                  toggleProfileMenu(false);
                }}
                type="button"
              >
                <span>{item}</span>
                <ChevronRight className="h-4 w-4 text-muted" />
              </button>
            ))}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function QuickStatsBar(): JSX.Element {
  const { weather, uptime, currentTime, currentDate, lastSync, autoRefreshLabel, sourceStatuses } = usePlatform();
  const weatherSource = sourceStatuses.find((status) => status.name === "Weather")?.mode ?? weather.source;
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {[
        { label: "Current Time", value: currentTime, icon: <CheckCircle2 className="h-4 w-4" /> },
        { label: "Current Date", value: currentDate, icon: <Bell className="h-4 w-4" /> },
        { label: "Last Sync", value: formatLocalTimestamp(new Date(lastSync)), icon: <Activity className="h-4 w-4" /> },
        { label: "System Uptime", value: uptime, icon: <BatteryCharging className="h-4 w-4" /> },
        { label: "Weather", value: `${weather.temperatureC} C • ${weather.condition} • ${weatherSource} • ${autoRefreshLabel}`, icon: <CloudRain className="h-4 w-4" /> },
      ].map((item) => (
        <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-muted">
            {item.icon}
            <span className="text-xs uppercase tracking-[0.2em]">{item.label}</span>
          </div>
          <p className="mt-2 text-sm font-medium text-primary">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

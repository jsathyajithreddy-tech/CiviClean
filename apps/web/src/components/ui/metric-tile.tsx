import { motion } from "framer-motion";

interface MetricTileProps {
  title: string;
  value: string;
  helper: string;
  tone?: "accent" | "danger" | "success";
}

export function MetricTile({
  title,
  value,
  helper,
  tone = "accent",
}: MetricTileProps): JSX.Element {
  const toneClassName =
    tone === "danger"
      ? "bg-danger/10 text-danger border-danger/20"
      : tone === "success"
        ? "bg-success/10 text-success border-success/20"
        : "bg-accent-500/10 text-accent-300 border-accent-400/20";

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[28px] border border-white/10 bg-panel p-5 shadow-glow"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted">{title}</p>
        <span className={`rounded-full border px-2 py-1 text-xs ${toneClassName}`}>{helper}</span>
      </div>
      <p className="mt-5 text-3xl font-semibold text-primary">{value}</p>
    </motion.article>
  );
}

interface InsightListProps {
  title: string;
  items: string[];
}

export function InsightList({ title, items }: InsightListProps): JSX.Element {
  return (
    <article className="rounded-[28px] border border-white/10 bg-panel p-6 shadow-glow">
      <h3 className="text-lg font-semibold text-primary">{title}</h3>
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div key={item} className="rounded-2xl border border-white/8 bg-white/5 p-4">
            <div className="flex gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent-400" />
              <p className="text-sm leading-6 text-muted">{item}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

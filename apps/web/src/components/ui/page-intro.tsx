interface PageIntroProps {
  eyebrow: string;
  title: string;
  summary: string;
}

export function PageIntro({ eyebrow, title, summary }: PageIntroProps): JSX.Element {
  return (
    <div className="max-w-3xl">
      <p className="text-sm uppercase tracking-[0.26em] text-accent-300/80">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold text-primary md:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-muted">{summary}</p>
    </div>
  );
}

import { Link } from "react-router-dom";
import { PageIntro } from "../../components/ui/page-intro";
import { SectionCard } from "../../components/ui/enterprise-widgets";

export function NotFoundPage(): JSX.Element {
  return (
    <section className="space-y-6">
      <PageIntro
        eyebrow="Navigation"
        title="Page not found"
        summary="The requested workspace is unavailable. The command shell is still active and you can safely navigate back to a known route."
      />
      <SectionCard
        title="Route fallback"
        description="This fallback prevents unmatched routes from rendering a blank page."
      >
        <Link
          className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-primary transition hover:border-accent-400/25 hover:bg-accent-500/10"
          to="/dashboard"
        >
          Return to dashboard
        </Link>
      </SectionCard>
    </section>
  );
}

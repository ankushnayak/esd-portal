import { EmptyState } from "@/components/app/empty-state";
import { PageSection } from "@/components/layout/page-section";
import { getPublicDashboardData } from "@/lib/dashboard/queries";

export default async function StoriesPage() {
  const { stories } = await getPublicDashboardData();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <PageSection
        eyebrow="Impact stories"
        title="Consent-safe stories from approved seva cases"
        description="Identifying details remain hidden unless explicit consent exists and has been documented."
      >
        {stories.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {stories.map((story) => (
              <article key={story.id} className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">{story.city}</p>
                <h2 className="mt-4 max-w-xl text-[1.9rem] font-semibold leading-tight text-slate-950">{story.title}</h2>
                <p className="mt-4 max-w-2xl text-[1.02rem] leading-8 text-slate-600">{story.publicSummary}</p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No stories have been published yet"
            description="This page will populate after approved seva cases are marked safe for public sharing."
          />
        )}
      </PageSection>
    </div>
  );
}

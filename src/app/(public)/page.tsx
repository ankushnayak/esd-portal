import Link from "next/link";
import { EmptyState } from "@/components/app/empty-state";
import { Button } from "@/components/ui/button";
import { PageSection } from "@/components/layout/page-section";
import { StatCard } from "@/components/app/stat-card";
import { getPublicDashboardData } from "@/lib/dashboard/queries";

export default async function HomePage() {
  const data = await getPublicDashboardData();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Alumni-led. Verified. Transparent.</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            Expert Seva Diwas turns alumni goodwill into measurable community impact.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            A secure portal for Expert Group of Institutions Alumni Network members to record, review, and celebrate acts of seva
            across medicine, teaching, law, engineering, mentoring, donations, and community service.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button className="justify-center" render={<Link href="/login" />}>
              Alumni Login
            </Button>
            <Button className="justify-center" variant="outline" render={<Link href="/register" />}>
              Register as Alumni
            </Button>
            <Button
              className="justify-center border border-blue-200 bg-blue-50 text-blue-950 hover:bg-blue-100"
              render={<Link href="/dashboard" />}
            >
              View Impact Dashboard
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard label="Approved seva cases" value={data.summary.totalCases} />
          <StatCard label="Total seva value" value={data.summary.totalValue} currency tone="green" />
          <StatCard label="Beneficiaries helped" value={data.summary.totalBeneficiaries} tone="gold" />
          <StatCard label="Participating alumni" value={data.summary.totalAlumni} />
        </div>
      </section>

      <PageSection
        eyebrow="How it works"
        title="Built for credibility, privacy, and action"
        description="Every seva record flows through role-based verification before it appears in public dashboards."
      >
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["1", "Register and verify", "Alumni sign up, complete their profile, and undergo verification."],
            ["2", "Record seva", "Verified alumni document service details, beneficiaries, value, and proof."],
            ["3", "Review securely", "Volunteer and coordinator roles validate cases and request clarifications where needed."],
            ["4", "Share impact", "Only approved aggregate metrics and consent-safe stories reach the public dashboard."],
          ].map(([step, title, description]) => (
            <div key={step} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="inline-flex rounded-full bg-blue-950 px-3 py-1 text-sm font-semibold text-white">{step}</div>
              <h3 className="mt-4 text-xl font-semibold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection
        eyebrow="Participating fields"
        title="One network, many forms of seva"
        description="The portal is designed for alumni from every discipline, whether they serve through time, expertise, waived fees, treatment, mentoring, or direct giving."
      >
        <div className="flex flex-wrap gap-3">
          {["Doctors", "Surgeons", "Teachers", "Lawyers", "Engineers", "Entrepreneurs", "Social workers", "Mentors", "Donors"].map(
            (field) => (
              <span key={field} className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800">
                {field}
              </span>
            ),
          )}
        </div>
      </PageSection>

      <PageSection
        eyebrow="Featured stories"
        title="Recent approved stories from the network"
        description="Stories are anonymized by default and only reveal identifying details when recorded consent exists."
      >
        {data.stories.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {data.stories.map((story) => (
              <article key={story.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-800">{story.category.name}</p>
                <h3 className="mt-3 text-xl font-semibold text-slate-950">{story.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{story.publicSummary}</p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No public stories yet"
            description="Approved, consent-safe stories will appear here after alumni submissions are reviewed."
          />
        )}
      </PageSection>
    </div>
  );
}

import { EmptyState } from "@/components/app/empty-state";
import { BreakdownBarChart, SharePieChart, TrendChart } from "@/components/charts/impact-charts";
import { PageSection } from "@/components/layout/page-section";
import { StatCard } from "@/components/app/stat-card";
import { getPublicDashboardData } from "@/lib/dashboard/queries";

export default async function PublicDashboardPage() {
  const data = await getPublicDashboardData();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <PageSection
        eyebrow="Public impact dashboard"
        title="Approved seva impact across the alumni network"
        description="Only approved aggregate data is shown here. Beneficiary private data never appears on public routes."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total seva cases" value={data.summary.totalCases} />
          <StatCard label="Total seva value" value={data.summary.totalValue} currency tone="green" />
          <StatCard label="Beneficiaries helped" value={data.summary.totalBeneficiaries} tone="gold" />
          <StatCard label="Participating alumni" value={data.summary.totalAlumni} />
        </div>
      </PageSection>

      {data.summary.totalCases > 0 ? (
        <section className="rounded-[2rem] border border-slate-200/80 bg-white/70 p-4 shadow-sm shadow-slate-200/60 backdrop-blur-sm sm:p-5 lg:p-6">
          <div className="mb-6 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-800">Impact analysis</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Contribution patterns across time, category, city, and profession
            </h2>
            <p className="mt-3 text-[1.02rem] leading-7 text-slate-600">
              These charts summarize approved public impact data and help visitors understand where alumni effort is creating momentum.
            </p>
          </div>

          <div className="grid gap-5 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <TrendChart data={data.monthly} />
            </div>
            <div className="xl:col-span-5">
              <SharePieChart data={data.byCategory} />
            </div>
            <div className="xl:col-span-6">
              <BreakdownBarChart
                title="Category-wise value"
                description="Approved seva value by top categories"
                data={data.byCategory}
              />
            </div>
            <div className="xl:col-span-6">
              <BreakdownBarChart title="City-wise impact" description="Top cities by approved seva value" data={data.byCity} />
            </div>
            <div className="xl:col-span-12">
              <BreakdownBarChart
                title="Profession-wise contribution"
                description="How alumni professions are contributing"
                data={data.byProfession}
              />
            </div>
          </div>
        </section>
      ) : (
        <EmptyState
          title="No approved public data yet"
          description="This dashboard will begin showing charts after reviewed seva cases are approved for public reporting."
        />
      )}
    </div>
  );
}

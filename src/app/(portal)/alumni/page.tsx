import { getAlumniDashboardData } from "@/lib/dashboard/queries";
import { requireSession } from "@/lib/auth/session";
import { StatCard } from "@/components/app/stat-card";
import { TrendChart } from "@/components/charts/impact-charts";

export default async function AlumniDashboardPage() {
  const session = await requireSession();
  const data = await getAlumniDashboardData(session.user.id);

  return (
    <>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Alumni dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Your seva contribution snapshot</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="My total cases" value={data.summary.totalCases} />
        <StatCard label="Approved cases" value={data.approvedCases} tone="green" />
        <StatCard label="Pending cases" value={data.pendingCases} tone="gold" />
        <StatCard label="Seva value" value={data.summary.totalValue} currency />
        <StatCard label="Beneficiaries helped" value={data.summary.totalBeneficiaries} />
      </div>
      <TrendChart data={data.monthly} />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">Badges earned</h2>
          {data.badges.length ? (
            <div className="mt-4 flex flex-wrap gap-3">
              {data.badges.map((item) => (
                <span key={item.id} className="rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-900">
                  {item.badge.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-600">Badges will appear here as your approved seva contributions grow.</p>
          )}
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">Recent certificates</h2>
          {data.certificates.length ? (
            <div className="mt-4 space-y-3">
              {data.certificates.map((item) => (
                <a key={item.id} href={`/api/certificates/${item.id}`} className="block rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {item.certificateNumber}
                </a>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-600">Recognition certificates will show up here once a reporting period is issued.</p>
          )}
        </div>
      </div>
    </>
  );
}

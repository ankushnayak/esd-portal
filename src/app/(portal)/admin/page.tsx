import { getAdminDashboardData } from "@/lib/dashboard/queries";
import { StatCard } from "@/components/app/stat-card";
import { BreakdownBarChart, TrendChart } from "@/components/charts/impact-charts";

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();

  return (
    <>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Admin dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Operations, verification, and impact at a glance</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total alumni" value={data.totalAlumni} />
        <StatCard label="Pending verification" value={data.pendingProfiles} tone="gold" />
        <StatCard label="Pending review cases" value={data.pendingCases} />
        <StatCard label="Approved seva value" value={data.approvedValue} currency tone="green" />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <TrendChart data={data.publicDashboard.monthly} />
        <BreakdownBarChart title="Category-wise impact" description="Approved seva value by category" data={data.publicDashboard.byCategory} />
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Recent activity</h2>
        <div className="mt-4 space-y-3">
          {data.recentAudit.map((item) => (
            <div key={item.id} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {item.action} on {item.entityType} by {item.actor?.name ?? "system"}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

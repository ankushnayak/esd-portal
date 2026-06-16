export default function AdminReportsPage() {
  return (
    <>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Reports</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Generate exports and monthly reports</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["Approved cases CSV", "/api/admin/reports?kind=approved-cases"],
          ["Alumni-wise CSV", "/api/admin/reports?kind=alumni"],
          ["Category-wise CSV", "/api/admin/reports?kind=category"],
          ["City-wise CSV", "/api/admin/reports?kind=city"],
        ].map(([label, href]) => (
          <a key={label} href={href} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-lg font-semibold text-slate-950">{label}</p>
            <p className="mt-2 text-sm text-slate-600">Download export</p>
          </a>
        ))}
      </div>
    </>
  );
}

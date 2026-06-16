import { prisma } from "@/lib/db/prisma";

export default async function AdminSettingsPage() {
  const settings = await prisma.setting.findMany({
    orderBy: { key: "asc" },
  });

  return (
    <>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Settings</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Platform and deployment settings</h1>
      </div>
      <div className="grid gap-4">
        {settings.map((item) => (
          <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-lg font-semibold text-slate-950">{item.key}</p>
            <pre className="mt-3 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">
              {JSON.stringify(item.valueJson, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </>
  );
}

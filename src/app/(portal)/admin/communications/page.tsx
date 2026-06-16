import { prisma } from "@/lib/db/prisma";

export default async function AdminCommunicationsPage() {
  const templates = await prisma.messageTemplate.findMany({
    orderBy: { name: "asc" },
  });
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Communication center</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Templates, email relay, and WhatsApp logs</h1>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">Message templates</h2>
          <div className="mt-4 space-y-3">
            {templates.map((template) => (
              <div key={template.id} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {template.name} ({template.channel})
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">Recent notification logs</h2>
          <div className="mt-4 space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {notification.channel} to {notification.recipient} | {notification.status}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

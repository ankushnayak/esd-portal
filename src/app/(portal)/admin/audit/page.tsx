import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils/format";

export default async function AdminAuditPage() {
  const logs = await prisma.auditLog.findMany({
    include: { actor: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Audit logs</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Sensitive action history</h1>
      </div>
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              {["Date", "Actor", "Action", "Entity"].map((header) => (
                <th key={header} className="px-4 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map((item) => (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="px-4 py-3 text-slate-600">{formatDate(item.createdAt)}</td>
                <td className="px-4 py-3 text-slate-600">{item.actor?.name ?? "system"}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{item.action}</td>
                <td className="px-4 py-3 text-slate-600">
                  {item.entityType} / {item.entityId}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

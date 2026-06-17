import Link from "next/link";
import { SevaCaseStatus } from "@prisma/client";
import { formatDate } from "@/lib/utils/format";
import { requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { EmptyState } from "@/components/app/empty-state";

export default async function AlumniCasesPage() {
  const session = await requireSession();
  const cases = await prisma.sevaCase.findMany({
    where: { userId: session.user.id, deletedAt: null },
    orderBy: { updatedAt: "desc" },
    include: { category: true },
  });

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">My seva cases</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Track submissions and reviews</h1>
        </div>
        <Link href="/alumni/cases/new" className="rounded-2xl bg-blue-950 px-4 py-3 text-sm font-semibold text-white">
          Add seva case
        </Link>
      </div>
      {cases.length === 0 ? (
        <EmptyState title="No seva cases yet" description="Start by saving your first seva case as a draft or submitting it for review." />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                {["Case", "Category", "Date", "Status", "Review notes", "Action"].map((header) => (
                  <th key={header} className="px-4 py-3 font-medium">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cases.map((item) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-900">{item.title}</td>
                  <td className="px-4 py-3 text-slate-600">{item.category.name}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(item.date)}</td>
                  <td className="px-4 py-3 text-slate-600">{item.status.replaceAll("_", " ")}</td>
                  <td className="px-4 py-3 text-slate-600">{item.clarificationNotes ?? item.rejectionReason ?? "No comments yet"}</td>
                  <td className="px-4 py-3">
                    <Link href={`/alumni/cases/${item.id}`} className="text-sm font-semibold text-blue-900 hover:text-blue-700">
                      {item.status === SevaCaseStatus.DRAFT
                        ? "Continue draft"
                        : item.status === SevaCaseStatus.CLARIFICATION_REQUESTED
                          ? "Review and resubmit"
                          : "View details"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

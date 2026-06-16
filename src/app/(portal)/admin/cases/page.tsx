import { formatCurrency, formatDate } from "@/lib/utils/format";
import { prisma } from "@/lib/db/prisma";
import { ReviewCaseForm } from "@/components/forms/review-case-form";

export default async function AdminCasesPage() {
  const cases = await prisma.sevaCase.findMany({
    where: { deletedAt: null },
    include: {
      user: true,
      category: true,
      privateData: true,
      attachments: true,
    },
    orderBy: { updatedAt: "desc" },
    take: 20,
  });

  return (
    <>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Seva case review</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Review queue and approvals</h1>
      </div>
      <div className="grid gap-4">
        {cases.map((item) => (
          <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-800">{item.category.name}</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-600">
                  {item.user.name} | {formatDate(item.date)} | {item.city}, {item.state}
                </p>
              </div>
              <ReviewCaseForm caseId={item.id} />
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">{item.description}</div>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                Private beneficiary: {item.privateData?.name ?? "Not provided"}
                <br />
                Beneficiaries helped: {item.beneficiaryCount}
                <br />
                Value: {formatCurrency(item.actualAmount.toNumber(), item.currency)}
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                Status: {item.status.replaceAll("_", " ")}
                <br />
                Consent obtained: {item.consentObtained ? "Yes" : "No"}
                <br />
                Attachments: {item.attachments.length}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

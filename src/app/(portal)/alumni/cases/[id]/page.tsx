import Link from "next/link";
import { notFound } from "next/navigation";
import { SevaCaseStatus } from "@prisma/client";
import { requireSession } from "@/lib/auth/session";
import { SevaCaseForm } from "@/components/forms/seva-case-form";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils/format";

export default async function EditCasePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  const { id } = await params;

  const [categories, sevaCase] = await Promise.all([
    prisma.sevaCategory.findMany({
      where: { isActive: true, parentId: null },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true },
    }),
    prisma.sevaCase.findFirst({
      where: { id, userId: session.user.id, deletedAt: null },
      include: { privateData: true, category: true },
    }),
  ]);

  if (!sevaCase) {
    notFound();
  }

  const isEditable = sevaCase.status === SevaCaseStatus.DRAFT || sevaCase.status === SevaCaseStatus.CLARIFICATION_REQUESTED;

  if (!isEditable) {
    return (
      <>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Seva case details</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{sevaCase.title}</h1>
            <p className="mt-2 text-sm text-slate-600">
              {sevaCase.status.replaceAll("_", " ")} on {formatDate(sevaCase.date)}
            </p>
          </div>
          <Link
            href="/alumni/cases"
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to my cases
          </Link>
        </div>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(320px,1fr)]">
          <article className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-slate-500">Category</p>
                <p className="mt-1 text-base font-semibold text-slate-950">{sevaCase.category.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Profession / field</p>
                <p className="mt-1 text-base font-semibold text-slate-950">{sevaCase.profession}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Location</p>
                <p className="mt-1 text-base font-semibold text-slate-950">
                  {sevaCase.city}, {sevaCase.state}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Beneficiaries helped</p>
                <p className="mt-1 text-base font-semibold text-slate-950">{sevaCase.beneficiaryCount}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">Description</p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">{sevaCase.description}</p>
            </div>

            {sevaCase.publicSummary ? (
              <div>
                <p className="text-sm font-medium text-slate-500">Public-safe summary</p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">{sevaCase.publicSummary}</p>
              </div>
            ) : null}
          </article>

          <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm font-medium text-slate-500">Status</p>
              <p className="mt-1 text-base font-semibold text-slate-950">{sevaCase.status.replaceAll("_", " ")}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Estimated value</p>
              <p className="mt-1 text-base font-semibold text-slate-950">
                {sevaCase.currency} {sevaCase.estimatedValue.toNumber().toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Actual amount</p>
              <p className="mt-1 text-base font-semibold text-slate-950">
                {sevaCase.currency} {sevaCase.actualAmount.toNumber().toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Review notes</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">{sevaCase.clarificationNotes ?? sevaCase.rejectionReason ?? "No comments yet"}</p>
            </div>
          </aside>
        </section>
      </>
    );
  }

  return (
    <>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Edit seva case</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Update details and resubmit when ready</h1>
      </div>
      <SevaCaseForm
        categories={categories}
        defaultValues={{
          caseId: sevaCase.id,
          title: sevaCase.title,
          date: sevaCase.date.toISOString().slice(0, 10),
          categoryId: sevaCase.categoryId,
          subcategoryId: sevaCase.subcategoryId ?? undefined,
          profession: sevaCase.profession,
          city: sevaCase.city,
          state: sevaCase.state,
          beneficiaryType: sevaCase.beneficiaryType,
          beneficiaryName: sevaCase.privateData?.name ?? "",
          beneficiaryContact: sevaCase.privateData?.contact ?? "",
          beneficiaryLocation: sevaCase.privateData?.location ?? "",
          beneficiaryNotes: sevaCase.privateData?.notes ?? "",
          beneficiaryCount: sevaCase.beneficiaryCount,
          description: sevaCase.description,
          estimatedValue: sevaCase.estimatedValue.toNumber(),
          actualAmount: sevaCase.actualAmount.toNumber(),
          currency: sevaCase.currency,
          consentObtained: sevaCase.consentObtained,
          publicVisibility: sevaCase.publicVisibility,
          publicSummary: sevaCase.publicSummary ?? "",
          internalNotes: sevaCase.internalNotes ?? "",
        }}
      />
    </>
  );
}

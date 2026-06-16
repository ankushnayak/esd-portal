import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { SevaCaseForm } from "@/components/forms/seva-case-form";
import { prisma } from "@/lib/db/prisma";

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
      include: { privateData: true },
    }),
  ]);

  if (!sevaCase) {
    notFound();
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

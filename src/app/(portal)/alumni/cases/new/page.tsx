import { requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { SevaCaseForm } from "@/components/forms/seva-case-form";

export default async function NewCasePage() {
  const session = await requireSession();
  const categories = await prisma.sevaCategory.findMany({
    where: { isActive: true, parentId: null },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true },
  });

  return (
    <>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Add seva case</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Record a new act of service</h1>
        {session.user.verificationStatus !== "VERIFIED" ? (
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            You can save a draft now and finish the full submission after your alumni verification is approved.
          </p>
        ) : null}
      </div>
      <SevaCaseForm categories={categories} />
    </>
  );
}

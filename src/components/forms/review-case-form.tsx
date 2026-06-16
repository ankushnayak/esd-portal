"use client";

import { useTransition } from "react";
import { PublicVisibility } from "@prisma/client";
import { toast } from "sonner";
import { reviewSevaCaseAction } from "@/actions/admin";

export function ReviewCaseForm({ caseId }: { caseId: string }) {
  const [isPending, startTransition] = useTransition();

  async function submit(data: {
    action: "APPROVE" | "REJECT" | "CLARIFICATION_REQUESTED";
    comments?: string;
    publicVisibility?: PublicVisibility;
    featured?: boolean;
  }) {
    startTransition(async () => {
      const result = await reviewSevaCaseAction({ sevaCaseId: caseId, ...data });
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    });
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        disabled={isPending}
        onClick={() => submit({ action: "APPROVE", publicVisibility: PublicVisibility.ANONYMIZED })}
        className="rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"
      >
        Approve
      </button>
      <button
        disabled={isPending}
        onClick={() => submit({ action: "CLARIFICATION_REQUESTED" })}
        className="rounded-2xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950"
      >
        Request clarification
      </button>
      <button
        disabled={isPending}
        onClick={() => submit({ action: "REJECT" })}
        className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
      >
        Reject
      </button>
    </div>
  );
}

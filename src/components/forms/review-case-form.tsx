"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PublicVisibility } from "@prisma/client";
import { toast } from "sonner";
import { reviewSevaCaseAction } from "@/actions/admin";

export function ReviewCaseForm({ caseId }: { caseId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [comments, setComments] = useState("");
  const [featured, setFeatured] = useState(false);
  const [publicVisibility, setPublicVisibility] = useState<PublicVisibility>(PublicVisibility.ANONYMIZED);

  async function submit(data: {
    action: "APPROVE" | "REJECT" | "CLARIFICATION_REQUESTED";
    comments?: string;
    publicVisibility?: PublicVisibility;
    featured?: boolean;
  }) {
    if (["REJECT", "CLARIFICATION_REQUESTED"].includes(data.action) && !data.comments?.trim()) {
      toast.error("Please add reviewer notes before rejecting or requesting clarification.");
      return;
    }

    startTransition(async () => {
      const result = await reviewSevaCaseAction({ sevaCaseId: caseId, ...data });
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500" htmlFor={`review-comments-${caseId}`}>
        Reviewer notes
      </label>
      <textarea
        id={`review-comments-${caseId}`}
        value={comments}
        onChange={(event) => setComments(event.target.value)}
        rows={3}
        className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-700"
        placeholder="Add approval notes, clarification details, or a rejection reason."
      />
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500" htmlFor={`visibility-${caseId}`}>
            Public visibility
          </label>
          <select
            id={`visibility-${caseId}`}
            value={publicVisibility}
            disabled={isPending}
            onChange={(event) => setPublicVisibility(event.target.value as PublicVisibility)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
          >
            <option value={PublicVisibility.PRIVATE}>Private only</option>
            <option value={PublicVisibility.ANONYMIZED}>Public anonymized</option>
            <option value={PublicVisibility.PUBLIC_WITH_CONSENT}>Public with consent</option>
          </select>
        </div>
        <label className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm font-medium text-slate-700">
          <input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} className="size-4 rounded" />
          Feature this case
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={isPending}
          onClick={() => submit({ action: "APPROVE", comments, publicVisibility, featured })}
          className="rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Approve
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => submit({ action: "CLARIFICATION_REQUESTED", comments })}
          className="rounded-2xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
        >
          Request clarification
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => submit({ action: "REJECT", comments })}
          className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

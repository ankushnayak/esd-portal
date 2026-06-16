"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PublicVisibility } from "@prisma/client";
import { sevaCaseSchema } from "@/lib/validation/case";

type CaseValues = {
  caseId?: string;
  title: string;
  date: string;
  categoryId: string;
  subcategoryId?: string;
  profession: string;
  city: string;
  state: string;
  beneficiaryType: string;
  beneficiaryName?: string;
  beneficiaryContact?: string;
  beneficiaryLocation?: string;
  beneficiaryNotes?: string;
  beneficiaryCount: number;
  description: string;
  estimatedValue: number;
  actualAmount: number;
  currency: string;
  consentObtained: boolean;
  publicVisibility: PublicVisibility;
  publicSummary?: string;
  internalNotes?: string;
  proofFiles?: FileList;
  consentFiles?: FileList;
};

function hasDraftEssentials(values: CaseValues) {
  return Boolean(values.title?.trim() && values.date && values.categoryId);
}

export function SevaCaseForm({
  categories,
  defaultValues,
}: {
  categories: Array<{ id: string; name: string }>;
  defaultValues?: Partial<CaseValues>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [action, setAction] = useState<"save-draft" | "submit">("save-draft");
  const { register, handleSubmit, watch } = useForm<CaseValues>({
    defaultValues: {
      currency: "INR",
      publicVisibility: PublicVisibility.PRIVATE,
      beneficiaryType: "INDIVIDUAL",
      ...defaultValues,
    },
  });

  const publicVisibility = watch("publicVisibility");

  const onSubmit = handleSubmit((values) => {
    if (action === "save-draft" && !hasDraftEssentials(values)) {
      toast.error("Add at least a title, date, and category before saving a draft.");
      return;
    }

    const payload = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value == null) return;

      if (value instanceof FileList) {
        Array.from(value).forEach((file) => payload.append(key, file));
        return;
      }

      payload.append(key, String(value));
    });
    payload.append("action", action);

    if (action === "submit") {
      const validationPayload = {
        ...values,
        consentAttachmentIds:
          publicVisibility === PublicVisibility.PUBLIC_WITH_CONSENT && values.consentFiles?.length ? ["pending"] : [],
      };
      const parsed = sevaCaseSchema.safeParse(validationPayload);

      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message ?? "Unable to save this seva case.");
        return;
      }
    }

    startTransition(async () => {
      const response = await fetch("/api/alumni/cases", {
        method: "POST",
        body: payload,
      });

      const result = (await response.json()) as { success: boolean; message: string };

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.push("/alumni/cases");
      router.refresh();
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          ["title", "Case title", "text"],
          ["date", "Case date", "date"],
          ["profession", "Profession / field", "text"],
          ["city", "City", "text"],
          ["state", "State", "text"],
          ["beneficiaryCount", "Beneficiaries helped", "number"],
          ["estimatedValue", "Estimated financial value", "number"],
          ["actualAmount", "Actual amount spent or waived", "number"],
          ["currency", "Currency", "text"],
        ].map(([field, label, type]) => (
          <div key={field} className={field === "title" ? "sm:col-span-2" : ""}>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor={field}>
              {label}
            </label>
            <input
              id={field}
              type={type}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-700"
              {...register(field as keyof CaseValues, type === "number" ? { valueAsNumber: true } : undefined)}
            />
          </div>
        ))}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="categoryId">
            Seva category
          </label>
          <select
            id="categoryId"
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-700"
            {...register("categoryId")}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="beneficiaryType">
            Beneficiary type
          </label>
          <select
            id="beneficiaryType"
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-700"
            {...register("beneficiaryType")}
          >
            {["INDIVIDUAL", "FAMILY", "SCHOOL", "HOSPITAL", "COMMUNITY", "NGO", "OTHER"].map((item) => (
              <option key={item} value={item}>
                {item.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          ["beneficiaryName", "Beneficiary name (private)"],
          ["beneficiaryContact", "Beneficiary contact (private)"],
          ["beneficiaryLocation", "Beneficiary location (private)"],
        ].map(([field, label]) => (
          <div key={field}>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor={field}>
              {label}
            </label>
            <input
              id={field}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-700"
              {...register(field as keyof CaseValues)}
            />
          </div>
        ))}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="description">
          Description of seva
        </label>
        <textarea
          id="description"
          rows={5}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-700"
          {...register("description")}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="publicSummary">
          Public-safe summary
        </label>
        <textarea
          id="publicSummary"
          rows={3}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-700"
          {...register("publicSummary")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="publicVisibility">
            Public visibility
          </label>
          <select
            id="publicVisibility"
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-700"
            {...register("publicVisibility")}
          >
            <option value={PublicVisibility.PRIVATE}>Private only</option>
            <option value={PublicVisibility.ANONYMIZED}>Public anonymized</option>
            <option value={PublicVisibility.PUBLIC_WITH_CONSENT}>Public with name/photo and consent</option>
          </select>
        </div>
        <label className="flex items-center gap-3 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700">
          <input type="checkbox" className="size-4 rounded" {...register("consentObtained")} />
          Consent obtained from beneficiary
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="proofFiles">
            Proof / photo attachments
          </label>
          <input
            id="proofFiles"
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
            {...register("proofFiles")}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="consentFiles">
            Consent attachment
          </label>
          <input
            id="consentFiles"
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
            {...register("consentFiles")}
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="internalNotes">
          Internal notes
        </label>
        <textarea
          id="internalNotes"
          rows={3}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-700"
          {...register("internalNotes")}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <p className="w-full text-sm text-slate-500">
          Drafts save with the basics. Full details and proof are only required when you submit for review.
        </p>
        <button
          type="submit"
          disabled={isPending}
          onClick={() => setAction("save-draft")}
          className="rounded-2xl border border-slate-300 px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-100 disabled:opacity-50"
        >
          Save as draft
        </button>
        <button
          type="submit"
          disabled={isPending}
          onClick={() => setAction("submit")}
          className="rounded-2xl bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
        >
          Submit for review
        </button>
      </div>
    </form>
  );
}

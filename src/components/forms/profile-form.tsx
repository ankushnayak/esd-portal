"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateAlumniProfileAction } from "@/actions/profile";

type ProfileValues = {
  name: string;
  email: string;
  phone: string;
  batchYear?: number;
  institution?: string;
  program?: string;
  profession?: string;
  specialty?: string;
  city?: string;
  state?: string;
  country?: string;
  profilePhotoUrl?: string;
  publicProfileOptIn: boolean;
  availabilityPledge?: string;
};

export function ProfileForm({ defaultValues }: { defaultValues: ProfileValues }) {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit } = useForm<ProfileValues>({ defaultValues });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await updateAlumniProfileAction(values);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    });
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2">
      {[
        ["name", "Full name"],
        ["email", "Email"],
        ["phone", "Phone"],
        ["batchYear", "Batch year"],
        ["institution", "Institution"],
        ["program", "Program"],
        ["profession", "Profession"],
        ["specialty", "Specialty"],
        ["city", "City"],
        ["state", "State"],
        ["country", "Country"],
        ["profilePhotoUrl", "Profile photo URL"],
      ].map(([field, label]) => (
        <div key={field} className={field === "institution" || field === "program" ? "sm:col-span-2" : ""}>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor={field}>
            {label}
          </label>
          <input
            id={field}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-700"
            {...register(field as keyof ProfileValues, field === "batchYear" ? { valueAsNumber: true } : undefined)}
          />
        </div>
      ))}
      <div className="sm:col-span-2">
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="availabilityPledge">
          Availability / pledge
        </label>
        <textarea
          id="availabilityPledge"
          rows={4}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-700"
          {...register("availabilityPledge")}
        />
      </div>
      <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
        <input type="checkbox" className="size-4 rounded" {...register("publicProfileOptIn")} />
        Allow my alumni profile to appear publicly
      </label>
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-2xl bg-blue-950 px-5 py-3 font-semibold text-white transition hover:bg-blue-900 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save profile"}
        </button>
      </div>
    </form>
  );
}

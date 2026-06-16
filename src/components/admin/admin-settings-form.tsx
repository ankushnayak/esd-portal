"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateSettingsAction } from "@/actions/admin";

type SettingsValues = {
  publicDashboardEnabled: boolean;
  sevaDayLabel: string;
};

export function AdminSettingsForm({ defaultValues }: { defaultValues: SettingsValues }) {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit } = useForm<SettingsValues>({ defaultValues });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await updateSettingsAction(values);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    });
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="sevaDayLabel">
          Seva day label
        </label>
        <input
          id="sevaDayLabel"
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-700"
          {...register("sevaDayLabel")}
        />
      </div>
      <label className="flex items-center gap-3 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700">
        <input type="checkbox" className="size-4 rounded" {...register("publicDashboardEnabled")} />
        Keep the public impact dashboard visible
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save settings"}
      </button>
    </form>
  );
}

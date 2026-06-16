"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { registerAlumniAction } from "@/actions/auth";
import { registerSchema } from "@/lib/validation/auth";

type RegisterValues = {
  name: string;
  email: string;
  password: string;
  phone: string;
  batchYear: number;
  institution: string;
  program: string;
  profession: string;
  city: string;
  state: string;
};

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, reset } = useForm<RegisterValues>();

  const onSubmit = handleSubmit((values) => {
    const parsed = registerSchema.safeParse(values);

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please review your form.");
      return;
    }

    startTransition(async () => {
      const result = await registerAlumniAction(parsed.data);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      reset();
      toast.success(result.message);
      router.push("/login");
    });
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2">
      {[
        ["name", "Full name", "text"],
        ["email", "Email", "email"],
        ["password", "Password", "password"],
        ["phone", "Mobile / WhatsApp", "tel"],
        ["batchYear", "Batch year", "number"],
        ["institution", "Institution", "text"],
        ["program", "Program", "text"],
        ["profession", "Profession", "text"],
        ["city", "City", "text"],
        ["state", "State", "text"],
      ].map(([field, label, type]) => (
        <div key={field} className={field === "institution" || field === "program" ? "sm:col-span-2" : ""}>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor={field}>
            {label}
          </label>
          <input
            id={field}
            type={type}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-700"
            {...register(field as keyof RegisterValues, type === "number" ? { valueAsNumber: true } : undefined)}
          />
        </div>
      ))}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-2xl bg-blue-950 px-4 py-3 font-semibold text-white transition hover:bg-blue-900 disabled:opacity-50"
        >
          {isPending ? "Registering..." : "Register as Alumni"}
        </button>
      </div>
    </form>
  );
}

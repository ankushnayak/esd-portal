"use client";

import { useState, useTransition } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getPostLoginPath } from "@/lib/auth/roles";
import { loginSchema } from "@/lib/validation/auth";

type LoginValues = {
  email: string;
  password: string;
};

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const { register, handleSubmit } = useForm<LoginValues>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => {
    const parsed = loginSchema.safeParse(values);

    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message ?? "Unable to sign in.");
      return;
    }

    startTransition(async () => {
      const result = await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false,
      });

      if (result?.error) {
        setMessage("Invalid credentials or your profile is not yet active.");
        return;
      }

      const session = await getSession();
      const destination = session?.user?.role ? getPostLoginPath(session.user.role) : "/alumni";

      toast.success("Signed in successfully.");
      router.push(destination);
      router.refresh();
    });
  });

  return (
    <form onSubmit={onSubmit} className="surface-card space-y-5 p-6 sm:p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Sign in</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">Access your alumni workspace</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Use the email and password linked to your Expert alumni profile.</p>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-slate-950 outline-none ring-0 transition placeholder:text-slate-400 focus:border-blue-700 focus:bg-white"
          {...register("email")}
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-slate-950 outline-none ring-0 transition placeholder:text-slate-400 focus:border-blue-700 focus:bg-white"
          {...register("password")}
        />
      </div>
      {message ? <p className="text-sm text-rose-600">{message}</p> : null}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-2xl bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] px-4 py-3 font-semibold text-white shadow-[0_18px_34px_-20px_rgba(29,78,216,0.8)] transition hover:brightness-105 disabled:opacity-50"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

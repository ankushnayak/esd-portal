import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto grid min-h-screen max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
      <div className="rounded-[2rem] bg-blue-950 p-8 text-white shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">Expert Seva Diwas</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Welcome back, alumni.</h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-blue-100">
          Sign in to record service, track approvals, download recognition certificates, and help keep the alumni impact
          ledger transparent month after month.
        </p>
      </div>
      <div className="flex flex-col justify-center gap-4">
        <LoginForm />
        <p className="text-sm text-slate-600">
          New here?{" "}
          <Link href="/register" className="font-semibold text-blue-900">
            Register as alumni
          </Link>
        </p>
      </div>
    </div>
  );
}

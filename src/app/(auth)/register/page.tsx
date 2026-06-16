import { RegisterForm } from "@/components/forms/register-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Register as alumni</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Create your Expert Seva Diwas account</h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Verified alumni can submit seva cases, track approvals, and receive recognition certificates. Registration is
          the first step.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}

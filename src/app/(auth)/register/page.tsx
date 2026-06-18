import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RegisterForm } from "@/components/forms/register-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-slate-950"
        >
          <ArrowLeft className="size-4" />
          Back to homepage
        </Link>
      </div>
      <section className="mb-8">
        <p className="section-chip">Register as alumni</p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Create your Expert Seva Diwas account
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
          Verified alumni can submit seva cases, track approvals, and receive recognition certificates. Registration is
          the first step, and the form is designed to create a clean, review-friendly record from day one.
        </p>
      </section>
      <RegisterForm />
    </div>
  );
}

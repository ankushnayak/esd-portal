import Link from "next/link";
import { ShieldCheck, Sparkles, Users, type LucideIcon } from "lucide-react";
import { LoginForm } from "@/components/forms/login-form";

const loginHighlights: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: ShieldCheck,
    title: "Verified workflows",
    description: "Protected alumni and admin journeys with role-based access.",
  },
  {
    icon: Users,
    title: "Shared accountability",
    description: "Review, approvals, and reporting stay visible to the right people.",
  },
  {
    icon: Sparkles,
    title: "Recognition-ready",
    description: "Track service and issue certificates from one place.",
  },
];

export default function LoginPage() {
  return (
    <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_460px] lg:items-center lg:px-8 lg:py-12">
      <section className="surface-card relative overflow-hidden bg-[linear-gradient(135deg,rgba(15,23,42,0.95),rgba(30,64,175,0.92)_45%,rgba(5,150,105,0.88))] p-8 text-white sm:p-10 lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.12),_transparent_28%)]" />
        <div className="relative">
          <p className="section-chip border-white/15 bg-white/10 text-emerald-100">Expert Seva Diwas</p>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold text-white sm:text-5xl">Welcome back, alumni.</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-blue-50/90 sm:text-lg">
          Sign in to record service, track approvals, download recognition certificates, and help keep the alumni impact
          ledger transparent month after month.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {loginHighlights.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-[1.6rem] border border-white/15 bg-white/10 p-4 backdrop-blur">
                <Icon className="size-5 text-emerald-200" />
                <h2 className="mt-4 text-base font-semibold text-white">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-blue-50/80">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="flex flex-col justify-center gap-4">
        <LoginForm />
        <p className="text-center text-sm text-slate-600">
          New here?{" "}
          <Link href="/register" className="font-semibold text-blue-900 transition hover:text-blue-700">
            Register as alumni
          </Link>
        </p>
      </div>
    </div>
  );
}

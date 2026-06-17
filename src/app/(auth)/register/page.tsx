import { Globe2, IdCard, ShieldCheck, type LucideIcon } from "lucide-react";
import { RegisterForm } from "@/components/forms/register-form";

const registerHighlights: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: IdCard,
    title: "Alumni-first verification",
    description: "Your institution and completion year help the admin team verify profiles faster.",
  },
  {
    icon: Globe2,
    title: "Consistent location data",
    description: "Country, state, and city selections use a standardized dataset to avoid duplicates and mismatches.",
  },
  {
    icon: ShieldCheck,
    title: "Safer sign-up flow",
    description: "Password confirmation and clearer field guidance reduce lockouts and prevent avoidable mistakes.",
  },
];

export default function RegisterPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:px-8 lg:py-12">
      <section className="surface-card-muted overflow-hidden p-8 sm:p-10 lg:sticky lg:top-24">
        <p className="section-chip">Register as alumni</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Create your Expert Seva Diwas account
        </h1>
        <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
          Verified alumni can submit seva cases, track approvals, and receive recognition certificates. Registration is
          the first step, and the form is designed to create a clean, review-friendly record from day one.
        </p>
        <div className="mt-8 grid gap-4">
          {registerHighlights.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-[1.6rem] border border-slate-200/80 bg-white/80 p-5 shadow-[0_16px_36px_-28px_rgba(15,23,42,0.45)]">
              <Icon className="size-5 text-blue-900" />
              <h2 className="mt-4 text-base font-semibold text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>
      <RegisterForm />
    </div>
  );
}

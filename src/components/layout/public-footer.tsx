import Link from "next/link";
import { appMetadata } from "@/lib/constants";

export function PublicFooter() {
  return (
    <footer className="mt-20 border-t border-slate-200/70 bg-[linear-gradient(180deg,#07111f,#0f172a)] text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm sm:px-6 lg:grid-cols-[1.3fr_0.7fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">Expert Seva Diwas</p>
          <p className="mt-3 text-xl font-semibold text-white">{appMetadata.name}</p>
          <p className="mt-2 max-w-xl leading-7 text-slate-400">{appMetadata.organization}</p>
        </div>
        <div className="grid gap-3 text-slate-300 sm:justify-self-end sm:text-right">
          <Link href="/privacy" className="transition hover:text-white">
            Privacy & Consent
          </Link>
          <Link href="/dashboard" className="transition hover:text-white">
            Public Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}

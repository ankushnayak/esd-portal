import Link from "next/link";
import { appMetadata } from "@/lib/constants";

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 text-sm sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-semibold text-white">{appMetadata.name}</p>
          <p className="mt-1 max-w-md leading-6 text-slate-400">{appMetadata.organization}</p>
        </div>
        <div className="flex flex-wrap gap-5 text-slate-300">
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

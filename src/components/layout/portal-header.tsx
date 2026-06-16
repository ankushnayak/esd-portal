import Link from "next/link";
import { UserRole, VerificationStatus } from "@prisma/client";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Logo } from "@/components/app/logo";
import { roleLabels } from "@/lib/auth/roles";

function verificationTone(status: VerificationStatus) {
  if (status === VerificationStatus.VERIFIED) {
    return "bg-emerald-100 text-emerald-800";
  }

  if (status === VerificationStatus.REJECTED) {
    return "bg-rose-100 text-rose-700";
  }

  return "bg-amber-100 text-amber-900";
}

export function PortalHeader({
  role,
  verificationStatus,
  switchHref,
  switchLabel,
}: {
  role: UserRole;
  verificationStatus: VerificationStatus;
  switchHref?: string;
  switchLabel?: string;
}) {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Logo />
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">{roleLabels[role]}</span>
            <span className={`rounded-full px-3 py-1 font-medium ${verificationTone(verificationStatus)}`}>
              {verificationStatus.replaceAll("_", " ")}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
          >
            Public site
          </Link>
          {switchHref && switchLabel ? (
            <Link
              href={switchHref}
              className="inline-flex h-10 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 px-4 text-sm font-medium text-blue-900 transition hover:bg-blue-100"
            >
              {switchLabel}
            </Link>
          ) : null}
          <SignOutButton className="inline-flex h-10 items-center justify-center rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50" />
        </div>
      </div>
    </header>
  );
}

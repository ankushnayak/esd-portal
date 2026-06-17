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
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4">
      <div className="surface-card-muted mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Logo />
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-700 shadow-sm">{roleLabels[role]}</span>
            <span className={`rounded-full px-3 py-1 font-medium shadow-sm ${verificationTone(verificationStatus)}`}>
              {verificationStatus.replaceAll("_", " ")}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
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
          <SignOutButton className="inline-flex h-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] px-4 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-50" />
        </div>
      </div>
    </header>
  );
}

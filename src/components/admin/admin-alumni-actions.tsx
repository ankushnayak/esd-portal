"use client";

import { useState, useTransition } from "react";
import { UserRole, VerificationStatus } from "@prisma/client";
import { toast } from "sonner";
import { updateUserVerificationAction } from "@/actions/admin";
import { roleLabels } from "@/lib/auth/roles";

const manageableRoles: UserRole[] = [
  UserRole.VERIFIED_ALUMNI,
  UserRole.VOLUNTEER_REVIEWER,
  UserRole.CITY_COORDINATOR,
  UserRole.CATEGORY_COORDINATOR,
  UserRole.SUPER_ADMIN,
];

export function AdminAlumniActions({
  userId,
  initialRole,
  initialVerificationStatus,
}: {
  userId: string;
  initialRole: UserRole;
  initialVerificationStatus: VerificationStatus;
}) {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(initialVerificationStatus);
  const [role, setRole] = useState<UserRole>(initialRole === UserRole.PENDING_ALUMNI ? UserRole.VERIFIED_ALUMNI : initialRole);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex min-w-[240px] flex-col gap-2">
      <select
        value={verificationStatus}
        disabled={isPending}
        onChange={(event) => setVerificationStatus(event.target.value as VerificationStatus)}
        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700"
      >
        {Object.values(VerificationStatus).map((status) => (
          <option key={status} value={status}>
            {status.replaceAll("_", " ")}
          </option>
        ))}
      </select>
      <select
        value={role}
        disabled={isPending}
        onChange={(event) => setRole(event.target.value as UserRole)}
        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700"
      >
        {manageableRoles.map((option) => (
          <option key={option} value={option}>
            {roleLabels[option]}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={isPending}
        className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
        onClick={() =>
          startTransition(async () => {
            const result = await updateUserVerificationAction({
              userId,
              verificationStatus,
              role: verificationStatus === VerificationStatus.VERIFIED ? role : UserRole.PENDING_ALUMNI,
            });

            if (!result.success) {
              toast.error(result.message);
              return;
            }

            toast.success(result.message);
          })
        }
      >
        {isPending ? "Saving..." : "Save access"}
      </button>
    </div>
  );
}

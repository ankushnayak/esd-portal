"use client";

import { useTransition } from "react";
import { signOut } from "next-auth/react";

export function SignOutButton({ className }: { className?: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      className={className}
      onClick={() =>
        startTransition(async () => {
          await signOut({ callbackUrl: "/login" });
        })
      }
    >
      {isPending ? "Signing out..." : "Sign out"}
    </button>
  );
}

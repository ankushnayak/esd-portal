import { navigation } from "@/lib/constants";
import { requireSession } from "@/lib/auth/session";
import { canReviewCase } from "@/lib/auth/roles";
import { PortalHeader } from "@/components/layout/portal-header";
import { PortalNav } from "@/components/layout/portal-nav";

export default async function AlumniLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  const isOperationalUser = canReviewCase(session.user.role);
  const showVerificationBanner = session.user.verificationStatus !== "VERIFIED";

  return (
    <div className="app-shell min-h-screen">
      <PortalHeader
        role={session.user.role}
        verificationStatus={session.user.verificationStatus}
        switchHref={isOperationalUser ? "/admin" : undefined}
        switchLabel={isOperationalUser ? "Open admin console" : undefined}
      />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <div className="flex flex-col gap-4">
          <PortalNav items={navigation.alumni} title="Alumni Area" />
          {showVerificationBanner ? (
            <div className="surface-card-muted border-amber-200 bg-amber-50/90 p-4 text-sm text-amber-950">
              <p className="font-semibold">Your profile is not verified yet.</p>
              <p className="mt-2">
                You can still complete your profile and review existing drafts, but case submission opens after alumni
                verification.
              </p>
            </div>
          ) : null}
        </div>
        <div className="flex flex-col gap-6">{children}</div>
      </div>
    </div>
  );
}

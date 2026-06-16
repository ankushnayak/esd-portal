import { UserRole } from "@prisma/client";
import { navigation } from "@/lib/constants";
import { requireRole } from "@/lib/auth/session";
import { PortalNav } from "@/components/layout/portal-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole(UserRole.VOLUNTEER_REVIEWER);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <PortalNav items={navigation.admin} title="Admin Console" />
        <div className="flex flex-col gap-6">{children}</div>
      </div>
    </div>
  );
}

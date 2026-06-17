import { UserRole } from "@prisma/client";
import { navigation } from "@/lib/constants";
import { hasRole } from "@/lib/auth/roles";
import { requireRole } from "@/lib/auth/session";
import { PortalHeader } from "@/components/layout/portal-header";
import { PortalNav } from "@/components/layout/portal-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole(UserRole.VOLUNTEER_REVIEWER);
  const items = navigation.admin.filter((item) => {
    if (item.href === "/admin/alumni") {
      return hasRole(session.user.role, UserRole.CITY_COORDINATOR);
    }

    if (item.href === "/admin/settings") {
      return hasRole(session.user.role, UserRole.SUPER_ADMIN);
    }

    return true;
  });

  return (
    <div className="app-shell min-h-screen">
      <PortalHeader role={session.user.role} verificationStatus={session.user.verificationStatus} switchHref="/alumni" switchLabel="Open alumni area" />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <PortalNav items={items} title="Admin Console" />
        <div className="flex flex-col gap-6">{children}</div>
      </div>
    </div>
  );
}

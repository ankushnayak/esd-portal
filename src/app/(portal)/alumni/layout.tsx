import { navigation } from "@/lib/constants";
import { requireSession } from "@/lib/auth/session";
import { PortalNav } from "@/components/layout/portal-nav";

export default async function AlumniLayout({ children }: { children: React.ReactNode }) {
  await requireSession();

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <PortalNav items={navigation.alumni} title="Alumni Area" />
        <div className="flex flex-col gap-6">{children}</div>
      </div>
    </div>
  );
}

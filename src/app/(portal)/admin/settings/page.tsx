import { UserRole } from "@prisma/client";
import { requireRole } from "@/lib/auth/session";
import { AdminSettingsForm } from "@/components/admin/admin-settings-form";
import { getPlatformSettings } from "@/lib/settings";

export default async function AdminSettingsPage() {
  await requireRole(UserRole.SUPER_ADMIN);
  const settings = await getPlatformSettings();

  return (
    <>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Settings</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Platform and deployment settings</h1>
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,460px)_1fr]">
        <AdminSettingsForm
          defaultValues={{
            publicDashboardEnabled: settings.publicDashboardEnabled,
            sevaDayLabel: settings.sevaDayLabel,
          }}
        />
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-lg font-semibold text-slate-950">Current public configuration</p>
          <dl className="mt-4 grid gap-4 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 p-4">
              <dt className="font-semibold text-slate-900">Dashboard visibility</dt>
              <dd className="mt-1">{settings.publicDashboardEnabled ? "Visible to public visitors" : "Hidden from public visitors"}</dd>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <dt className="font-semibold text-slate-900">Seva day label</dt>
              <dd className="mt-1">{settings.sevaDayLabel}</dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  );
}

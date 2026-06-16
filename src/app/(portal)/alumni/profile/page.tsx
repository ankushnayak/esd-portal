import { requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { ProfileForm } from "@/components/forms/profile-form";

export default async function AlumniProfilePage() {
  const session = await requireSession();
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { alumniProfile: true },
  });

  if (!user) {
    return null;
  }

  return (
    <>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Profile</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Manage your alumni profile</h1>
      </div>
      <ProfileForm
        defaultValues={{
          name: user.name,
          email: user.email,
          phone: user.phone ?? "",
          batchYear: user.alumniProfile?.batchYear ?? undefined,
          institution: user.alumniProfile?.institution ?? "",
          program: user.alumniProfile?.program ?? "",
          profession: user.alumniProfile?.profession ?? "",
          specialty: user.alumniProfile?.specialty ?? "",
          city: user.alumniProfile?.city ?? "",
          state: user.alumniProfile?.state ?? "",
          country: user.alumniProfile?.country ?? "India",
          profilePhotoUrl: user.alumniProfile?.profilePhotoUrl ?? "",
          publicProfileOptIn: user.alumniProfile?.publicProfileOptIn ?? false,
          availabilityPledge: user.alumniProfile?.availabilityPledge ?? "",
        }}
      />
    </>
  );
}

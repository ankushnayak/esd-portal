import { AdminAlumniTable, type AdminAlumniRow } from "@/components/tables/admin-alumni-table";
import { prisma } from "@/lib/db/prisma";

export default async function AdminAlumniPage() {
  const rows = await prisma.user.findMany({
    include: { alumniProfile: true },
    orderBy: { createdAt: "desc" },
  });

  const data: AdminAlumniRow[] = rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    city: row.alumniProfile?.city ?? "-",
    profession: row.alumniProfile?.profession ?? "-",
    verificationStatus: row.alumniProfile?.verificationStatus ?? "PENDING",
  }));

  return (
    <>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Alumni management</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Verify alumni and manage access</h1>
      </div>
      <AdminAlumniTable data={data} />
    </>
  );
}

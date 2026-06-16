import { VerificationStatus } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/tables/data-table";
import { prisma } from "@/lib/db/prisma";

type Row = {
  id: string;
  name: string;
  email: string;
  city: string;
  profession: string;
  verificationStatus: string;
};

export default async function AdminAlumniPage() {
  const rows = await prisma.user.findMany({
    include: { alumniProfile: true },
    orderBy: { createdAt: "desc" },
  });

  const data: Row[] = rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    city: row.alumniProfile?.city ?? "-",
    profession: row.alumniProfile?.profession ?? "-",
    verificationStatus: row.alumniProfile?.verificationStatus ?? "PENDING",
  }));

  const columns: ColumnDef<Row>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "city", header: "City" },
    { accessorKey: "profession", header: "Profession" },
    { accessorKey: "verificationStatus", header: "Verification" },
    {
      id: "actions",
      header: "Queue",
      cell: ({ row }) =>
        row.original.verificationStatus === VerificationStatus.VERIFIED ? (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">Verified</span>
        ) : (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">Needs review</span>
        ),
    },
  ];

  return (
    <>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Alumni management</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Verify alumni and manage access</h1>
      </div>
      <DataTable data={data} columns={columns} searchPlaceholder="Search alumni..." />
    </>
  );
}

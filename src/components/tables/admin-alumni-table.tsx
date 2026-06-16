"use client";

import { UserRole, VerificationStatus } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { AdminAlumniActions } from "@/components/admin/admin-alumni-actions";
import { DataTable } from "@/components/tables/data-table";

export type AdminAlumniRow = {
  id: string;
  name: string;
  email: string;
  city: string;
  profession: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
};

const columns: ColumnDef<AdminAlumniRow>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "city", header: "City" },
  { accessorKey: "profession", header: "Profession" },
  { accessorKey: "verificationStatus", header: "Verification" },
  {
    id: "actions",
    header: "Access",
    cell: ({ row }) => (
      <AdminAlumniActions
        userId={row.original.id}
        initialRole={row.original.role}
        initialVerificationStatus={row.original.verificationStatus}
      />
    ),
  },
];

export function AdminAlumniTable({ data }: { data: AdminAlumniRow[] }) {
  return (
    <DataTable
      data={data}
      columns={columns}
      searchPlaceholder="Search alumni..."
      emptyTitle="No alumni records yet"
      emptyDescription="Alumni accounts will appear here after people register or are added to the portal."
    />
  );
}

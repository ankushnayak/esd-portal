"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/tables/data-table";

export type AdminAlumniRow = {
  id: string;
  name: string;
  email: string;
  city: string;
  profession: string;
  verificationStatus: string;
};

const columns: ColumnDef<AdminAlumniRow>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "city", header: "City" },
  { accessorKey: "profession", header: "Profession" },
  { accessorKey: "verificationStatus", header: "Verification" },
  {
    id: "actions",
    header: "Queue",
    cell: ({ row }) =>
      row.original.verificationStatus === "VERIFIED" ? (
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">Verified</span>
      ) : (
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">Needs review</span>
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

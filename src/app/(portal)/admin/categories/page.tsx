import { prisma } from "@/lib/db/prisma";

export default async function AdminCategoriesPage() {
  const categories = await prisma.sevaCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Category management</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Seva categories and subcategories</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          This catalog defines how alumni submissions are grouped across dashboards, reports, and review workflows.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {categories.map((item) => (
          <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-lg font-semibold text-slate-950">{item.name}</p>
            <p className="mt-2 text-sm text-slate-600">{item.description ?? "No description available."}</p>
          </div>
        ))}
      </div>
    </>
  );
}

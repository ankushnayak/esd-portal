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

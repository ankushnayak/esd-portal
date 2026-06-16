export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
      <p className="text-lg font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm">{description}</p>
    </div>
  );
}

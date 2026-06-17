export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="surface-card-muted border-dashed p-8 text-center text-slate-600">
      <p className="text-lg font-semibold text-slate-900">{title}</p>
      <p className="mt-3 text-sm leading-6">{description}</p>
    </div>
  );
}

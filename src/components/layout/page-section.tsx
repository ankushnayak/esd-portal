export function PageSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-8 sm:gap-10">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-emerald-700 sm:text-[0.95rem]">{eyebrow}</p>
        ) : null}
        <h2 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
          {title}
        </h2>
        {description ? <p className="mt-4 max-w-2xl text-[1.05rem] leading-8 text-slate-600">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

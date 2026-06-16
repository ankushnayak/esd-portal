import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="max-w-lg rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Page not found</h1>
        <p className="mt-3 text-slate-600">The page you requested does not exist or may have been moved.</p>
        <Link href="/" className="mt-6 inline-flex rounded-2xl bg-blue-950 px-4 py-3 font-semibold text-white">
          Return home
        </Link>
      </div>
    </main>
  );
}

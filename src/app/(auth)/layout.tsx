export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="app-shell min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.08),_transparent_58%)]" />
      {children}
    </main>
  );
}

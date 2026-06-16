import { requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils/format";
import { EmptyState } from "@/components/app/empty-state";

export default async function CertificatesPage() {
  const session = await requireSession();
  const certificates = await prisma.certificate.findMany({
    where: { userId: session.user.id },
    orderBy: { issuedAt: "desc" },
  });

  return (
    <>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Certificates & recognition</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Download earned certificates</h1>
      </div>
      {certificates.length ? (
        <div className="grid gap-4">
          {certificates.map((item) => (
            <a key={item.id} href={`/api/certificates/${item.id}`} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-lg font-semibold text-slate-950">{item.certificateNumber}</p>
              <p className="mt-2 text-sm text-slate-600">Issued on {formatDate(item.issuedAt)}</p>
            </a>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No certificates yet"
          description="Certificates will appear here after approved contribution periods are processed by the alumni team."
        />
      )}
    </>
  );
}

import { createElement } from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import { CertificatePeriodType } from "@prisma/client";
import { getCurrentSession } from "@/lib/auth/session";
import { CertificateDocument } from "@/lib/certificates/generate";
import { prisma } from "@/lib/db/prisma";

function periodLabel(type: CertificatePeriodType, start: Date, end: Date) {
  if (type === CertificatePeriodType.MONTHLY) {
    return `${start.toLocaleString("en-IN", { month: "long", year: "numeric" })}`;
  }

  if (type === CertificatePeriodType.YEARLY) {
    return `${start.getFullYear()} - ${end.getFullYear()}`;
  }

  return `${start.toLocaleDateString("en-IN")} to ${end.toLocaleDateString("en-IN")}`;
}

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getCurrentSession();

  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
  }

  const { id } = await context.params;
  const certificate = await prisma.certificate.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!certificate || certificate.userId !== session.user.id) {
    return NextResponse.json({ success: false, message: "Certificate not found." }, { status: 404 });
  }

  const document = createElement(CertificateDocument, {
    alumniName: certificate.user.name,
    periodLabel: periodLabel(certificate.periodType, certificate.periodStart, certificate.periodEnd),
    totalCases: certificate.totalCases,
    totalValue: certificate.totalValue.toNumber(),
    beneficiariesHelped: certificate.beneficiariesHelped,
    certificateNumber: certificate.certificateNumber,
    issueDate: certificate.issuedAt,
  });

  const buffer = await renderToBuffer(document as Parameters<typeof renderToBuffer>[0]);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${certificate.certificateNumber}.pdf"`,
    },
  });
}

import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit/log";
import { hasRole } from "@/lib/auth/roles";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { toCsv } from "@/lib/reports/csv";

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();

  if (!session?.user || !hasRole(session.user.role, UserRole.VOLUNTEER_REVIEWER)) {
    return NextResponse.json({ success: false, message: "Reviewer access required." }, { status: 403 });
  }

  const kind = request.nextUrl.searchParams.get("kind") ?? "approved-cases";

  let rows: Record<string, string | number | null | undefined>[] = [];

  switch (kind) {
    case "alumni":
      rows = (
        await prisma.user.findMany({
          include: { alumniProfile: true },
        })
      ).map((item) => ({
        name: item.name,
        email: item.email,
        city: item.alumniProfile?.city,
        profession: item.alumniProfile?.profession,
        verificationStatus: item.alumniProfile?.verificationStatus,
      }));
      break;
    case "category":
      rows = (
        await prisma.sevaCase.groupBy({
          by: ["categoryId"],
          where: { status: "APPROVED", deletedAt: null },
          _count: true,
          _sum: { actualAmount: true, beneficiaryCount: true },
        })
      ).map((item) => ({
        categoryId: item.categoryId,
        cases: item._count,
        value: Number(item._sum.actualAmount ?? 0),
        beneficiaries: Number(item._sum.beneficiaryCount ?? 0),
      }));
      break;
    case "city":
      rows = (
        await prisma.sevaCase.groupBy({
          by: ["city", "state"],
          where: { status: "APPROVED", deletedAt: null },
          _count: true,
          _sum: { actualAmount: true, beneficiaryCount: true },
        })
      ).map((item) => ({
        city: item.city,
        state: item.state,
        cases: item._count,
        value: Number(item._sum.actualAmount ?? 0),
        beneficiaries: Number(item._sum.beneficiaryCount ?? 0),
      }));
      break;
    default:
      rows = (
        await prisma.sevaCase.findMany({
          where: { status: "APPROVED", deletedAt: null },
          include: { user: true, category: true },
        })
      ).map((item) => ({
        caseNumber: item.caseNumber,
        title: item.title,
        alumnus: item.user.name,
        category: item.category.name,
        city: item.city,
        state: item.state,
        amount: Number(item.actualAmount),
        beneficiaries: item.beneficiaryCount,
      }));
  }

  await createAuditLog({
    actorId: session.user.id,
    action: "REPORT_EXPORTED",
    entityType: "Report",
    entityId: kind,
  });

  return new NextResponse(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${kind}.csv"`,
    },
  });
}

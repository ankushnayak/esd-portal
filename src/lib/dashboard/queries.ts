import { Prisma, PublicVisibility, SevaCaseStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { serializePublicStory } from "@/lib/dashboard/public-view";

const publicWhere: Prisma.SevaCaseWhereInput = {
  deletedAt: null,
  status: SevaCaseStatus.APPROVED,
};

const emptyPublicDashboardData = {
  summary: {
    totalCases: 0,
    totalValue: 0,
    totalBeneficiaries: 0,
    totalAlumni: 0,
  },
  monthly: [],
  byCategory: [],
  byCity: [],
  byProfession: [],
  stories: [],
};

export async function getPublicDashboardData() {
  try {
    const [summary, monthly, byCategory, byCity, byProfession, stories] = await Promise.all([
      prisma.sevaCase.aggregate({
        where: publicWhere,
        _count: true,
        _sum: {
          actualAmount: true,
          beneficiaryCount: true,
        },
      }),
      prisma.sevaCase.groupBy({
        by: ["date"],
        where: publicWhere,
        _count: true,
        _sum: { actualAmount: true, beneficiaryCount: true },
        orderBy: { date: "asc" },
      }),
      prisma.sevaCase.groupBy({
        by: ["categoryId"],
        where: publicWhere,
        _count: true,
        _sum: { actualAmount: true, beneficiaryCount: true },
        orderBy: { _count: { categoryId: "desc" } },
        take: 8,
      }),
      prisma.sevaCase.groupBy({
        by: ["city", "state"],
        where: publicWhere,
        _count: true,
        _sum: { actualAmount: true, beneficiaryCount: true },
        orderBy: { _sum: { actualAmount: "desc" } },
        take: 10,
      }),
      prisma.sevaCase.groupBy({
        by: ["profession"],
        where: publicWhere,
        _count: true,
        _sum: { actualAmount: true, beneficiaryCount: true },
        orderBy: { _sum: { actualAmount: "desc" } },
        take: 8,
      }),
      prisma.sevaCase.findMany({
        where: {
          ...publicWhere,
          featured: true,
          publicVisibility: { in: [PublicVisibility.ANONYMIZED, PublicVisibility.PUBLIC_WITH_CONSENT] },
        },
        orderBy: { approvedAt: "desc" },
        take: 6,
        include: {
          user: { select: { name: true } },
          privateData: true,
          attachments: { where: { isPublicEligible: true }, take: 1 },
          category: true,
        },
      }),
    ]);

    const categories = await prisma.sevaCategory.findMany({
      where: { id: { in: byCategory.map((item) => item.categoryId) } },
      select: { id: true, name: true },
    });

    const categoryMap = new Map(categories.map((item) => [item.id, item.name]));
    const participatingAlumni = await prisma.sevaCase.findMany({
      where: publicWhere,
      distinct: ["userId"],
      select: { userId: true },
    });

    return {
      summary: {
        totalCases: summary._count,
        totalValue: Number(summary._sum.actualAmount ?? 0),
        totalBeneficiaries: Number(summary._sum.beneficiaryCount ?? 0),
        totalAlumni: participatingAlumni.length,
      },
      monthly: monthly.map((item) => ({
        label: item.date.toISOString().slice(0, 7),
        cases: item._count,
        value: Number(item._sum.actualAmount ?? 0),
        beneficiaries: Number(item._sum.beneficiaryCount ?? 0),
      })),
      byCategory: byCategory.map((item) => ({
        label: categoryMap.get(item.categoryId) ?? "Other",
        cases: item._count,
        value: Number(item._sum.actualAmount ?? 0),
        beneficiaries: Number(item._sum.beneficiaryCount ?? 0),
      })),
      byCity: byCity.map((item) => ({
        label: `${item.city}, ${item.state}`,
        cases: item._count,
        value: Number(item._sum.actualAmount ?? 0),
        beneficiaries: Number(item._sum.beneficiaryCount ?? 0),
      })),
      byProfession: byProfession.map((item) => ({
        label: item.profession,
        cases: item._count,
        value: Number(item._sum.actualAmount ?? 0),
        beneficiaries: Number(item._sum.beneficiaryCount ?? 0),
      })),
      stories: stories.map((story) =>
        serializePublicStory({
          id: story.id,
          title: story.title,
          city: story.city,
          state: story.state,
          publicSummary: story.publicSummary,
          description: story.description,
          categoryName: story.category.name,
          publicVisibility: story.publicVisibility,
          consentObtained: story.consentObtained,
          beneficiaryName: story.privateData?.name,
          publicPhotoUrl: story.attachments[0]?.fileUrl,
        }),
      ),
    };
  } catch {
    return emptyPublicDashboardData;
  }
}

export async function getAdminDashboardData() {
  const [users, pendingProfiles, cases, pendingCases, approvedCases, recentAudit] = await Promise.all([
    prisma.user.count(),
    prisma.alumniProfile.count({ where: { verificationStatus: "PENDING" } }),
    prisma.sevaCase.count({ where: { deletedAt: null } }),
    prisma.sevaCase.count({ where: { deletedAt: null, status: "SUBMITTED" } }),
    prisma.sevaCase.aggregate({
      where: { deletedAt: null, status: "APPROVED" },
      _sum: { actualAmount: true, beneficiaryCount: true },
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { actor: { select: { name: true, email: true } } },
    }),
  ]);

  return {
    totalAlumni: users,
    pendingProfiles,
    totalCases: cases,
    pendingCases,
    approvedValue: Number(approvedCases._sum.actualAmount ?? 0),
    beneficiariesHelped: Number(approvedCases._sum.beneficiaryCount ?? 0),
    recentAudit,
    publicDashboard: await getPublicDashboardData(),
  };
}

export async function getAlumniDashboardData(userId: string) {
  const [summary, cases, badges, certificates] = await Promise.all([
    prisma.sevaCase.aggregate({
      where: { userId, deletedAt: null },
      _count: true,
      _sum: { actualAmount: true, beneficiaryCount: true },
    }),
    prisma.sevaCase.findMany({
      where: { userId, deletedAt: null },
      orderBy: { date: "asc" },
      select: { date: true, actualAmount: true, beneficiaryCount: true, status: true },
    }),
    prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { awardedAt: "desc" },
    }),
    prisma.certificate.findMany({
      where: { userId },
      orderBy: { issuedAt: "desc" },
      take: 6,
    }),
  ]);

  return {
    summary: {
      totalCases: summary._count,
      totalValue: Number(summary._sum.actualAmount ?? 0),
      totalBeneficiaries: Number(summary._sum.beneficiaryCount ?? 0),
    },
    approvedCases: cases.filter((item) => item.status === "APPROVED").length,
    pendingCases: cases.filter((item) => ["SUBMITTED", "CLARIFICATION_REQUESTED"].includes(item.status)).length,
    monthly: cases.map((item) => ({
      label: item.date.toISOString().slice(0, 7),
      value: Number(item.actualAmount),
      beneficiaries: item.beneficiaryCount,
    })),
    badges,
    certificates,
  };
}

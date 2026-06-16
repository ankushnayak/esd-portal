"use server";

import { SevaCaseStatus, UserRole, VerificationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit/log";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { reviewCaseSchema } from "@/lib/validation/case";
import { resolveReviewTransition } from "@/lib/workflows/review";

export async function reviewSevaCaseAction(payload: unknown) {
  const session = await requireRole(UserRole.VOLUNTEER_REVIEWER);
  const parsed = reviewCaseSchema.safeParse(payload);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid review request." };
  }

  const currentCase = await prisma.sevaCase.findUnique({
    where: { id: parsed.data.sevaCaseId },
  });

  if (!currentCase) {
    return { success: false, message: "Seva case not found." };
  }

  const transition = resolveReviewTransition(parsed.data.action);
  const nextStatus = transition.status;

  await prisma.sevaCase.update({
    where: { id: parsed.data.sevaCaseId },
    data: {
      status: nextStatus,
      featured: parsed.data.featured ?? currentCase.featured,
      publicVisibility: parsed.data.publicVisibility ?? currentCase.publicVisibility,
      approvedAt: nextStatus === SevaCaseStatus.APPROVED ? new Date() : currentCase.approvedAt,
      approvedById: nextStatus === SevaCaseStatus.APPROVED ? session.user.id : currentCase.approvedById,
      rejectedAt: nextStatus === SevaCaseStatus.REJECTED ? new Date() : currentCase.rejectedAt,
      rejectedById: nextStatus === SevaCaseStatus.REJECTED ? session.user.id : currentCase.rejectedById,
      rejectionReason: nextStatus === SevaCaseStatus.REJECTED ? parsed.data.comments : null,
      clarificationNotes:
        nextStatus === SevaCaseStatus.CLARIFICATION_REQUESTED ? parsed.data.comments : currentCase.clarificationNotes,
      reviews: {
        create: {
          reviewerId: session.user.id,
          action: transition.auditAction,
          comments: parsed.data.comments,
          previousStatus: currentCase.status,
          newStatus: nextStatus,
        },
      },
    },
  });

  await createAuditLog({
    actorId: session.user.id,
    action: "CASE_REVIEWED",
    entityType: "SevaCase",
    entityId: parsed.data.sevaCaseId,
    metadataJson: parsed.data,
  });

  revalidatePath("/admin/cases");
  revalidatePath("/dashboard");
  revalidatePath("/stories");

  return { success: true, message: `Case ${nextStatus.toLowerCase().replaceAll("_", " ")}.` };
}

export async function updateUserVerificationAction(input: {
  userId: string;
  verificationStatus: VerificationStatus;
  role?: UserRole;
}) {
  const session = await requireRole(UserRole.CITY_COORDINATOR);

  await prisma.user.update({
    where: { id: input.userId },
    data: {
      role: input.role ?? undefined,
      alumniProfile: {
        update: {
          verificationStatus: input.verificationStatus,
          verifiedAt: input.verificationStatus === VerificationStatus.VERIFIED ? new Date() : null,
          verifiedById: session.user.id,
        },
      },
    },
  });

  await createAuditLog({
    actorId: session.user.id,
    action: "ALUMNI_VERIFICATION_UPDATED",
    entityType: "User",
    entityId: input.userId,
    metadataJson: input,
  });

  revalidatePath("/admin/alumni");
  revalidatePath("/alumni");

  return { success: true, message: "Alumni verification updated." };
}

export async function updateSettingsAction(input: { publicDashboardEnabled: boolean; sevaDayLabel: string }) {
  const session = await requireRole(UserRole.SUPER_ADMIN);
  const existing = await prisma.setting.findUnique({
    where: { key: "platform" },
    select: { valueJson: true },
  });
  const currentValue =
    existing && typeof existing.valueJson === "object" && existing.valueJson ? existing.valueJson : {};
  const nextValue = {
    ...currentValue,
    publicDashboardEnabled: input.publicDashboardEnabled,
    sevaDayLabel: input.sevaDayLabel,
  };

  await prisma.setting.upsert({
    where: { key: "platform" },
    create: {
      key: "platform",
      valueJson: nextValue,
      updatedById: session.user.id,
    },
    update: {
      valueJson: nextValue,
      updatedById: session.user.id,
    },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/dashboard");
  revalidatePath("/participate");

  return { success: true, message: "Settings updated." };
}

export async function signOutAction() {
  return { success: true };
}

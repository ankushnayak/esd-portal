"use server";

import bcrypt from "bcryptjs";
import { UserRole, VerificationStatus } from "@prisma/client";
import { createAuditLog } from "@/lib/audit/log";
import { prisma } from "@/lib/db/prisma";
import { sendTemplateEmail } from "@/lib/email/service";
import { registerSchema } from "@/lib/validation/auth";

export async function registerAlumniAction(payload: unknown) {
  const parsed = registerSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Please review the form fields.",
    };
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });

  if (existing) {
    return { success: false, message: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      passwordHash,
      name: parsed.data.name,
      phone: parsed.data.phone,
      role: UserRole.PENDING_ALUMNI,
      emailVerifiedAt: new Date(),
      alumniProfile: {
        create: {
          batchYear: parsed.data.batchYear,
          institution: parsed.data.institution,
          program: parsed.data.program,
          profession: parsed.data.profession,
          city: parsed.data.city,
          state: parsed.data.state,
          verificationStatus: VerificationStatus.PENDING,
        },
      },
    },
  });

  await createAuditLog({
    actorId: user.id,
    action: "ALUMNI_REGISTERED",
    entityType: "User",
    entityId: user.id,
  });

  try {
    await sendTemplateEmail({
      templateKey: "welcome",
      to: user.email,
      userId: user.id,
      variables: { name: user.name },
      dryRun: true,
    });
  } catch {
    // Seed data may not exist yet in first-run environments.
  }

  return {
    success: true,
    message: "Registration complete. Your alumni profile is pending verification.",
  };
}

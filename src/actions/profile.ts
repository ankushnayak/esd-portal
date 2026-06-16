"use server";

import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit/log";
import { prisma } from "@/lib/db/prisma";
import { requireSession } from "@/lib/auth/session";
import { alumniProfileSchema } from "@/lib/validation/profile";

export async function updateAlumniProfileAction(payload: unknown) {
  const session = await requireSession();
  const parsed = alumniProfileSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Unable to save profile.",
    };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      alumniProfile: {
        upsert: {
          create: {
            batchYear: parsed.data.batchYear,
            institution: parsed.data.institution,
            program: parsed.data.program,
            profession: parsed.data.profession,
            specialty: parsed.data.specialty,
            city: parsed.data.city,
            state: parsed.data.state,
            country: parsed.data.country,
            publicProfileOptIn: parsed.data.publicProfileOptIn,
            sevaCategories: parsed.data.sevaCategories,
            availabilityPledge: parsed.data.availabilityPledge,
            profilePhotoUrl: parsed.data.profilePhotoUrl,
          },
          update: {
            batchYear: parsed.data.batchYear,
            institution: parsed.data.institution,
            program: parsed.data.program,
            profession: parsed.data.profession,
            specialty: parsed.data.specialty,
            city: parsed.data.city,
            state: parsed.data.state,
            country: parsed.data.country,
            publicProfileOptIn: parsed.data.publicProfileOptIn,
            sevaCategories: parsed.data.sevaCategories,
            availabilityPledge: parsed.data.availabilityPledge,
            profilePhotoUrl: parsed.data.profilePhotoUrl,
          },
        },
      },
    },
  });

  await createAuditLog({
    actorId: session.user.id,
    action: "PROFILE_UPDATED",
    entityType: "User",
    entityId: session.user.id,
  });

  revalidatePath("/alumni/profile");

  return { success: true, message: "Profile updated successfully." };
}

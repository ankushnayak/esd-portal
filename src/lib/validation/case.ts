import { PublicVisibility, SevaCaseStatus } from "@prisma/client";
import { z } from "zod";

export const sevaCaseSchema = z
  .object({
    caseId: z.string().optional(),
    title: z.string().trim().min(4).max(160),
    date: z.coerce.date(),
    categoryId: z.string().min(1),
    subcategoryId: z.string().optional().nullable(),
    profession: z.string().trim().min(2).max(120),
    city: z.string().trim().min(2).max(120),
    state: z.string().trim().min(2).max(120),
    beneficiaryType: z.enum(["INDIVIDUAL", "FAMILY", "SCHOOL", "HOSPITAL", "COMMUNITY", "NGO", "OTHER"]),
    beneficiaryName: z.string().trim().max(120).optional(),
    beneficiaryContact: z.string().trim().max(120).optional(),
    beneficiaryLocation: z.string().trim().max(160).optional(),
    beneficiaryNotes: z.string().trim().max(500).optional(),
    beneficiaryCount: z.coerce.number().int().min(1),
    description: z.string().trim().min(20).max(2000),
    estimatedValue: z.coerce.number().min(0),
    actualAmount: z.coerce.number().min(0),
    currency: z.string().trim().min(3).max(3).default("INR"),
    consentObtained: z.boolean().default(false),
    publicVisibility: z.nativeEnum(PublicVisibility),
    publicSummary: z.string().trim().max(500).optional(),
    internalNotes: z.string().trim().max(1000).optional(),
    action: z.enum(["save-draft", "submit"]).default("save-draft"),
    attachmentIds: z.array(z.string()).default([]),
    consentAttachmentIds: z.array(z.string()).default([]),
    status: z.nativeEnum(SevaCaseStatus).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.publicVisibility === PublicVisibility.PUBLIC_WITH_CONSENT) {
      if (!value.consentObtained) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["consentObtained"],
          message: "Consent must be obtained for public stories with beneficiary identity.",
        });
      }

      if (value.consentAttachmentIds.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["consentAttachmentIds"],
          message: "Consent attachment is required for public stories with name or photo.",
        });
      }
    }
  });

export const reviewCaseSchema = z.object({
  sevaCaseId: z.string(),
  action: z.enum(["APPROVE", "REJECT", "CLARIFICATION_REQUESTED"]),
  comments: z.string().trim().max(1000).optional(),
  featured: z.boolean().optional(),
  publicVisibility: z.nativeEnum(PublicVisibility).optional(),
});

import { describe, expect, it } from "vitest";
import { PublicVisibility } from "@prisma/client";
import { sevaCaseSchema } from "@/lib/validation/case";

describe("seva case validation", () => {
  const baseCase = {
    title: "Free school support",
    date: new Date(),
    categoryId: "cat_1",
    profession: "Teacher",
    city: "Indore",
    state: "Madhya Pradesh",
    beneficiaryType: "SCHOOL",
    beneficiaryCount: 10,
    description: "Provided books and mentoring support to children preparing for exams.",
    estimatedValue: 3000,
    actualAmount: 2000,
    currency: "INR",
    consentObtained: false,
    publicVisibility: PublicVisibility.PRIVATE,
    attachmentIds: [],
    consentAttachmentIds: [],
  };

  it("rejects negative financial amounts", () => {
    const parsed = sevaCaseSchema.safeParse({ ...baseCase, actualAmount: -1 });
    expect(parsed.success).toBe(false);
  });

  it("requires consent proof for public with consent visibility", () => {
    const parsed = sevaCaseSchema.safeParse({
      ...baseCase,
      publicVisibility: PublicVisibility.PUBLIC_WITH_CONSENT,
      consentObtained: true,
    });
    expect(parsed.success).toBe(false);
  });
});

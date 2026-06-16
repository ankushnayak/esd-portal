import { describe, expect, it } from "vitest";
import { ReviewAction, SevaCaseStatus } from "@prisma/client";
import { resolveReviewTransition } from "@/lib/workflows/review";

describe("admin review flow", () => {
  it("maps approval to approved state", () => {
    const transition = resolveReviewTransition("APPROVE");
    expect(transition.status).toBe(SevaCaseStatus.APPROVED);
    expect(transition.auditAction).toBe(ReviewAction.APPROVED);
  });

  it("maps clarification requests correctly", () => {
    const transition = resolveReviewTransition("CLARIFICATION_REQUESTED");
    expect(transition.status).toBe(SevaCaseStatus.CLARIFICATION_REQUESTED);
  });
});

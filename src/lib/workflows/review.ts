import { ReviewAction, SevaCaseStatus } from "@prisma/client";

export function resolveReviewTransition(action: "APPROVE" | "REJECT" | "CLARIFICATION_REQUESTED") {
  if (action === "APPROVE") {
    return { status: SevaCaseStatus.APPROVED, auditAction: ReviewAction.APPROVED };
  }

  if (action === "REJECT") {
    return { status: SevaCaseStatus.REJECTED, auditAction: ReviewAction.REJECTED };
  }

  return {
    status: SevaCaseStatus.CLARIFICATION_REQUESTED,
    auditAction: ReviewAction.CLARIFICATION_REQUESTED,
  };
}

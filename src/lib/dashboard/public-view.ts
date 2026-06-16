import { PublicVisibility, SevaCaseStatus } from "@prisma/client";
import { isBeneficiaryIdentityAllowed } from "@/lib/utils/public";

export function isCaseEligibleForPublicDashboard(status: SevaCaseStatus) {
  return status === SevaCaseStatus.APPROVED;
}

export function serializePublicStory(input: {
  id: string;
  title: string;
  city: string;
  state: string;
  publicSummary?: string | null;
  description: string;
  categoryName: string;
  publicVisibility: PublicVisibility;
  consentObtained: boolean;
  beneficiaryName?: string | null;
  publicPhotoUrl?: string | null;
}) {
  return {
    id: input.id,
    title: input.title,
    city: input.city,
    state: input.state,
    publicSummary: input.publicSummary ?? input.description,
    category: { name: input.categoryName },
    beneficiaryName:
      isBeneficiaryIdentityAllowed(input.publicVisibility, input.consentObtained) ? input.beneficiaryName ?? null : null,
    publicPhotoUrl:
      isBeneficiaryIdentityAllowed(input.publicVisibility, input.consentObtained) ? input.publicPhotoUrl ?? null : null,
  };
}

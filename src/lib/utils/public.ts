import { PublicVisibility } from "@prisma/client";

export function isBeneficiaryIdentityAllowed(visibility: PublicVisibility, consentObtained: boolean) {
  return visibility === PublicVisibility.PUBLIC_WITH_CONSENT && consentObtained;
}

export function publicStoryLabel(visibility: PublicVisibility) {
  if (visibility === PublicVisibility.PUBLIC_WITH_CONSENT) {
    return "Public with consent";
  }

  if (visibility === PublicVisibility.ANONYMIZED) {
    return "Public anonymized";
  }

  return "Private";
}

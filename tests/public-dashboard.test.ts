import { describe, expect, it } from "vitest";
import { PublicVisibility, SevaCaseStatus } from "@prisma/client";
import { isCaseEligibleForPublicDashboard, serializePublicStory } from "@/lib/dashboard/public-view";

describe("public dashboard privacy", () => {
  it("only includes approved cases in public dashboards", () => {
    expect(isCaseEligibleForPublicDashboard(SevaCaseStatus.APPROVED)).toBe(true);
    expect(isCaseEligibleForPublicDashboard(SevaCaseStatus.SUBMITTED)).toBe(false);
  });

  it("strips beneficiary identity without explicit consent visibility", () => {
    const story = serializePublicStory({
      id: "1",
      title: "Medical camp",
      city: "Bhopal",
      state: "Madhya Pradesh",
      publicSummary: null,
      description: "Community support",
      categoryName: "Medical seva",
      publicVisibility: PublicVisibility.ANONYMIZED,
      consentObtained: false,
      beneficiaryName: "Private Name",
      publicPhotoUrl: "/proof.png",
    });

    expect(story.beneficiaryName).toBeNull();
    expect(story.publicPhotoUrl).toBeNull();
  });
});

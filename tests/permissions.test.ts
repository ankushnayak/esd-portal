import { describe, expect, it } from "vitest";
import { UserRole, UserStatus, VerificationStatus } from "@prisma/client";
import { canReviewCase, canSubmitCases, hasRole, isActiveUser } from "@/lib/auth/roles";

describe("role permissions", () => {
  it("permits verified alumni to submit cases", () => {
    expect(canSubmitCases(UserRole.VERIFIED_ALUMNI, VerificationStatus.VERIFIED)).toBe(true);
    expect(canSubmitCases(UserRole.PENDING_ALUMNI, VerificationStatus.PENDING)).toBe(false);
  });

  it("enforces reviewer hierarchy", () => {
    expect(hasRole(UserRole.SUPER_ADMIN, UserRole.CITY_COORDINATOR)).toBe(true);
    expect(hasRole(UserRole.VERIFIED_ALUMNI, UserRole.VOLUNTEER_REVIEWER)).toBe(false);
    expect(canReviewCase(UserRole.CATEGORY_COORDINATOR)).toBe(true);
  });

  it("recognizes only active users as active", () => {
    expect(isActiveUser(UserStatus.ACTIVE)).toBe(true);
    expect(isActiveUser(UserStatus.SUSPENDED)).toBe(false);
  });
});

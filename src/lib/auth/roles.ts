import { UserRole, UserStatus, VerificationStatus } from "@prisma/client";

export const roleLabels: Record<UserRole, string> = {
  PENDING_ALUMNI: "Pending alumni",
  VERIFIED_ALUMNI: "Verified alumni",
  VOLUNTEER_REVIEWER: "Volunteer reviewer",
  CITY_COORDINATOR: "City coordinator",
  CATEGORY_COORDINATOR: "Category coordinator",
  SUPER_ADMIN: "Super admin",
};

const roleRank: Record<UserRole, number> = {
  PENDING_ALUMNI: 1,
  VERIFIED_ALUMNI: 2,
  VOLUNTEER_REVIEWER: 3,
  CITY_COORDINATOR: 4,
  CATEGORY_COORDINATOR: 4,
  SUPER_ADMIN: 10,
};

export function hasRole(userRole: UserRole, minimumRole: UserRole) {
  return roleRank[userRole] >= roleRank[minimumRole];
}

export function canSubmitCases(role: UserRole, verificationStatus?: VerificationStatus | null) {
  return role !== UserRole.PENDING_ALUMNI && verificationStatus === VerificationStatus.VERIFIED;
}

export function canReviewCase(role: UserRole) {
  return ([
    UserRole.VOLUNTEER_REVIEWER,
    UserRole.CITY_COORDINATOR,
    UserRole.CATEGORY_COORDINATOR,
    UserRole.SUPER_ADMIN,
  ] as UserRole[]).includes(role);
}

export function isOperationalUser(role: UserRole) {
  return canReviewCase(role);
}

export function isActiveUser(status: UserStatus) {
  return status === UserStatus.ACTIVE;
}

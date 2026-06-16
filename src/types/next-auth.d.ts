import { UserRole, UserStatus, VerificationStatus } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: UserRole;
      status: UserStatus;
      verificationStatus: VerificationStatus;
      cityScope: string[];
      categoryScopeIds: string[];
    };
  }

  interface User {
    role?: UserRole;
    status?: UserStatus;
    verificationStatus?: VerificationStatus;
    cityScope?: string[];
    categoryScopeIds?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    status?: UserStatus;
    verificationStatus?: VerificationStatus;
    cityScope?: string[];
    categoryScopeIds?: string[];
  }
}

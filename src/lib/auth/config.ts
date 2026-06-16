import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { UserRole, UserStatus, VerificationStatus } from "@prisma/client";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db/prisma";
import { loginSchema } from "@/lib/validation/auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          include: { alumniProfile: true },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const validPassword = await bcrypt.compare(parsed.data.password, user.passwordHash);

        if (!validPassword || user.status !== "ACTIVE" || !user.emailVerifiedAt) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          verificationStatus: user.alumniProfile?.verificationStatus ?? VerificationStatus.PENDING,
          cityScope: user.cityScope,
          categoryScopeIds: user.categoryScopeIds,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const profile = await prisma.alumniProfile.findUnique({
        where: { userId: user.id },
        select: { verificationStatus: true },
      });

      session.user.id = user.id;
      session.user.role = user.role ?? UserRole.PENDING_ALUMNI;
      session.user.status = user.status ?? UserStatus.ACTIVE;
      session.user.verificationStatus = profile?.verificationStatus ?? VerificationStatus.PENDING;
      session.user.cityScope = user.cityScope ?? [];
      session.user.categoryScopeIds = user.categoryScopeIds ?? [];

      return session;
    },
  },
  events: {
    async signIn(message) {
      await prisma.auditLog.create({
        data: {
          actorId: message.user.id,
          action: "AUTH_LOGIN",
          entityType: "User",
          entityId: message.user.id,
        },
      });
    },
  },
};

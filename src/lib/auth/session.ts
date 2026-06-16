import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { UserRole } from "@prisma/client";
import { authOptions } from "@/lib/auth/config";
import { hasRole } from "@/lib/auth/roles";

export async function getCurrentSession() {
  return getServerSession(authOptions);
}

export async function requireSession() {
  const session = await getCurrentSession();

  if (!session?.user) {
    redirect("/login");
  }

  return session;
}

export async function requireRole(role: UserRole) {
  const session = await requireSession();

  if (!hasRole(session.user.role, role)) {
    redirect("/alumni");
  }

  return session;
}

export function hasScopeAccess(session: Session, city?: string | null, categoryId?: string | null) {
  if (session.user.role === UserRole.SUPER_ADMIN) {
    return true;
  }

  if (session.user.role === UserRole.CITY_COORDINATOR && city) {
    return session.user.cityScope.includes(city);
  }

  if (session.user.role === UserRole.CATEGORY_COORDINATOR && categoryId) {
    return session.user.categoryScopeIds.includes(categoryId);
  }

  return session.user.role === UserRole.VOLUNTEER_REVIEWER;
}

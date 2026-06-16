import { appMetadata } from "@/lib/constants";
import { prisma } from "@/lib/db/prisma";
import { env, featureFlags } from "@/lib/env";

export type PlatformSettings = {
  publicDashboardEnabled: boolean;
  sevaDayLabel: string;
  siteName: string;
  primaryColor: string;
};

export const defaultPlatformSettings: PlatformSettings = {
  publicDashboardEnabled: featureFlags.publicDashboardEnabled,
  sevaDayLabel: env.SEVA_DAY_LABEL,
  siteName: appMetadata.name,
  primaryColor: "#123873",
};

export async function getPlatformSettings(): Promise<PlatformSettings> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: "platform" },
      select: { valueJson: true },
    });

    if (!setting || typeof setting.valueJson !== "object" || !setting.valueJson) {
      return defaultPlatformSettings;
    }

    const value = setting.valueJson as Partial<PlatformSettings>;

    return {
      publicDashboardEnabled:
        typeof value.publicDashboardEnabled === "boolean"
          ? value.publicDashboardEnabled
          : defaultPlatformSettings.publicDashboardEnabled,
      sevaDayLabel:
        typeof value.sevaDayLabel === "string" && value.sevaDayLabel.trim().length > 0
          ? value.sevaDayLabel.trim()
          : defaultPlatformSettings.sevaDayLabel,
      siteName:
        typeof value.siteName === "string" && value.siteName.trim().length > 0
          ? value.siteName.trim()
          : defaultPlatformSettings.siteName,
      primaryColor:
        typeof value.primaryColor === "string" && value.primaryColor.trim().length > 0
          ? value.primaryColor.trim()
          : defaultPlatformSettings.primaryColor,
    };
  } catch {
    return defaultPlatformSettings;
  }
}

import { NextResponse } from "next/server";
import { getPublicDashboardData } from "@/lib/dashboard/queries";
import { getPlatformSettings } from "@/lib/settings";

export async function GET() {
  const settings = await getPlatformSettings();

  if (!settings.publicDashboardEnabled) {
    return NextResponse.json(
      { success: false, message: "Public dashboard is currently disabled." },
      { status: 503 },
    );
  }

  const data = await getPublicDashboardData();
  return NextResponse.json(data);
}

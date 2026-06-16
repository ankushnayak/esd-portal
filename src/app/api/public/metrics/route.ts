import { NextResponse } from "next/server";
import { getPublicDashboardData } from "@/lib/dashboard/queries";

export async function GET() {
  const data = await getPublicDashboardData();
  return NextResponse.json(data);
}

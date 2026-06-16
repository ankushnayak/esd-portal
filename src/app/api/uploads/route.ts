import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function GET(request: NextRequest) {
  const file = request.nextUrl.searchParams.get("file");

  if (!file) {
    return NextResponse.json({ success: false, message: "Missing file parameter." }, { status: 400 });
  }

  const targetPath = path.join(process.cwd(), env.UPLOAD_DIR, path.basename(file));

  try {
    const buffer = await readFile(targetPath);
    const extension = file.split(".").pop()?.toLowerCase();
    const type = extension === "pdf" ? "application/pdf" : `image/${extension === "jpg" ? "jpeg" : extension}`;

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ success: false, message: "File not found." }, { status: 404 });
  }
}

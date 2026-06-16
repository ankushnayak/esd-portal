import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import sanitizeHtml from "sanitize-html";
import { AttachmentType } from "@prisma/client";
import { env } from "@/lib/env";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

export function sanitizeText(value?: string | null) {
  return sanitizeHtml(value ?? "", {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}

export async function persistUpload(file: File, type: AttachmentType) {
  if (!allowedMimeTypes.has(file.type)) {
    throw new Error("Only JPG, PNG, WEBP, and PDF files are allowed.");
  }

  const maxSizeBytes = env.MAX_UPLOAD_SIZE_MB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    throw new Error(`Maximum upload size is ${env.MAX_UPLOAD_SIZE_MB} MB.`);
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const safeName = `${type.toLowerCase()}-${randomUUID()}.${extension}`;
  const targetDir = path.join(process.cwd(), env.UPLOAD_DIR);
  const targetPath = path.join(targetDir, safeName);

  await mkdir(targetDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(targetPath, buffer);

  return {
    fileName: safeName,
    fileUrl: `/api/uploads?file=${encodeURIComponent(safeName)}`,
    mimeType: file.type,
    fileSize: file.size,
  };
}

import { AttachmentType, PublicVisibility, SevaCaseStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit/log";
import { canSubmitCases } from "@/lib/auth/roles";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { persistUpload, sanitizeText } from "@/lib/uploads/storage";

function boolValue(value: FormDataEntryValue | null) {
  return value === "true" || value === "on";
}

export async function POST(request: Request) {
  const session = await getCurrentSession();

  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { alumniProfile: true },
  });

  if (!user || !canSubmitCases(user.role, user.alumniProfile?.verificationStatus)) {
    return NextResponse.json(
      { success: false, message: "Only verified alumni can submit seva cases." },
      { status: 403 },
    );
  }

  const formData = await request.formData();
  const action = String(formData.get("action") ?? "save-draft");
  const caseId = formData.get("caseId")?.toString() || undefined;
  const proofFiles = formData.getAll("proofFiles").filter((value): value is File => value instanceof File && value.size > 0);
  const consentFiles = formData
    .getAll("consentFiles")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (action === "submit" && proofFiles.length === 0) {
    return NextResponse.json(
      { success: false, message: "At least one proof attachment is required for submission." },
      { status: 400 },
    );
  }

  const publicVisibility = (formData.get("publicVisibility")?.toString() ?? "PRIVATE") as PublicVisibility;
  const consentObtained = boolValue(formData.get("consentObtained"));

  if (publicVisibility === PublicVisibility.PUBLIC_WITH_CONSENT && (!consentObtained || consentFiles.length === 0)) {
    return NextResponse.json(
      { success: false, message: "Consent checkbox and consent file are required for public with consent." },
      { status: 400 },
    );
  }

  const status = action === "submit" ? SevaCaseStatus.SUBMITTED : SevaCaseStatus.DRAFT;
  const uploads = await Promise.all([
    ...proofFiles.map((file) => persistUpload(file, AttachmentType.PROOF)),
    ...consentFiles.map((file) => persistUpload(file, AttachmentType.CONSENT)),
  ]);

  const data = {
    title: sanitizeText(formData.get("title")?.toString()),
    date: new Date(formData.get("date")?.toString() ?? new Date().toISOString()),
    categoryId: formData.get("categoryId")?.toString() ?? "",
    subcategoryId: formData.get("subcategoryId")?.toString() || null,
    profession: sanitizeText(formData.get("profession")?.toString()),
    city: sanitizeText(formData.get("city")?.toString()),
    state: sanitizeText(formData.get("state")?.toString()),
    beneficiaryType: (formData.get("beneficiaryType")?.toString() ?? "INDIVIDUAL") as
      | "INDIVIDUAL"
      | "FAMILY"
      | "SCHOOL"
      | "HOSPITAL"
      | "COMMUNITY"
      | "NGO"
      | "OTHER",
    beneficiaryCount: Number(formData.get("beneficiaryCount") ?? 1),
    description: sanitizeText(formData.get("description")?.toString()),
    estimatedValue: Number(formData.get("estimatedValue") ?? 0),
    actualAmount: Number(formData.get("actualAmount") ?? 0),
    currency: sanitizeText(formData.get("currency")?.toString() ?? "INR"),
    consentObtained,
    publicVisibility,
    publicSummary: sanitizeText(formData.get("publicSummary")?.toString()),
    internalNotes: sanitizeText(formData.get("internalNotes")?.toString()),
    status,
    submittedAt: action === "submit" ? new Date() : null,
  };

  const beneficiaryPrivateData = {
    name: sanitizeText(formData.get("beneficiaryName")?.toString()),
    contact: sanitizeText(formData.get("beneficiaryContact")?.toString()),
    location: sanitizeText(formData.get("beneficiaryLocation")?.toString()),
    notes: sanitizeText(formData.get("beneficiaryNotes")?.toString()),
  };

  const savedCase = caseId
    ? await prisma.sevaCase.update({
        where: { id: caseId, userId: session.user.id },
        data: {
          ...data,
          privateData: {
            upsert: {
              create: beneficiaryPrivateData,
              update: beneficiaryPrivateData,
            },
          },
        },
      })
    : await prisma.sevaCase.create({
        data: {
          ...data,
          caseNumber: `ESD-${Date.now()}`,
          userId: session.user.id,
          privateData: { create: beneficiaryPrivateData },
        },
      });

  if (uploads.length > 0) {
    await prisma.attachment.createMany({
      data: uploads.map((item) => ({
        ...item,
        sevaCaseId: savedCase.id,
        uploadedById: session.user.id,
        type: item.fileName.startsWith("consent") ? AttachmentType.CONSENT : AttachmentType.PROOF,
        isPublicEligible: item.fileName.startsWith("proof") && publicVisibility !== PublicVisibility.PRIVATE,
      })),
    });
  }

  await createAuditLog({
    actorId: session.user.id,
    action: caseId ? "CASE_UPDATED" : "CASE_CREATED",
    entityType: "SevaCase",
    entityId: savedCase.id,
    metadataJson: { status },
  });

  return NextResponse.json({
    success: true,
    message: status === SevaCaseStatus.SUBMITTED ? "Seva case submitted for review." : "Draft saved successfully.",
  });
}

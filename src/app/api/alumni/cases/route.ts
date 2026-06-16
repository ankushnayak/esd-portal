import { AttachmentType, PublicVisibility, SevaCaseStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit/log";
import { canSubmitCases } from "@/lib/auth/roles";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { persistUpload, sanitizeText } from "@/lib/uploads/storage";
import { sevaCaseSchema } from "@/lib/validation/case";

function boolValue(value: FormDataEntryValue | null) {
  return value === "true" || value === "on";
}

export async function POST(request: Request) {
  const session = await getCurrentSession();

  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
  }

  const formData = await request.formData();
  const action = String(formData.get("action") ?? "save-draft");
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { alumniProfile: true },
  });

  if (!user) {
    return NextResponse.json({ success: false, message: "User account not found." }, { status: 404 });
  }

  if (action === "submit" && !canSubmitCases(user.role, user.alumniProfile?.verificationStatus)) {
    return NextResponse.json(
      { success: false, message: "Only verified alumni can submit seva cases for review." },
      { status: 403 },
    );
  }

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
  const isDraft = action !== "submit";

  const rawValues = {
    caseId,
    title: sanitizeText(formData.get("title")?.toString()),
    date: formData.get("date")?.toString() ?? new Date().toISOString(),
    categoryId: formData.get("categoryId")?.toString() ?? "",
    subcategoryId: formData.get("subcategoryId")?.toString() || null,
    profession: sanitizeText(formData.get("profession")?.toString()) || (isDraft ? "To be added" : ""),
    city: sanitizeText(formData.get("city")?.toString()) || (isDraft ? "To be added" : ""),
    state: sanitizeText(formData.get("state")?.toString()) || (isDraft ? "To be added" : ""),
    beneficiaryType: formData.get("beneficiaryType")?.toString() ?? "INDIVIDUAL",
    beneficiaryName: sanitizeText(formData.get("beneficiaryName")?.toString()),
    beneficiaryContact: sanitizeText(formData.get("beneficiaryContact")?.toString()),
    beneficiaryLocation: sanitizeText(formData.get("beneficiaryLocation")?.toString()),
    beneficiaryNotes: sanitizeText(formData.get("beneficiaryNotes")?.toString()),
    beneficiaryCount: Number(formData.get("beneficiaryCount") ?? (isDraft ? 1 : 0)),
    description: sanitizeText(formData.get("description")?.toString()) || (isDraft ? "Draft in progress." : ""),
    estimatedValue: Number(formData.get("estimatedValue") ?? 0),
    actualAmount: Number(formData.get("actualAmount") ?? 0),
    currency: sanitizeText(formData.get("currency")?.toString() ?? "INR"),
    consentObtained,
    publicVisibility,
    publicSummary: sanitizeText(formData.get("publicSummary")?.toString()),
    internalNotes: sanitizeText(formData.get("internalNotes")?.toString()),
    action,
    attachmentIds: proofFiles.length ? ["pending"] : [],
    consentAttachmentIds: consentFiles.length ? ["pending"] : [],
  };

  if (isDraft && (!rawValues.title || !rawValues.categoryId || !formData.get("date")?.toString())) {
    return NextResponse.json(
      { success: false, message: "Drafts need a title, date, and category before they can be saved." },
      { status: 400 },
    );
  }

  if (!isDraft) {
    const parsed = sevaCaseSchema.safeParse(rawValues);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message ?? "Unable to submit this seva case." },
        { status: 400 },
      );
    }
  }

  if (publicVisibility === PublicVisibility.PUBLIC_WITH_CONSENT && (!consentObtained || consentFiles.length === 0)) {
    return NextResponse.json(
      { success: false, message: "Consent checkbox and consent file are required for public with consent." },
      { status: 400 },
    );
  }

  const status = action === "submit" ? SevaCaseStatus.SUBMITTED : SevaCaseStatus.DRAFT;
  let uploads: Awaited<ReturnType<typeof persistUpload>>[] = [];

  try {
    uploads = await Promise.all([
      ...proofFiles.map((file) => persistUpload(file, AttachmentType.PROOF)),
      ...consentFiles.map((file) => persistUpload(file, AttachmentType.CONSENT)),
    ]);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unable to upload one or more files." },
      { status: 400 },
    );
  }

  const data = {
    title: rawValues.title,
    date: new Date(rawValues.date),
    categoryId: rawValues.categoryId,
    subcategoryId: rawValues.subcategoryId,
    profession: rawValues.profession,
    city: rawValues.city,
    state: rawValues.state,
    beneficiaryType: rawValues.beneficiaryType as
      | "INDIVIDUAL"
      | "FAMILY"
      | "SCHOOL"
      | "HOSPITAL"
      | "COMMUNITY"
      | "NGO"
      | "OTHER",
    beneficiaryCount: rawValues.beneficiaryCount,
    description: rawValues.description,
    estimatedValue: rawValues.estimatedValue,
    actualAmount: rawValues.actualAmount,
    currency: rawValues.currency,
    consentObtained,
    publicVisibility,
    publicSummary: rawValues.publicSummary,
    internalNotes: rawValues.internalNotes,
    status,
    submittedAt: action === "submit" ? new Date() : null,
  };

  const beneficiaryPrivateData = {
    name: rawValues.beneficiaryName,
    contact: rawValues.beneficiaryContact,
    location: rawValues.beneficiaryLocation,
    notes: rawValues.beneficiaryNotes,
  };

  const existingCase = caseId
    ? await prisma.sevaCase.findFirst({
        where: { id: caseId, userId: session.user.id, deletedAt: null },
        select: { id: true },
      })
    : null;

  if (caseId && !existingCase) {
    return NextResponse.json({ success: false, message: "Seva case not found." }, { status: 404 });
  }

  const savedCase = existingCase
    ? await prisma.sevaCase.update({
        where: { id: existingCase.id },
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

import { NotificationChannel, NotificationStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { env, featureFlags } from "@/lib/env";

async function logWhatsApp(input: {
  recipient: string;
  body: string;
  templateKey: string;
  status: NotificationStatus;
  userId?: string;
  providerMessageId?: string;
  error?: string;
}) {
  return prisma.notification.create({
    data: {
      userId: input.userId,
      channel: NotificationChannel.WHATSAPP,
      recipient: input.recipient,
      templateKey: input.templateKey,
      body: input.body,
      status: input.status,
      providerMessageId: input.providerMessageId,
      error: input.error,
      sentAt: input.status === NotificationStatus.SENT ? new Date() : undefined,
    },
  });
}

async function sendWatiRequest(path: string, payload: unknown) {
  const response = await fetch(`${env.WATI_API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.WATI_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`WATI request failed with status ${response.status}`);
  }

  return response.json();
}

export async function sendWatiTemplateMessage(input: {
  phone: string;
  templateName: string;
  parameters: Record<string, string>;
  userId?: string;
  dryRun?: boolean;
}) {
  const payload = {
    template_name: input.templateName,
    broadcast_name: `expert-seva-${Date.now()}`,
    parameters: input.parameters,
    phone_number: input.phone,
  };

  if (!featureFlags.watiEnabled || input.dryRun) {
    return logWhatsApp({
      recipient: input.phone,
      body: JSON.stringify(payload),
      templateKey: input.templateName,
      status: NotificationStatus.DRY_RUN,
      userId: input.userId,
    });
  }

  const result = await sendWatiRequest("/api/v1/sendTemplateMessage", payload);

  return logWhatsApp({
    recipient: input.phone,
    body: JSON.stringify(payload),
    templateKey: input.templateName,
    status: NotificationStatus.SENT,
    userId: input.userId,
    providerMessageId: String(result?.id ?? ""),
  });
}

export async function sendWatiSessionMessage(input: {
  phone: string;
  message: string;
  userId?: string;
  dryRun?: boolean;
}) {
  const payload = {
    phone_number: input.phone,
    message: input.message,
  };

  if (!featureFlags.watiEnabled || input.dryRun) {
    return logWhatsApp({
      recipient: input.phone,
      body: input.message,
      templateKey: "session_message",
      status: NotificationStatus.DRY_RUN,
      userId: input.userId,
    });
  }

  const result = await sendWatiRequest("/api/v1/sendSessionMessage", payload);

  return logWhatsApp({
    recipient: input.phone,
    body: input.message,
    templateKey: "session_message",
    status: NotificationStatus.SENT,
    userId: input.userId,
    providerMessageId: String(result?.id ?? ""),
  });
}

export async function sendWatiBulkMessage(input: {
  templateName: string;
  recipients: Array<{ phone: string; parameters: Record<string, string>; userId?: string }>;
  dryRun?: boolean;
}) {
  return Promise.all(
    input.recipients.map((recipient) =>
      sendWatiTemplateMessage({
        phone: recipient.phone,
        templateName: input.templateName,
        parameters: recipient.parameters,
        userId: recipient.userId,
        dryRun: input.dryRun,
      }),
    ),
  );
}

import nodemailer from "nodemailer";
import { NotificationChannel, NotificationStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { env, featureFlags } from "@/lib/env";

let transport: nodemailer.Transporter | null = null;

function getTransport() {
  if (!transport) {
    transport = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
      secure: env.SMTP_SECURE === "true",
    });
  }

  return transport;
}

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  userId?: string;
  templateKey?: string;
  dryRun?: boolean;
}) {
  const templateKey = input.templateKey ?? "custom";

  if (!featureFlags.smtpEnabled || input.dryRun) {
    return prisma.notification.create({
      data: {
        userId: input.userId,
        channel: NotificationChannel.EMAIL,
        recipient: input.to,
        templateKey,
        subject: input.subject,
        body: input.html,
        status: NotificationStatus.DRY_RUN,
      },
    });
  }

  const info = await getTransport().sendMail({
    from: env.SMTP_FROM,
    to: input.to,
    subject: input.subject,
    html: input.html,
  });

  return prisma.notification.create({
    data: {
      userId: input.userId,
      channel: NotificationChannel.EMAIL,
      recipient: input.to,
      templateKey,
      subject: input.subject,
      body: input.html,
      status: NotificationStatus.SENT,
      providerMessageId: info.messageId,
      sentAt: new Date(),
    },
  });
}

export async function sendTemplateEmail(input: {
  templateKey: string;
  to: string;
  variables: Record<string, string>;
  userId?: string;
  dryRun?: boolean;
}) {
  const template = await prisma.messageTemplate.findUnique({
    where: {
      key_channel: {
        key: input.templateKey,
        channel: NotificationChannel.EMAIL,
      },
    },
  });

  if (!template) {
    throw new Error(`Email template "${input.templateKey}" not found.`);
  }

  const body = Object.entries(input.variables).reduce(
    (text, [key, value]) => text.replaceAll(`{{${key}}}`, value),
    template.body,
  );
  const subject = Object.entries(input.variables).reduce(
    (text, [key, value]) => text.replaceAll(`{{${key}}}`, value),
    template.subject ?? template.name,
  );

  return sendEmail({
    to: input.to,
    subject,
    html: body,
    userId: input.userId,
    templateKey: input.templateKey,
    dryRun: input.dryRun,
  });
}

export async function sendBulkEmail(input: {
  templateKey: string;
  recipients: Array<{ to: string; variables: Record<string, string>; userId?: string }>;
  dryRun?: boolean;
}) {
  return Promise.all(
    input.recipients.map((recipient) =>
      sendTemplateEmail({
        templateKey: input.templateKey,
        to: recipient.to,
        variables: recipient.variables,
        userId: recipient.userId,
        dryRun: input.dryRun,
      }),
    ),
  );
}

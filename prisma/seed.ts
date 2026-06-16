import bcrypt from "bcryptjs";
import { NotificationChannel, UserRole } from "@prisma/client";
import { prisma } from "../src/lib/db/prisma";
import { env } from "../src/lib/env";
import { slugify } from "../src/lib/utils/format";

async function main() {
  const passwordHash = await bcrypt.hash(env.DEFAULT_ADMIN_PASSWORD, 12);

  await prisma.user.upsert({
    where: { email: env.DEFAULT_ADMIN_EMAIL },
    update: {
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      status: "ACTIVE",
      emailVerifiedAt: new Date(),
    },
    create: {
      email: env.DEFAULT_ADMIN_EMAIL,
      passwordHash,
      name: "Super Admin",
      phone: "9999999999",
      role: UserRole.SUPER_ADMIN,
      status: "ACTIVE",
      emailVerifiedAt: new Date(),
    },
  });

  const categoryNames = [
    "Medical seva",
    "Educational support",
    "Legal aid",
    "Mentorship",
    "Community outreach",
    "Financial assistance",
  ];

  await Promise.all(
    categoryNames.map((name, index) =>
      prisma.sevaCategory.upsert({
        where: { slug: slugify(name) },
        update: { description: `${name} related service`, sortOrder: index + 1 },
        create: {
          name,
          slug: slugify(name),
          description: `${name} related service`,
          sortOrder: index + 1,
        },
      }),
    ),
  );

  await Promise.all(
    [
      ["welcome", "Welcome", NotificationChannel.EMAIL, "Welcome to Expert Seva Diwas", "<p>Hello {{name}}, welcome.</p>"],
      ["case-approved", "Case Approved", NotificationChannel.EMAIL, "Your seva case is approved", "<p>Hello {{name}}, your case is approved.</p>"],
      ["monthly-reminder", "Monthly Reminder", NotificationChannel.WHATSAPP, null, "Hello {{name}}, remember to record your seva this month."],
      ["certificate-issued", "Certificate Issued", NotificationChannel.EMAIL, "Your certificate is ready", "<p>Hello {{name}}, your certificate is now available.</p>"],
    ].map(([key, name, channel, subject, body]) =>
      prisma.messageTemplate.upsert({
        where: {
          key_channel: {
            key: key as string,
            channel: channel as NotificationChannel,
          },
        },
        update: { name: name as string, subject: subject as string | null, body: body as string },
        create: {
          key: key as string,
          name: name as string,
          channel: channel as NotificationChannel,
          subject: subject as string | null,
          body: body as string,
        },
      }),
    ),
  );

  await prisma.setting.upsert({
    where: { key: "platform" },
    update: {},
    create: {
      key: "platform",
      valueJson: {
        siteName: "Expert Seva Diwas",
        primaryColor: "#123873",
        sevaDayLabel: env.SEVA_DAY_LABEL,
      },
    },
  });

  console.log("Bootstrapped initial admin, categories, templates, and platform settings.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

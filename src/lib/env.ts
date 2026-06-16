import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().default("postgresql://postgres:postgres@localhost:5432/expert_seva_diwas"),
  NEXTAUTH_SECRET: z.string().min(16).default("replace-this-with-a-long-random-secret"),
  NEXTAUTH_URL: z.string().url().default("http://localhost:3000"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  SMTP_HOST: z.string().default(""),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().default(""),
  SMTP_PASS: z.string().default(""),
  SMTP_FROM: z.string().default(""),
  SMTP_SECURE: z.enum(["true", "false"]).default("false"),
  WATI_API_BASE_URL: z.string().default(""),
  WATI_API_TOKEN: z.string().default(""),
  WATI_DEFAULT_COUNTRY_CODE: z.string().default("91"),
  UPLOAD_DIR: z.string().default("storage/uploads"),
  MAX_UPLOAD_SIZE_MB: z.coerce.number().default(8),
  PUBLIC_DASHBOARD_ENABLED: z.enum(["true", "false"]).default("true"),
  SEVA_DAY_LABEL: z.string().default("Second Sunday"),
  FINANCIAL_YEAR_START_MONTH: z.coerce.number().min(1).max(12).default(4),
  DEFAULT_ADMIN_EMAIL: z.string().email().default("admin@example.org"),
  DEFAULT_ADMIN_PASSWORD: z.string().min(8).default("ChangeMe123!"),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  APP_URL: process.env.APP_URL,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM,
  SMTP_SECURE: process.env.SMTP_SECURE,
  WATI_API_BASE_URL: process.env.WATI_API_BASE_URL,
  WATI_API_TOKEN: process.env.WATI_API_TOKEN,
  WATI_DEFAULT_COUNTRY_CODE: process.env.WATI_DEFAULT_COUNTRY_CODE,
  UPLOAD_DIR: process.env.UPLOAD_DIR,
  MAX_UPLOAD_SIZE_MB: process.env.MAX_UPLOAD_SIZE_MB,
  PUBLIC_DASHBOARD_ENABLED: process.env.PUBLIC_DASHBOARD_ENABLED,
  SEVA_DAY_LABEL: process.env.SEVA_DAY_LABEL,
  FINANCIAL_YEAR_START_MONTH: process.env.FINANCIAL_YEAR_START_MONTH,
  DEFAULT_ADMIN_EMAIL: process.env.DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD,
});

export const featureFlags = {
  publicDashboardEnabled: env.PUBLIC_DASHBOARD_ENABLED === "true",
  smtpEnabled: Boolean(env.SMTP_HOST && env.SMTP_FROM),
  watiEnabled: Boolean(env.WATI_API_BASE_URL && env.WATI_API_TOKEN),
};

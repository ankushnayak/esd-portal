import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().transform((value) => value.toLowerCase()),
  password: z
    .string()
    .min(8)
    .max(72)
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[a-z]/, "Password must include a lowercase letter")
    .regex(/[0-9]/, "Password must include a number"),
  phone: z.string().trim().min(8).max(20),
  batchYear: z.coerce.number().min(1950).max(2100),
  institution: z.string().trim().min(2).max(120),
  program: z.string().trim().min(2).max(120),
  profession: z.string().trim().min(2).max(120),
  city: z.string().trim().min(2).max(120),
  state: z.string().trim().min(2).max(120),
});

export const loginSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(72),
});

export const passwordResetRequestSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase()),
});

import { isValidPhoneNumber, parsePhoneNumberFromString } from "libphonenumber-js/min";
import { z } from "zod";
import { expertCompletionStartYear, professionOptions } from "@/lib/alumni-registration";

const currentYear = new Date().getFullYear();

export const registerSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    email: z.email().transform((value) => value.toLowerCase()),
    password: z
      .string()
      .min(8)
      .max(72)
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/[a-z]/, "Password must include a lowercase letter")
      .regex(/[0-9]/, "Password must include a number"),
    confirmPassword: z.string().min(8).max(72),
    phone: z.string().trim().refine((value) => isValidPhoneNumber(value), "Enter a valid mobile / WhatsApp number."),
    batchYear: z.coerce
      .number()
      .int()
      .min(expertCompletionStartYear, `Year of completion must be ${expertCompletionStartYear} or later.`)
      .max(currentYear, "Year of completion cannot be in the future."),
    institution: z.string().trim().min(2).max(120),
    professionOption: z.enum(professionOptions),
    professionOther: z.string().trim().max(120).optional().or(z.literal("")),
    countryIso: z.string().trim().length(2, "Select a valid country."),
    stateCode: z.string().trim().min(1, "Select a valid state."),
    city: z.string().trim().min(2).max(120),
  })
  .superRefine((value, context) => {
    if (value.password !== value.confirmPassword) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }

    if (value.professionOption === "Other" && !value.professionOther?.trim()) {
      context.addIssue({
        code: "custom",
        path: ["professionOther"],
        message: "Please tell us your profession.",
      });
    }
  })
  .transform((value) => ({
    name: value.name,
    email: value.email,
    password: value.password,
    phone: parsePhoneNumberFromString(value.phone)?.number ?? value.phone,
    batchYear: value.batchYear,
    institution: value.institution,
    profession: value.professionOption === "Other" ? (value.professionOther ?? "").trim() : value.professionOption,
    countryIso: value.countryIso,
    stateCode: value.stateCode,
    city: value.city,
  }));

export const loginSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(72),
});

export const passwordResetRequestSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase()),
});

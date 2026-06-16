import { z } from "zod";

export const alumniProfileSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().transform((value) => value.toLowerCase()),
  phone: z.string().trim().min(8).max(20),
  batchYear: z.coerce.number().min(1950).max(2100).optional(),
  institution: z.string().trim().max(120).optional(),
  program: z.string().trim().max(120).optional(),
  profession: z.string().trim().max(120).optional(),
  specialty: z.string().trim().max(120).optional(),
  city: z.string().trim().max(120).optional(),
  state: z.string().trim().max(120).optional(),
  country: z.string().trim().max(120).default("India"),
  publicProfileOptIn: z.boolean().default(false),
  sevaCategories: z.array(z.string()).default([]),
  availabilityPledge: z.string().trim().max(500).optional(),
  profilePhotoUrl: z.string().optional(),
});

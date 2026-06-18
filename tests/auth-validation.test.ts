import { describe, expect, it } from "vitest";
import { registerSchema } from "@/lib/validation/auth";

describe("registerSchema", () => {
  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      name: "Test Alumni",
      email: "test@example.com",
      password: "Password1",
      confirmPassword: "Password2",
      phone: "+919876543210",
      batchYear: 2010,
      institution: "Expert Coaching Classes",
      professionOption: "Doctor",
      professionOther: "",
      countryIso: "IN",
      stateCode: "KA",
      city: "Mangaluru",
    });

    expect(result.success).toBe(false);
  });

  it("requires a custom profession when Other is selected", () => {
    const result = registerSchema.safeParse({
      name: "Test Alumni",
      email: "test@example.com",
      password: "Password1",
      confirmPassword: "Password1",
      phone: "+919876543210",
      batchYear: 2010,
      institution: "Expert Coaching Classes",
      professionOption: "Other",
      professionOther: "",
      countryIso: "IN",
      stateCode: "KA",
      city: "Mangaluru",
    });

    expect(result.success).toBe(false);
  });

  it("normalizes the chosen profession and preserves international phone format", () => {
    const result = registerSchema.safeParse({
      name: "Test Alumni",
      email: "TEST@EXAMPLE.COM",
      password: "Password1",
      confirmPassword: "Password1",
      phone: "+91 98765 43210",
      batchYear: 2010,
      institution: "Expert Coaching Classes",
      professionOption: "Other",
      professionOther: "Aviation Consultant",
      countryIso: "IN",
      stateCode: "KA",
      city: "Mangaluru",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe("test@example.com");
      expect(result.data.phone).toBe("+919876543210");
      expect(result.data.profession).toBe("Aviation Consultant");
    }
  });
});

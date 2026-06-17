export const expertCompletionStartYear = 1987;

export const expertCompletionYears = Array.from(
  { length: new Date().getFullYear() - expertCompletionStartYear + 1 },
  (_, index) => new Date().getFullYear() - index,
);

export const institutionOptions = [
  "Expert Coaching Classes",
  "Expert PU College - Kodialbail",
  "Expert PU College - Valachil",
] as const;

export const professionOptions = [
  "Doctor",
  "Engineer",
  "Teacher",
  "Professor",
  "Scientist",
  "Researcher",
  "Lawyer",
  "Chartered Accountant",
  "Entrepreneur",
  "Business Owner",
  "Software Developer",
  "Product Manager",
  "Designer",
  "Architect",
  "Nurse",
  "Pharmacist",
  "Civil Servant",
  "Consultant",
  "Banker",
  "Student",
  "Other",
] as const;

export type ProfessionOption = (typeof professionOptions)[number];

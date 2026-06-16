export const appMetadata = {
  name: "Expert Seva Diwas",
  organization: "Expert Group of Institutions Alumni Network",
  shortBrand: "EXPERT Alumni",
  description:
    "An alumni-led seva and charity tracking portal built for transparent, compassionate impact reporting.",
};

export const navigation = {
  public: [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Impact Dashboard" },
    { href: "/stories", label: "Impact Stories" },
    { href: "/participate", label: "How to Participate" },
    { href: "/privacy", label: "Privacy & Consent" },
  ],
  alumni: [
    { href: "/alumni", label: "Dashboard" },
    { href: "/alumni/profile", label: "Profile" },
    { href: "/alumni/cases", label: "My Seva Cases" },
    { href: "/alumni/cases/new", label: "Add Seva Case" },
    { href: "/alumni/certificates", label: "Certificates" },
  ],
  admin: [
    { href: "/admin", label: "Overview" },
    { href: "/admin/alumni", label: "Alumni" },
    { href: "/admin/cases", label: "Seva Cases" },
    { href: "/admin/categories", label: "Categories" },
    { href: "/admin/reports", label: "Reports" },
    { href: "/admin/communications", label: "Communication" },
    { href: "/admin/settings", label: "Settings" },
    { href: "/admin/audit", label: "Audit Logs" },
  ],
};

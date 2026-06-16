import { PageSection } from "@/components/layout/page-section";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <PageSection
        eyebrow="Privacy & consent"
        title="Beneficiary privacy is a core requirement, not an afterthought"
        description="Private beneficiary details are stored only for internal verification and are never exposed through public pages or APIs."
      >
        <div className="grid gap-5">
          {[
            "Beneficiary names, contact details, and locations are stored separately from public-safe case content.",
            "Public dashboards show approved aggregates only.",
            "Stories are anonymized by default.",
            "Name or photo publication requires recorded consent and consent proof.",
            "Takedown requests can be handled through the super admin console and contact workflow.",
          ].map((item, index) => (
            <div key={item} className="rounded-[2rem] border border-slate-200 bg-white px-6 py-6 shadow-sm sm:px-8 sm:py-7">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Policy {index + 1}</p>
              <p className="mt-3 max-w-4xl text-[1.04rem] leading-8 text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </PageSection>
    </div>
  );
}

import { PageSection } from "@/components/layout/page-section";
import { getPlatformSettings } from "@/lib/settings";

export default async function ParticipatePage() {
  const settings = await getPlatformSettings();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <PageSection
        eyebrow="How to participate"
        title="Join the monthly Expert Seva Diwas movement"
        description={`The program is designed to make participation easy for busy professionals while keeping every public metric trustworthy. The current seva rhythm is ${settings.sevaDayLabel}.`}
      >
        <div className="grid gap-5">
          {[
            "Register as alumni and complete your professional profile.",
            "Wait for verification from the alumni team.",
            "Record any qualifying seva, charity, waiver, volunteer service, mentoring, or donation.",
            "Upload proof and declare public visibility with consent status.",
            "Track your contribution, recognition, and certificates from the alumni portal.",
          ].map((item, index) => (
            <div key={item} className="rounded-[2rem] border border-slate-200 bg-white px-6 py-6 shadow-sm sm:px-8 sm:py-7">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-800">Step {index + 1}</p>
              <p className="mt-3 max-w-4xl text-[1.04rem] leading-8 text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </PageSection>
    </div>
  );
}

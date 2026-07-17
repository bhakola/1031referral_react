import { site } from "@/content/site";

export default function Hero() {
  const { hero } = site;
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-navy text-white"
    >
      {/* Background image + overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/assets/bkgd_courtyard.jpg)" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-navy/80" aria-hidden />

      <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-32">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-gold">
          {hero.eyebrow}
        </p>
        <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          {hero.heading}
        </h1>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={hero.primaryCta.href}
            className="w-full rounded-full bg-gold px-8 py-4 text-base font-bold tracking-wide text-ink shadow-lg transition-colors hover:bg-gold-dark sm:w-auto"
          >
            {hero.primaryCta.label}
          </a>
          <a
            href={hero.secondaryCta.href}
            className="w-full rounded-full border-2 border-white/80 px-8 py-4 text-base font-bold text-white transition-colors hover:bg-white hover:text-navy sm:w-auto"
          >
            {hero.secondaryCta.label}
          </a>
        </div>
      </div>
    </section>
  );
}

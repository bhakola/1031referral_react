import Image from "next/image";
import { site } from "@/content/site";

export default function Steps() {
  const { steps } = site;
  return (
    <section id={steps.id} className="bg-cream py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-gold">
            {steps.eyebrow}
          </p>
          <h2 className="text-3xl font-bold text-navy sm:text-4xl">{steps.title}</h2>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-5">
          {steps.items.map((step, i) => (
            <div
              key={step.src}
              className="grid gap-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:grid-cols-[112px_1fr] sm:items-start sm:p-7"
            >
              <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                  {i + 1}
                </span>
                <Image
                  src={step.src}
                  alt={step.alt}
                  width={220}
                  height={220}
                  className="h-auto w-20 sm:w-24"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-navy">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{step.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <a
            href={steps.cta.href}
            className="inline-block rounded-full bg-gold px-8 py-4 text-base font-bold tracking-wide text-ink shadow-md transition-colors hover:bg-gold-dark"
          >
            {steps.cta.label}
          </a>
        </div>
      </div>
    </section>
  );
}

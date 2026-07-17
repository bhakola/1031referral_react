import { site } from "@/content/site";

export default function WhatIs1031() {
  const { what1031 } = site;
  return (
    <section
      id={what1031.id}
      className="relative overflow-hidden bg-ink text-white"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url(/assets/bkgd_testimonials.jpg)" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-24">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-gold">
          {what1031.eyebrow}
        </p>
        <h2 className="text-3xl font-bold sm:text-4xl">{what1031.title}</h2>
        <p className="mt-6 text-lg leading-relaxed text-white/85">{what1031.body}</p>
        <a
          href={what1031.cta.href}
          className="mt-10 inline-block rounded-full bg-gold px-8 py-4 text-base font-bold tracking-wide text-ink shadow-lg transition-colors hover:bg-gold-dark"
        >
          {what1031.cta.label}
        </a>
      </div>
    </section>
  );
}

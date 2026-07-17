import { site } from "@/content/site";

export default function QualifiedIntermediary() {
  const { qi } = site;
  return (
    <section id={qi.id} className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-navy sm:text-4xl">{qi.title}</h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">{qi.body}</p>
        </div>

        <ul className="mx-auto mt-12 grid max-w-4xl gap-x-8 gap-y-4 sm:grid-cols-2">
          {qi.traits.map((trait) => (
            <li key={trait} className="flex items-start gap-3">
              <span
                className="mt-1 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-gold text-ink"
                aria-hidden
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-base leading-snug text-ink">{trait}</span>
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-16 max-w-3xl rounded-2xl bg-cream p-8 text-center sm:p-10">
          <h3 className="text-2xl font-bold text-navy">{qi.functionsTitle}</h3>
          <p className="mt-4 text-lg leading-relaxed text-muted">{qi.functionsBody}</p>
          <a
            href={qi.cta.href}
            className="mt-8 inline-block rounded-full bg-navy px-8 py-3.5 text-sm font-bold tracking-wide text-white transition-colors hover:bg-ink"
          >
            {qi.cta.label}
          </a>
        </div>
      </div>
    </section>
  );
}

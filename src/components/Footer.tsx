import Image from "next/image";
import { site } from "@/content/site";

export default function Footer() {
  const { footer } = site;
  return (
    <footer className="bg-navy text-white/90">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2">
        <div>
          <Image
            src="/assets/1031-Referral-Logo.svg"
            alt={`${site.name} logo`}
            width={200}
            height={29}
            className="mb-5 h-auto w-[200px] brightness-0 invert"
            style={{ height: "auto" }}
          />
          <h3 className="text-xl font-bold text-white">{footer.aboutTitle}</h3>
          <p className="mt-3 max-w-md leading-relaxed text-white/80">{footer.aboutBody}</p>
        </div>

        <div className="md:pl-8">
          <h3 className="text-xl font-bold text-white">{footer.contactTitle}</h3>
          <ul className="mt-4 space-y-3">
            {site.phones.map((p) => (
              <li key={p.number} className="flex items-center gap-2">
                <span className="text-sm font-semibold uppercase tracking-wide text-gold">
                  {p.label}:
                </span>
                <a href={p.href} className="hover:text-gold">
                  {p.number}
                </a>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <span className="text-sm font-semibold uppercase tracking-wide text-gold">
                Email:
              </span>
              <a href={`mailto:${site.email}`} className="hover:text-gold">
                {site.email}
              </a>
            </li>
          </ul>

          <Image
            src="/assets/DIS-Logo-Final-RGB.png"
            alt="Diversified Investments Logo"
            width={245}
            height={57}
            className="mt-8 h-auto w-[150px] brightness-0 invert"
            style={{ height: "auto" }}
          />
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-white/60 sm:px-6">
          © {new Date().getFullYear()} {site.domain}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

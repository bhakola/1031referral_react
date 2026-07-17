import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Your request has been received — an accommodator will be assigned to you.",
  robots: { index: false, follow: false },
};

export default function ThankYou() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 py-20 text-center">
      <Image
        src="/assets/1031-Referral-Logo.svg"
        alt={`${site.name} logo`}
        width={220}
        height={32}
        className="h-auto w-[220px]"
        style={{ height: "auto" }}
        priority
      />

      <div className="mt-10 flex h-16 w-16 items-center justify-center rounded-full bg-gold">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#253957" strokeWidth="3">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="mt-6 text-3xl font-bold text-navy sm:text-4xl">Thank you!</h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
        Your request has been received. An accommodator (QI) will be assigned to you shortly.
        If you have immediate questions, reach us at{" "}
        <a href={`mailto:${site.email}`} className="font-semibold text-navy hover:text-gold">
          {site.email}
        </a>
        .
      </p>

      <Link
        href="/"
        className="mt-10 inline-block rounded-full bg-navy px-8 py-3.5 text-sm font-bold tracking-wide text-white transition-colors hover:bg-ink"
      >
        Return Home
      </Link>
    </main>
  );
}

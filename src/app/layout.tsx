import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://1031referral.com"),
  title: {
    default:
      "1031 Referral — Find a Qualified Intermediary for Your 1031 Exchange",
    template: "%s | 1031 Referral",
  },
  description:
    "1031referral.com is an independent, third-party service that vets and refers trusted Qualified Intermediaries (QIs) for your 1031 tax-deferred exchange. No fees, no compensation for referrals.",
  keywords: [
    "1031 exchange",
    "qualified intermediary",
    "1031 QI",
    "tax-deferred exchange",
    "accommodator",
    "like-kind exchange",
  ],
  openGraph: {
    title: "1031 Referral — Find a Qualified Intermediary",
    description:
      "Independent service that vets and refers trusted Qualified Intermediaries for your 1031 exchange.",
    url: "https://1031referral.com",
    siteName: "1031 Referral",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

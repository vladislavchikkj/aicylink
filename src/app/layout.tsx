import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CookieBanner } from "@/components/cookie-banner";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MotionProviders } from "@/components/motion/providers";
import { site } from "@/content/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const defaultTitle = `${site.name} — ${site.title} ${site.titleAccent}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: defaultTitle, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    title: defaultTitle,
    description: site.description,
    siteName: site.name,
    url: site.url,
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: defaultTitle, description: site.description },
  // Keep demo content out of search results until real data is in place.
  robots: site.demo ? { index: false, follow: false } : { index: true, follow: true },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  logo: `${site.url}/logo-dark.svg`,
  email: site.email,
  foundingDate: String(site.founded),
  sameAs: [site.linkedin],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <MotionProviders>
          <Header />
          <main>{children}</main>
          <Footer />
          <CookieBanner />
        </MotionProviders>
      </body>
    </html>
  );
}

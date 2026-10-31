import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CookieBanner } from "@/components/cookie-banner";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MotionProviders } from "@/components/motion/providers";
import { categories, site } from "@/content/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Search titles lead with what people search for; the hero headline stays more poetic.
const defaultTitle = `${site.name} — AI apps for everyday life`;

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
  ...(site.googleVerification && { verification: { google: site.googleVerification } }),
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  logo: `${site.url}/apple-icon`,
  email: site.email,
  foundingDate: String(site.founded),
  sameAs: [site.linkedin],
  owns: categories
    .flatMap((c) => c.products)
    .filter((p) => p.href)
    .map((p) => ({ "@type": "SoftwareApplication", name: p.name, url: p.href, applicationCategory: "UtilitiesApplication", operatingSystem: "Web" })),
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

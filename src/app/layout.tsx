import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} — ${site.title} ${site.titleAccent}`,
  description: site.description,
  icons: { icon: "/logo.svg" },
  openGraph: {
    title: site.name,
    description: site.description,
    siteName: site.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <MotionProviders>{children}</MotionProviders>
      </body>
    </html>
  );
}

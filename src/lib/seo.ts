import type { Metadata } from "next";
import { site } from "@/content/site";

/** Title, description, canonical URL and share previews for one page. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const fullTitle = `${title} — ${site.name}`;
  // Setting openGraph here replaces the inherited one, so the shared preview image is listed explicitly.
  const images = [{ url: "/opengraph-image", width: 1200, height: 630, alt: site.name }];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: fullTitle, description, url: path, siteName: site.name, type: "website", locale: "en_US", images },
    twitter: { card: "summary_large_image", title: fullTitle, description, images },
  };
}

import type { MetadataRoute } from "next";
import { allApps } from "@/content/apps";
import { site } from "@/content/site";

const routes = ["", ...allApps.map((a) => `/apps/${a.slug}`), "/about", "/careers", "/contact", "/press", "/legal/privacy", "/legal/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route.startsWith("/legal") ? "yearly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}

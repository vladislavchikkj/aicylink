import type { MetadataRoute } from "next";
import { site } from "@/content/site";

const routes = ["", "/about", "/careers", "/contact", "/press", "/legal/privacy", "/legal/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route.startsWith("/legal") ? "yearly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}

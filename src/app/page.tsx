import type { Metadata } from "next";
import { Clients } from "@/components/clients";
import { Company } from "@/components/company";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { Metrics } from "@/components/metrics";
import { ChapterRail } from "@/components/chapter-rail";
import { Products } from "@/components/products";
import { Flagship, Lab } from "@/components/showcase";
import { Testimonials } from "@/components/testimonials";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <>
      <Hero />
      <Clients />
      <Products />
      <Flagship />
      <Lab />
      <Metrics />
      <Company />
      <Testimonials />
      <Contact />
      <ChapterRail />
    </>
  );
}

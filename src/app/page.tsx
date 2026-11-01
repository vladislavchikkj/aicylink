import type { Metadata } from "next";
import { Clients } from "@/components/clients";
import { Company } from "@/components/company";
import { Contact } from "@/components/contact";
import { CrystalStageLoader } from "@/components/crystal-stage-loader";
import { Hero } from "@/components/hero";
import { Metrics } from "@/components/metrics";
import { Products } from "@/components/products";
import { Testimonials } from "@/components/testimonials";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <>
      <CrystalStageLoader />
      <Hero />
      <Clients />
      <Products />
      <Metrics />
      <Company />
      <Testimonials />
      <Contact />
    </>
  );
}

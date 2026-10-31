import { Careers } from "@/components/careers";
import { Clients } from "@/components/clients";
import { Company } from "@/components/company";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { Metrics } from "@/components/metrics";
import { Products } from "@/components/products";
import { Testimonials } from "@/components/testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <Clients />
      <Products />
      <Metrics />
      <Company />
      <Testimonials />
      <Careers />
      <Contact />
    </>
  );
}

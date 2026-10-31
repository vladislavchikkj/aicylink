import { Careers } from "@/components/careers";
import { Company } from "@/components/company";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Partners } from "@/components/partners";
import { Products } from "@/components/products";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Products />
        <Company />
        <Partners />
        <Careers />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

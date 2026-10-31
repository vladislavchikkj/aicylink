import Image from "next/image";
import { partners } from "@/content/site";
import { Reveal } from "./motion/reveal";
import { Button, Container, Eyebrow } from "./ui";

export function Partners() {
  return (
    <section id="partners" className="scroll-mt-16 border-y border-border bg-surface py-16">
      <Container>
        {partners.length > 0 ? (
          <>
            <Eyebrow className="text-center text-subtle">Trusted by clients and partners</Eyebrow>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-14 gap-y-8">
              {partners.map((p) => (
                <a key={p.name} href={p.href} className="opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0">
                  <Image src={p.logo} alt={p.name} width={120} height={40} className="h-8 w-auto" />
                </a>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <Reveal from="left">
              <Eyebrow>Clients &amp; partners</Eyebrow>
              <p className="mt-3 text-2xl font-bold tracking-tight text-balance">Your logo could be the first one here.</p>
              <p className="mt-2 text-muted">We&apos;re looking for early clients, sponsors and partners to grow with.</p>
            </Reveal>
            <Reveal from="right" delay={0.15}>
              <Button href="#contact">Become a partner</Button>
            </Reveal>
          </div>
        )}
      </Container>
    </section>
  );
}

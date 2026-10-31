import Link from "next/link";
import { audiences } from "@/content/site";
import { Stagger, StaggerItem, type From } from "./motion/reveal";
import { Container, SectionHeading } from "./ui";

const directions: From[] = ["left", "up", "right"];

export function Company() {
  return (
    <section id="company" className="scroll-mt-16 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Company"
          title="Built for everyone who builds the web."
          text="AicyLink is a home for ambitious web services: one team, one platform and one standard of quality across everything we ship."
        />

        <Stagger className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-3" stagger={0.14}>
          {audiences.map((a, i) => (
            <StaggerItem key={a.tag} from={directions[i % 3]} className="group flex flex-col bg-white p-8">
              <span className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-subtle">
                <span className="size-2 rounded-full" style={{ background: a.color }} />
                {a.tag}
              </span>
              <h3 className="mt-5 text-2xl font-bold tracking-tight text-balance">{a.title}</h3>
              <p className="mt-3 flex-1 text-muted">{a.text}</p>
              <Link href={a.cta.href} className="mt-8 text-sm font-semibold transition-colors hover:text-ice-1">
                {a.cta.label} →
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

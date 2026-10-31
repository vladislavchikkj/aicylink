import { roles, site } from "@/content/site";
import { Reveal } from "./motion/reveal";
import { Button, Container, SectionHeading } from "./ui";

export function Careers() {
  return (
    <section id="careers" className="scroll-mt-16 py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-2">
        <SectionHeading
          eyebrow="Careers"
          title="Join the team building what's next."
          text="We're a small, senior team. Everyone ships, everyone owns their work, and every product starts from a blank page."
        />

        <Reveal from="right" delay={0.15} className="overflow-hidden rounded-2xl border border-border">
          {roles.length > 0 ? (
            roles.map((role) => (
              <a
                key={role.title}
                href={role.href}
                className="flex items-center justify-between border-b border-border p-6 transition-colors last:border-b-0 hover:bg-surface"
              >
                <span className="font-semibold">{role.title}</span>
                <span className="font-mono text-xs text-subtle">{role.location} →</span>
              </a>
            ))
          ) : (
            <div className="p-8">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-subtle">Open roles</p>
              <p className="mt-4 text-muted">
                No open positions right now — but we&apos;re always happy to meet great engineers and designers.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={`mailto:${site.email}?subject=Careers`}>Send us a note</Button>
                <Button href={site.linkedin} variant="secondary">
                  Follow on LinkedIn
                </Button>
              </div>
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}

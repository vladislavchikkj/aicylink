import Link from "next/link";
import { roles, site } from "@/content/site";
import { Reveal } from "./motion/reveal";
import { Button, Container, SectionHeading } from "./ui";

export function RoleList({ limit }: { limit?: number }) {
  const shown = limit ? roles.slice(0, limit) : roles;

  if (!shown.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-8">
        <p className="font-semibold">No open roles right now.</p>
        <p className="mt-2 text-sm text-muted">
          We&apos;re always happy to meet great people — send us a note at{" "}
          <a href={`mailto:${site.careersEmail}`} className="font-semibold text-foreground hover:text-ice-1">
            {site.careersEmail}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      {shown.map((role) => (
        <Link
          key={role.title}
          href={role.href}
          className="group flex flex-col gap-2 border-b border-border p-6 transition-colors last:border-b-0 hover:bg-surface sm:flex-row sm:items-center sm:justify-between"
        >
          <span>
            <span className="font-semibold">{role.title}</span>
            <span className="mt-1 block text-sm text-muted">{role.team}</span>
          </span>
          <span className="flex items-center gap-3 font-mono text-xs text-subtle">
            {role.location} · {role.type}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

export function Careers() {
  return (
    <section id="careers" className="scroll-mt-16 py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Careers"
            title="Join the team building what's next."
            text="We're a small, senior team. Everyone ships, everyone owns their work, and every product starts from a blank page."
          />
          <Reveal delay={0.25} className="mt-8">
            <Button href="/careers">View all open roles</Button>
          </Reveal>
        </div>
        <Reveal from="right" delay={0.15}>
          <RoleList limit={3} />
        </Reveal>
      </Container>
    </section>
  );
}

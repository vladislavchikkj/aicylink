import type { Metadata } from "next";
import { RoleList } from "@/components/careers";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Spotlight } from "@/components/motion/spotlight";
import { Button, Container, PageHero, SectionHeading } from "@/components/ui";
import { hiringSteps, perks, roles, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Careers",
  description: `Join ${site.name} and build web services used around the world.`,
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Do the best work of your career."
        text="Small senior teams, real ownership and products that ship. We're hiring people who care about craft as much as we do."
      />

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Why AicyLink" title="Built around great people." />
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {perks.map((p) => (
              <StaggerItem key={p.title}>
                <Spotlight className="h-full rounded-2xl border border-border p-8">
                  <h3 className="text-lg font-bold tracking-tight">{p.title}</h3>
                  <p className="mt-2 text-muted">{p.text}</p>
                </Spotlight>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section id="roles" className="scroll-mt-16 border-y border-border bg-surface py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading
            eyebrow={roles.length ? `Open roles · ${roles.length}` : "Open roles"}
            title="Find your next role."
            text="Don't see a perfect match? We still want to hear from you."
          />
          <Reveal from="right" delay={0.1}>
            <RoleList />
            <p className="mt-6 text-sm text-muted">
              Open application:{" "}
              <a href={`mailto:${site.careersEmail}`} className="font-semibold text-foreground hover:text-ice-1">
                {site.careersEmail}
              </a>
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Hiring process" title="Simple, fast and respectful of your time." />
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.12}>
            {hiringSteps.map((s) => (
              <StaggerItem key={s.step} from="left" className="border-t-2 border-ink pt-6">
                <p className="font-mono text-sm font-semibold text-ice-1">{s.step}</p>
                <h3 className="mt-3 text-lg font-bold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm text-muted">{s.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-14">
            <Button href="/contact?topic=careers">Apply now</Button>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

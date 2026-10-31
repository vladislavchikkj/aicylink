import type { Metadata } from "next";
import { Contact } from "@/components/contact";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Spotlight } from "@/components/motion/spotlight";
import { Avatar, Container, Eyebrow, PageHero, SectionHeading } from "@/components/ui";
import { site, team, timeline, values } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} is a product company building a portfolio of fast, intelligent web services.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About AicyLink"
        title="We build the services the web runs on next."
        text={`Founded in ${site.founded}, AicyLink is a product company with one mission: make powerful web services simple, fast and available to every business.`}
      />

      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Reveal from="left">
            <Eyebrow>Our mission</Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Great software shouldn&apos;t require a giant team. We build the products, run the infrastructure and
              bake in the intelligence — so our customers can{" "}
              <span className="text-ice-gradient">focus on what makes them unique.</span>
            </p>
          </Reveal>
        </Container>
      </section>

      {timeline.length > 0 && (
        <section className="border-y border-border bg-surface py-20 sm:py-28">
          <Container>
            <SectionHeading eyebrow="Our story" title="From a small team to a growing portfolio." />
            <Stagger className="relative mt-14 grid gap-10 lg:grid-cols-3" stagger={0.18}>
              <div className="absolute left-0 right-0 top-[7px] hidden h-px bg-border lg:block" aria-hidden />
              {timeline.map((t) => (
                <StaggerItem key={t.year} from="left" className="relative">
                  <span className="relative block size-[15px] rounded-full border-4 border-surface bg-ice-1 shadow-[0_0_0_1px_var(--ice-1)]" />
                  <p className="mt-6 font-mono text-sm font-semibold text-ice-1">{t.year}</p>
                  <h3 className="mt-2 text-xl font-bold tracking-tight">{t.title}</h3>
                  <p className="mt-2 text-muted">{t.text}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </section>
      )}

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Values" title="How we work." />
          <Stagger className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <StaggerItem key={v.title} className="bg-white">
                <Spotlight className="h-full p-8">
                  <p className="font-mono text-xs text-subtle">0{i + 1}</p>
                  <h3 className="mt-6 text-lg font-bold tracking-tight">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted">{v.text}</p>
                </Spotlight>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {team.length > 0 && (
        <section className="border-t border-border bg-surface py-20 sm:py-28">
          <Container>
            <SectionHeading
              eyebrow="Leadership"
              title="The people behind AicyLink."
              text="A senior team of engineers, designers and operators who have shipped products used by millions."
            />
            <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
              {team.map((m, i) => (
                <StaggerItem key={m.name} from="scale">
                  <Spotlight className="flex items-center gap-4 rounded-2xl border border-border bg-white p-6">
                    <Avatar name={m.name} index={i} size="size-14" />
                    <span>
                      <span className="block font-semibold">{m.name}</span>
                      <span className="block text-sm text-muted">{m.role}</span>
                    </span>
                  </Spotlight>
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </section>
      )}

      <div className="pt-20 sm:pt-28">
        <Contact />
      </div>
    </>
  );
}

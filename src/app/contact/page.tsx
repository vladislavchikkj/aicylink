import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Container, Eyebrow, PageHero } from "@/components/ui";
import { contactTopics, site, type ContactTopic } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name} — investors, partners, customers and press.`,
  alternates: { canonical: "/contact" },
};

const mailboxes = [
  { label: "Email", value: site.email },
  { label: "Press", value: site.pressEmail },
  { label: "Careers", value: site.careersEmail },
];

// Separate press/careers mailboxes only show up once they differ from the main one.
const channels = [
  ...mailboxes
    .filter((m, i) => mailboxes.findIndex((o) => o.value === m.value) === i)
    .map((m) => ({ ...m, href: `mailto:${m.value}` })),
  { label: "LinkedIn", value: "AicyLink", href: site.linkedin },
];

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams;
  const initialTopic: ContactTopic = contactTopics.some((t) => t.id === topic) ? (topic as ContactTopic) : "partnership";

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk."
        text="Whether you're an investor, a potential partner or want to use our products — we'd love to hear from you."
      />
      <section className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <Stagger className="space-y-8" stagger={0.1}>
            {channels.map((c) => (
              <StaggerItem key={c.label} from="left">
                <Eyebrow className="text-subtle">{c.label}</Eyebrow>
                <a href={c.href} className="mt-2 block text-lg font-semibold transition-colors hover:text-ice-1">
                  {c.value}
                </a>
              </StaggerItem>
            ))}
            <StaggerItem from="left">
              <Eyebrow className="text-subtle">Company</Eyebrow>
              <p className="mt-2 text-muted">
                {site.legalName}
                <br />
                {site.location}
              </p>
            </StaggerItem>
          </Stagger>
          <Reveal from="right" delay={0.15}>
            <ContactForm initialTopic={initialTopic} />
          </Reveal>
        </Container>
      </section>
    </>
  );
}

import { testimonials } from "@/content/site";
import { Stagger, StaggerItem, type From } from "./motion/reveal";
import { Spotlight } from "./motion/spotlight";
import { Avatar, Container, SectionHeading } from "./ui";

const directions: From[] = ["left", "up", "right"];

export function Testimonials() {
  if (!testimonials.length) return null;
  return (
    <section className="border-t border-border bg-surface py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Customers"
          title="Teams that build with AicyLink."
          text="From fast-moving startups to established businesses — here's what our customers say."
        />
        <Stagger className="mt-12 grid gap-6 lg:grid-cols-3" stagger={0.14}>
          {testimonials.map((t, i) => (
            <StaggerItem key={t.name} from={directions[i % 3]}>
              <Spotlight className="flex h-full flex-col rounded-2xl border border-border bg-white p-8">
                <svg viewBox="0 0 32 24" className="h-6 w-8 text-ice-1" fill="currentColor" aria-hidden>
                  <path d="M0 24V14C0 6 4 1 12 0l1 4c-4 1-6 4-6 8h5v12zm19 0V14c0-8 4-13 12-14l1 4c-4 1-6 4-6 8h5v12z" />
                </svg>
                <blockquote className="mt-6 flex-1 text-lg font-medium tracking-tight text-pretty">{t.quote}</blockquote>
                <figcaption className="mt-8 flex items-center gap-3">
                  <Avatar name={t.name} index={i} />
                  <span>
                    <span className="block text-sm font-semibold">{t.name}</span>
                    <span className="block text-sm text-muted">{t.role}</span>
                  </span>
                </figcaption>
              </Spotlight>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

import { clients } from "@/content/site";
import { Reveal } from "./motion/reveal";
import { Container, Eyebrow } from "./ui";

// Simple geometric marks so the demo wordmarks read as real brands.
const marks = [
  <circle key="c" cx="10" cy="10" r="7" />,
  <rect key="r" x="3" y="3" width="14" height="14" rx="3" />,
  <path key="t" d="M10 2 18 17H2Z" />,
  <path key="d" d="M10 2 18 10 10 18 2 10Z" />,
  <path key="h" d="M3 3h6v14H3zM11 3h6v14h-6z" />,
  <path key="w" d="M2 14c4-8 12-8 16 0" fill="none" stroke="currentColor" strokeWidth="3" />,
];

function Wordmark({ name, index }: { name: string; index: number }) {
  return (
    <span className="flex shrink-0 items-center gap-2 text-xl font-bold tracking-tight text-foreground/45 transition-colors hover:text-foreground">
      <svg viewBox="0 0 20 20" className="size-5" fill="currentColor" aria-hidden>
        {marks[index % marks.length]}
      </svg>
      {name}
    </span>
  );
}

export function Clients() {
  if (!clients.length) return null;
  return (
    <section id="partners" className="scroll-mt-16 border-b border-border py-14">
      <Container>
        <Reveal>
          <Eyebrow className="text-center text-subtle">Trusted by fast-growing teams worldwide</Eyebrow>
        </Reveal>
      </Container>
      <Reveal delay={0.15}>
        <div className="marquee mt-8 overflow-hidden">
          <div className="marquee-track flex w-max gap-16 pr-16">
            {[...clients, ...clients].map((name, i) => (
              <Wordmark key={i} name={name} index={i % clients.length} />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

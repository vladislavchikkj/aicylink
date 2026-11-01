import Link from "next/link";
import { Reveal, WordsReveal } from "./motion/reveal";
import { ScrollWords } from "./motion/scroll";

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className ?? ""}`}>{children}</div>;
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-mono text-xs font-semibold uppercase tracking-widest ${className ?? "text-ice-1"}`}>{children}</p>
  );
}

/**
 * One home-page chapter. From laptops up it fills the screen below the header with its content
 * centered; the side rail lists chapters by `label`.
 */
export function Chapter({ id, label, className = "", children }: { id: string; label: string; className?: string; children: React.ReactNode }) {
  return (
    <section
      id={id}
      data-chapter={label}
      className={`section-y relative scroll-mt-16 lg:flex lg:min-h-[calc(100svh-4rem)] lg:flex-col lg:justify-center lg:py-12 ${className}`}
    >
      {children}
    </section>
  );
}

/** Section title. `index` adds a numbered label ("01 — Products") for the home page's section system. */
export function SectionHeading({
  eyebrow,
  title,
  text,
  center,
  index,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  center?: boolean;
  index?: string;
}) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      <Reveal from="left" duration={0.8}>
        {index ? (
          <p className={`flex items-center gap-3 font-mono text-xs font-semibold uppercase tracking-widest ${center ? "justify-center" : ""}`}>
            <span className="text-foreground">{index}</span>
            <span className="h-px w-8 bg-border" aria-hidden />
            <span className="text-ice-1">{eyebrow}</span>
          </p>
        ) : (
          <Eyebrow>{eyebrow}</Eyebrow>
        )}
      </Reveal>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
        <ScrollWords text={title} />
      </h2>
      {text && (
        <Reveal delay={0.16}>
          <p className="mt-4 text-lg text-muted text-pretty">{text}</p>
        </Reveal>
      )}
    </div>
  );
}

/** Top section of inner pages: grid backdrop, icy glow and an animated title. */
export function PageHero({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="page-grid absolute inset-0" aria-hidden />
      <div className="ice-glow absolute -top-40 left-1/2 size-[560px] -translate-x-1/2 rounded-full opacity-70" aria-hidden />
      <Container className="relative py-20 sm:py-28">
        <Reveal from="left" duration={0.8}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
        <h1 className="mt-4 max-w-4xl text-5xl font-bold tracking-tighter sm:text-6xl">
          <WordsReveal text={title} delay={0.1} />
        </h1>
        {text && (
          <Reveal delay={0.4}>
            <p className="mt-6 max-w-2xl text-lg text-muted text-pretty">{text}</p>
          </Reveal>
        )}
      </Container>
    </section>
  );
}

const buttonStyles = {
  primary: "bg-ink text-white hover:bg-ink/80",
  secondary: "border border-border bg-white text-foreground hover:border-foreground/40",
  inverted: "bg-white text-ink hover:bg-white/85",
  ghost: "border border-white/25 text-white hover:bg-white/10",
};

export function Button({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof buttonStyles;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0 ${buttonStyles[variant]}`}
    >
      {children}
    </Link>
  );
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

const avatarGradients = [
  "linear-gradient(135deg, var(--ice-1), var(--ice-3))",
  "linear-gradient(135deg, var(--ice-2), var(--ice-1))",
  "linear-gradient(135deg, var(--ice-3), var(--ice-2))",
];

export function Avatar({ name, index, size = "size-11" }: { name: string; index: number; size?: string }) {
  return (
    <span
      className={`${size} flex shrink-0 items-center justify-center rounded-full text-sm font-bold text-white`}
      style={{ background: avatarGradients[index % avatarGradients.length] }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}

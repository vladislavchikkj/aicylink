import Link from "next/link";
import { Reveal } from "./motion/reveal";

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className ?? ""}`}>{children}</div>;
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-mono text-xs font-semibold uppercase tracking-widest ${className ?? "text-ice-1"}`}>{children}</p>
  );
}

export function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="max-w-2xl">
      <Reveal from="left" duration={0.8}>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">{title}</h2>
      </Reveal>
      {text && (
        <Reveal delay={0.16}>
          <p className="mt-4 text-lg text-muted text-pretty">{text}</p>
        </Reveal>
      )}
    </div>
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

import { metrics } from "@/content/site";
import { CountUp } from "./motion/count-up";
import { Stagger, StaggerItem } from "./motion/reveal";
import { Container } from "./ui";

export function Metrics() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-white sm:py-24">
      <div
        className="pointer-events-none absolute -left-40 top-1/2 size-[520px] -translate-y-1/2 rounded-full opacity-30 blur-[120px]"
        style={{ background: "conic-gradient(var(--ice-1), var(--ice-3), var(--ice-2), var(--ice-1))" }}
        aria-hidden
      />
      <Container className="relative">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-ice-1">AicyLink in numbers</p>
        <Stagger className="mt-10 grid grid-cols-2 gap-y-12 lg:grid-cols-4" stagger={0.12}>
          {metrics.map((m) => (
            <StaggerItem key={m.label} className="border-l border-white/15 pl-6">
              <p className="text-4xl font-bold tracking-tighter sm:text-6xl">
                <CountUp value={m.value} decimals={m.decimals} suffix={m.suffix} />
              </p>
              <p className="mt-2 text-sm text-white/60">{m.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

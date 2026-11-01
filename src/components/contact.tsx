"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { site } from "@/content/site";
import { MARK_PATH } from "./logo";
import { EASE_OUT, Reveal } from "./motion/reveal";
import { Button, Container } from "./ui";

// The logo's sparkle cut into four shards along its rays (center 861,519 in logo coordinates).
// They fly in and lock together when the banner appears.
const SPARKLE_SHARDS = [
  { d: "M861 519L861 435C865 497 872 515 945 519Z", from: { x: 140, y: -160, rotate: 70 } },
  { d: "M861 519L945 519C872 523 865 541 861 603Z", from: { x: 170, y: 130, rotate: -60 } },
  { d: "M861 519L861 603C857 541 850 523 778 519Z", from: { x: -150, y: 150, rotate: 80 } },
  { d: "M861 519L778 519C850 515 857 497 861 435Z", from: { x: -170, y: -120, rotate: -75 } },
];

function AssemblingMark() {
  return (
    <svg viewBox="330 420 630 340" className="h-28 w-auto overflow-visible text-white" aria-hidden>
      <motion.path
        d={MARK_PATH}
        fill="currentColor"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1, delay: 0.3, ease: EASE_OUT }}
      />
      <g className="sparkle-glow">
        {SPARKLE_SHARDS.map((shard, i) => (
          <motion.path
            key={shard.d}
            d={shard.d}
            fill="#bae6fd"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            initial={{ ...shard.from, opacity: 0, scale: 0.6 }}
            whileInView={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.4, delay: 0.55 + i * 0.12, ease: EASE_OUT }}
          />
        ))}
      </g>
    </svg>
  );
}

export function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], [-120, 120]);
  const markRotate = useTransform(scrollYProgress, [0, 1], [-12, 12]);

  return (
    <section id="contact" data-chapter="Contact" className="scroll-mt-16 pb-20 pt-4 sm:pb-28 lg:pt-12">
      <Container>
        <motion.div
          ref={ref}
          className="relative overflow-hidden rounded-3xl bg-ink px-6 py-16 text-white sm:px-16 sm:py-20"
          initial={{ clipPath: "inset(12% 8% 12% 8% round 48px)", opacity: 0.4 }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0% round 24px)", opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.3, ease: EASE_OUT }}
        >
          <motion.div
            className="pointer-events-none absolute -right-32 -top-32 size-[480px] rounded-full opacity-50 blur-[100px]"
            style={{ y: glowY, background: "conic-gradient(var(--ice-1), var(--ice-2), var(--ice-3), var(--ice-1))" }}
            aria-hidden
          />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <Reveal delay={0.3}>
                <h2 className="max-w-2xl text-4xl font-bold tracking-tighter text-balance sm:text-5xl">
                  Let&apos;s build something together.
                </h2>
              </Reveal>
              <Reveal delay={0.4}>
                <p className="mt-4 max-w-lg text-white/70 text-balance">
                  Investors, businesses and future teammates — we&apos;d love to hear from you.
                </p>
              </Reveal>
              <Reveal delay={0.5}>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <Button href="/contact" variant="inverted">
                    Get in touch →
                  </Button>
                  <Button href={`mailto:${site.email}`} variant="ghost">
                    {site.email}
                  </Button>
                </div>
              </Reveal>
            </div>
            <motion.div style={{ rotate: markRotate }} className="hidden lg:block">
              <AssemblingMark />
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

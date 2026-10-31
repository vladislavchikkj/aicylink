"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { site } from "@/content/site";
import { LogoMark } from "./logo";
import { EASE_OUT, Reveal } from "./motion/reveal";
import { Button, Container } from "./ui";

export function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], [-120, 120]);
  const markRotate = useTransform(scrollYProgress, [0, 1], [-12, 12]);

  return (
    <section id="contact" className="scroll-mt-16 pb-20 sm:pb-28">
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
                <p className="mt-4 max-w-lg text-white/70">
                  Investors, businesses and future teammates — we&apos;d love to hear from you.
                </p>
              </Reveal>
              <Reveal delay={0.5}>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <Button href={`mailto:${site.email}`} variant="inverted">
                    {site.email}
                  </Button>
                  <Button href={site.linkedin} variant="ghost">
                    LinkedIn →
                  </Button>
                </div>
              </Reveal>
            </div>
            <motion.div style={{ rotate: markRotate }} className="hidden lg:block">
              <Reveal from="scale" delay={0.5}>
                <LogoMark className="h-28 w-auto text-white" sparkleClassName="sparkle-glow" />
              </Reveal>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

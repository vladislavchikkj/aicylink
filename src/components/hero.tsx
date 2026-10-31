"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { principles, site } from "@/content/site";
import { Globe } from "./globe";
import { EASE_OUT, Stagger, StaggerItem, WordsReveal } from "./motion/reveal";
import { Button, Container, Eyebrow } from "./ui";

function FadeIn({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const globeY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const globeScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="top">
      <div ref={ref} className="overflow-hidden">
        <Container className="grid items-center gap-8 py-14 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <motion.div style={{ y: textY, opacity: fade }}>
            <FadeIn delay={0.1}>
              <Eyebrow>{site.eyebrow}</Eyebrow>
            </FadeIn>
            <h1 className="mt-4 text-5xl font-bold tracking-tighter sm:text-6xl lg:text-7xl">
              <WordsReveal text={site.title} delay={0.2} />
              <WordsReveal text={site.titleAccent} wordClassName="text-ice-gradient" delay={0.45} />
            </h1>
            <FadeIn delay={0.75}>
              <p className="mt-6 max-w-xl text-lg text-muted text-pretty">{site.description}</p>
            </FadeIn>
            <FadeIn delay={0.9}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button href="#products">Explore products</Button>
                <Button href="#contact" variant="secondary">
                  Become a partner
                </Button>
              </div>
            </FadeIn>
          </motion.div>

          <motion.div
            style={{ y: globeY, scale: globeScale }}
            initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.6, delay: 0.2, ease: EASE_OUT }}
          >
            <Globe />
          </motion.div>
        </Container>
      </div>

      <div className="relative z-10 bg-ink text-white">
        <Stagger className="mx-auto grid w-full max-w-7xl grid-cols-2 px-4 sm:px-6 lg:grid-cols-4 lg:px-8" stagger={0.1}>
          {principles.map((p) => (
            <StaggerItem key={p.label} className="border-white/10 py-8 pr-4 lg:border-l lg:pl-6 lg:first:border-l-0 lg:first:pl-0">
              <p className="text-lg font-bold tracking-tight">{p.label}</p>
              <p className="mt-1 text-sm text-white/60">{p.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

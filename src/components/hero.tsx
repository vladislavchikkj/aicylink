"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { principles, site } from "@/content/site";
import { AppMagnetLoader } from "./app-magnet-loader";
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
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    // On laptops and desktops the first screen fills the window exactly, principles band pinned to its bottom.
    <section id="top" data-chapter="Intro" className="relative isolate flex flex-col lg:min-h-[calc(100svh-4rem)]">
      <div className="aurora pointer-events-none absolute inset-0 -z-10" aria-hidden />
      {/* Covers the whole first screen so tiles can fly anywhere; the clump rests on the box below */}
      <AppMagnetLoader />
      <div ref={ref} className="relative z-10 flex flex-1 items-center">
        <Container className="grid items-center gap-8 py-14 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:py-10">
          <motion.div style={{ y: textY, opacity: fade }}>
            <FadeIn delay={0.1}>
              <Eyebrow>{site.eyebrow}</Eyebrow>
            </FadeIn>
            <h1 className="mt-4 text-5xl font-bold tracking-tighter sm:text-6xl lg:text-[clamp(3.25rem,min(5.4vw,9svh),5.75rem)] lg:leading-[1.02]">
              <WordsReveal text={site.title} delay={0.2} />
              <WordsReveal text={site.titleAccent} wordClassName="text-ice-gradient" delay={0.45} />
            </h1>
            <FadeIn delay={0.75}>
              <p className="mt-6 max-w-xl text-lg text-muted text-pretty">{site.description}</p>
            </FadeIn>
            <FadeIn delay={0.9}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button href="#products">Explore products</Button>
                <Button href="/contact" variant="secondary">
                  Become a partner
                </Button>
              </div>
            </FadeIn>
          </motion.div>

          {/* Our apps and blocks of ice, magnetised together; the pointer pushes them apart */}
          <motion.div style={{ y: sceneY, scale: sceneScale }}>
            <div data-magnet-anchor className="relative mx-auto aspect-square w-full max-w-[600px] lg:max-w-[min(600px,calc(100svh-15rem))]" />
          </motion.div>
        </Container>
      </div>

      <div className="relative z-10 bg-ink text-white">
        <Stagger className="mx-auto grid w-full max-w-7xl grid-cols-2 px-4 sm:px-6 lg:grid-cols-4 lg:px-8" stagger={0.1}>
          {principles.map((p) => (
            <StaggerItem key={p.label} className="border-white/10 py-4 pr-4 lg:border-l lg:py-5 lg:pl-6 lg:first:border-l-0 lg:first:pl-0">
              <p className="text-sm font-semibold tracking-tight">{p.label}</p>
              <p className="mt-0.5 text-xs text-white/55">{p.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { motion, useScroll, useSpring } from "motion/react";
import { useEffect } from "react";

const HEADER_OFFSET = -64;

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.09, anchors: { offset: HEADER_OFFSET } });
    return () => lenis.destroy();
  }, []);

  return null;
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left"
      style={{ scaleX, background: "linear-gradient(90deg, var(--ice-1), var(--ice-2), var(--ice-3))" }}
      aria-hidden
    />
  );
}

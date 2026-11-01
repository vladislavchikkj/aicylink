"use client";

import Lenis from "lenis";
import Snap from "lenis/snap";
import "lenis/dist/lenis.css";
import { motion, useScroll, useSpring } from "motion/react";
import { useEffect } from "react";

const HEADER_OFFSET = -64;

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.14, anchors: { offset: HEADER_OFFSET } });

    // On laptops and desktops, scrolling settles at the start of the nearest home-page chapter
    // (just below the header) so nothing important is skimmed past.
    let snap: Snap | null = null;
    let observer: ResizeObserver | null = null;
    if (window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches && document.querySelector("[data-chapter]")) {
      const s = new Snap(lenis, { type: "proximity", distanceThreshold: "35%", duration: 0.9, debounce: 220 });
      snap = s;
      let removers: (() => void)[] = [];
      const place = () => {
        removers.forEach((remove) => remove());
        removers = [...document.querySelectorAll<HTMLElement>("[data-chapter]")].map((el) =>
          s.add(Math.max(0, el.getBoundingClientRect().top + window.scrollY + HEADER_OFFSET)),
        );
      };
      place();
      observer = new ResizeObserver(place);
      observer.observe(document.body);
    }

    return () => {
      observer?.disconnect();
      snap?.destroy();
      lenis.destroy();
    };
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

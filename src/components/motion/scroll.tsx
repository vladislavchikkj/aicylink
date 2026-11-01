"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

function Word({ progress, range, children }: { progress: MotionValue<number>; range: [number, number]; children: string }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}

/** Text whose words light up one by one as it scrolls into view. */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.95", "start 0.55"] });
  const words = text.split(" ");

  if (reduce) return <span className={className}>{text}</span>;
  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {word}
        </Word>
      ))}
    </span>
  );
}

/** Large block that rises and grows to full size in step with the scroll. */
export function ScrollRise({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.45"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [70, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0.35, 1]);

  return (
    <motion.div ref={ref} className={className} style={reduce ? undefined : { scale, y, opacity }}>
      {children}
    </motion.div>
  );
}

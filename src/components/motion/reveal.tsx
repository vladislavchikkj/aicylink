"use client";

import { motion, type TargetAndTransition, type Variants } from "motion/react";

export type From = "up" | "down" | "left" | "right" | "scale" | "tilt";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const hidden: Record<From, TargetAndTransition> = {
  up: { y: 56 },
  down: { y: -56 },
  left: { x: -72 },
  right: { x: 72 },
  scale: { scale: 0.9 },
  tilt: { y: 80, rotateX: -28, scale: 0.96 },
};

const shown: TargetAndTransition = { opacity: 1, x: 0, y: 0, scale: 1, rotateX: 0, filter: "blur(0px)" };

function hiddenState(from: From): TargetAndTransition {
  return { opacity: 0, filter: "blur(10px)", ...hidden[from] };
}

type RevealProps = {
  children: React.ReactNode;
  from?: From;
  delay?: number;
  duration?: number;
  className?: string;
};

/** Animates a block into view once, sliding in from the given side. */
export function Reveal({ children, from = "up", delay = 0, duration = 1, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={hiddenState(from)}
      whileInView={shown}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  style?: React.CSSProperties;
};

/** Container that reveals its <StaggerItem> children one after another. */
export function Stagger({ children, className, stagger = 0.12, delay = 0, style }: StaggerProps) {
  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  return (
    <motion.div
      className={className}
      style={style}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = {
  children: React.ReactNode;
  from?: From;
  className?: string;
  style?: React.CSSProperties;
};

export function StaggerItem({ children, from = "up", className, style }: StaggerItemProps) {
  const variants: Variants = {
    hidden: hiddenState(from),
    show: { ...shown, transition: { duration: 1, ease: EASE_OUT } },
  };
  return (
    <motion.div className={className} style={style} variants={variants}>
      {children}
    </motion.div>
  );
}

/** Splits text into words that rise out of a mask one by one. */
export function WordsReveal({
  text,
  className,
  wordClassName,
  delay = 0,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
}) {
  return (
    <span className={className}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-top">
          <motion.span
            className={`inline-block ${wordClassName ?? ""}`}
            initial={{ y: "110%", rotate: 4 }}
            animate={{ y: "0%", rotate: 0 }}
            transition={{ duration: 1.1, delay: delay + i * 0.07, ease: EASE_OUT }}
          >
            {word}
          </motion.span>
          {" "}
        </span>
      ))}
    </span>
  );
}

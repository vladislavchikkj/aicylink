"use client";

import { MotionConfig } from "motion/react";
import { ScrollProgress, SmoothScroll } from "./smooth-scroll";

export function MotionProviders({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <ScrollProgress />
      {children}
    </MotionConfig>
  );
}

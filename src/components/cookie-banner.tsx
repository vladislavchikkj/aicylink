"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EASE_OUT } from "./motion/reveal";

const STORAGE_KEY = "aicylink-cookie-consent";

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {}
    if (stored) return;
    const timer = setTimeout(() => setOpen(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const choose = (value: "accepted" | "declined") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {}
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-label="Cookie preferences"
          className="fixed inset-x-4 bottom-4 z-[70] max-w-md rounded-2xl border border-border bg-white p-5 shadow-[0_24px_60px_-20px_rgba(10,10,10,0.35)] sm:left-6 sm:right-auto sm:bottom-6"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          <p className="text-sm font-semibold">We value your privacy</p>
          <p className="mt-1.5 text-sm text-muted">
            We use essential cookies to run this site and, with your consent, analytics to improve it. Read our{" "}
            <Link href="/legal/privacy" className="font-medium text-foreground underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => choose("accepted")}
              className="h-9 flex-1 rounded-lg bg-ink text-sm font-semibold text-white transition-colors hover:bg-ink/80"
            >
              Accept all
            </button>
            <button
              onClick={() => choose("declined")}
              className="h-9 flex-1 rounded-lg border border-border text-sm font-semibold transition-colors hover:border-foreground/40"
            >
              Essential only
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

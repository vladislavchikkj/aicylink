"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { site, type AppId } from "@/content/site";
import { EASE_OUT } from "./motion/reveal";

type Status = "idle" | "sending" | "joined" | "error";

export function WaitlistForm({ app, appName, dark = false }: { app: AppId; appName: string; dark?: boolean }) {
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), website: data.get("website"), consent: data.get("consent") === "on", app }),
      });
      setStatus(res.ok ? "joined" : "error");
    } catch {
      setStatus("error");
    }
  };

  const muted = dark ? "text-white/60" : "text-muted";

  return (
    <AnimatePresence mode="wait">
      {status === "joined" ? (
        <motion.p
          key="joined"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className={`rounded-xl px-4 py-3 text-sm font-medium ${dark ? "bg-white/10 text-white" : "bg-emerald-50 text-emerald-800"}`}
        >
          ✓ You&apos;re on the list. We&apos;ll email you when {appName} opens for early access.
        </motion.p>
      ) : (
        <motion.form key="form" onSubmit={onSubmit} exit={{ opacity: 0 }} className="w-full max-w-md">
          <div className={`flex gap-2 rounded-xl p-1.5 ${dark ? "bg-white/10" : "border border-border bg-white shadow-sm"}`}>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              aria-label="Email address"
              className={`min-w-0 flex-1 bg-transparent px-3 text-sm outline-none ${dark ? "text-white placeholder:text-white/40" : "placeholder:text-subtle"}`}
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className={`h-10 shrink-0 rounded-lg px-4 text-sm font-semibold transition-opacity hover:opacity-85 disabled:opacity-60 ${
                dark ? "bg-white text-ink" : "bg-ink text-white"
              }`}
            >
              {status === "sending" ? "Joining…" : "Join waitlist"}
            </button>
          </div>
          <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          <label className={`mt-3 flex items-start gap-2 text-xs ${muted}`}>
            <input name="consent" type="checkbox" required className="mt-0.5 accent-current" />
            <span>
              Email me about {appName} early access. Unsubscribe anytime — see our{" "}
              <Link href="/legal/privacy" className="underline underline-offset-2">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {status === "error" && (
            <p className={`mt-3 text-xs ${dark ? "text-rose-300" : "text-rose-600"}`}>
              Couldn&apos;t join right now — email{" "}
              <a href={`mailto:${site.email}?subject=${encodeURIComponent(`${appName} early access`)}`} className="font-semibold underline">
                {site.email}
              </a>{" "}
              and we&apos;ll add you.
            </p>
          )}
        </motion.form>
      )}
    </AnimatePresence>
  );
}

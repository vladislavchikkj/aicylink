"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { contactTopics, site, type ContactTopic } from "@/content/site";
import { EASE_OUT } from "./motion/reveal";

type Status = "idle" | "sent";

const inputClass =
  "mt-2 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm outline-none transition-shadow placeholder:text-subtle focus:border-ice-1 focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--ice-1)_15%,transparent)]";

export function ContactForm({ initialTopic }: { initialTopic: ContactTopic }) {
  const [topic, setTopic] = useState<ContactTopic>(initialTopic);
  const [status, setStatus] = useState<Status>("idle");

  // No backend: compose the message and hand it to the visitor's mail app.
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const field = (key: string) => String(data.get(key) ?? "").trim();
    const label = contactTopics.find((t) => t.id === topic)?.label ?? "Inquiry";
    const company = field("company");
    const subject = `[${label}] ${field("name")}${company ? ` — ${company}` : ""}`;
    const body = [field("message"), "", "—", field("name"), field("email"), company].filter((line, i) => i < 3 || line).join("\n");
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("sent");
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-[0_30px_80px_-40px_rgba(10,10,10,0.3)] sm:p-10">
      <AnimatePresence mode="wait">
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="flex min-h-[420px] flex-col items-center justify-center text-center"
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <motion.path d="M5 12.5 10 17 19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.2 }} />
              </svg>
            </span>
            <h2 className="mt-6 text-2xl font-bold tracking-tight">Almost there.</h2>
            <p className="mt-2 max-w-sm text-muted">
              Your email app should open with the message ready — just hit send. If it didn&apos;t, write to us at{" "}
              <a href={`mailto:${site.email}`} className="font-semibold text-foreground underline underline-offset-2">
                {site.email}
              </a>
              .
            </p>
            <button type="button" onClick={() => setStatus("idle")} className="mt-6 text-sm font-semibold text-muted hover:text-foreground">
              ← Back to the form
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <fieldset>
              <legend className="text-sm font-semibold">What can we help with?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {contactTopics.map((t) => (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setTopic(t.id)}
                    aria-pressed={topic === t.id}
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      topic === t.id ? "border-ink bg-ink text-white" : "border-border hover:border-foreground/40"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block text-sm font-semibold">
                Full name
                <input name="name" required autoComplete="name" className={inputClass} placeholder="Jane Cooper" />
              </label>
              <label className="block text-sm font-semibold">
                Work email
                <input name="email" type="email" required autoComplete="email" className={inputClass} placeholder="jane@company.com" />
              </label>
            </div>
            <label className="block text-sm font-semibold">
              Company <span className="font-normal text-subtle">(optional)</span>
              <input name="company" autoComplete="organization" className={inputClass} placeholder="Company name" />
            </label>
            <label className="block text-sm font-semibold">
              Message
              <textarea name="message" required minLength={10} rows={5} className={`${inputClass} resize-y`} placeholder="Tell us a bit about what you have in mind…" />
            </label>

            <div className="flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:items-center">
              <p className="text-xs text-subtle">
                Opens your email app · see our{" "}
                <a href="/legal/privacy" className="underline underline-offset-2">
                  Privacy Policy
                </a>
                .
              </p>
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-ink px-6 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-ink/80"
              >
                Write email →
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { EASE_OUT, Reveal } from "./motion/reveal";

// Product screens rendered in HTML so they stay crisp at any size.
// `preview` marks concepts of apps that are still in development.
const screens = [
  { id: "lummie", name: "Lummie", url: "lummie.app", color: "var(--ice-1)", preview: false },
  { id: "snap", name: "Aicy Snap", url: "Aicy Snap · concept preview", color: "var(--ice-2)", preview: true },
  { id: "stars", name: "Aicy Stars", url: "Aicy Stars · concept preview", color: "var(--ice-3)", preview: true },
] as const;

type ScreenId = (typeof screens)[number]["id"];

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: EASE_OUT },
});

function LummieScreen() {
  return (
    <div className="mx-auto flex min-h-[340px] max-w-2xl flex-col justify-center gap-3 p-4 sm:p-8">
      <motion.p {...rise(0.1)} className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-sm text-white">
        Help me plan a cozy weekend in Lisbon
      </motion.p>
      <motion.div {...rise(0.5)} className="max-w-[85%] rounded-2xl rounded-bl-md border border-border bg-surface px-4 py-3 text-sm">
        <p className="font-semibold">Here&apos;s a relaxed plan ✨</p>
        <ul className="mt-2 space-y-1 text-muted">
          <li>Sat — Alfama walk, pastéis at sunset in Graça</li>
          <li>Sun — LX Factory brunch, tram 28 back to the centre</li>
        </ul>
      </motion.div>
      <motion.div {...rise(0.9)} className="mt-4 flex items-center gap-3 rounded-full border border-border bg-white px-4 py-2.5">
        <span className="flex-1 text-sm text-subtle">Ask anything or start talking…</span>
        <span className="flex h-6 items-center gap-0.5" aria-hidden>
          {[0.5, 0.9, 0.6, 1, 0.7, 0.4, 0.8].map((h, i) => (
            <motion.span
              key={i}
              className="w-1 rounded-full bg-ice-1"
              animate={{ height: [`${h * 40}%`, `${h * 100}%`, `${h * 40}%`] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
            />
          ))}
        </span>
      </motion.div>
    </div>
  );
}

const macros = [
  { label: "Protein", value: "24 g", share: 0.62, color: "var(--ice-1)" },
  { label: "Carbs", value: "38 g", share: 0.48, color: "var(--ice-2)" },
  { label: "Fat", value: "21 g", share: 0.35, color: "var(--ice-3)" },
];

function SnapScreen() {
  return (
    <div className="grid min-h-[340px] items-center gap-4 p-4 sm:grid-cols-[1fr_1.2fr] sm:p-8">
      <motion.div
        {...rise(0.1)}
        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-[radial-gradient(circle_at_40%_40%,#fde68a,#f59e0b_45%,#78350f)]"
      >
        <span className="text-6xl" aria-hidden>
          🥑
        </span>
        <motion.span
          className="absolute inset-x-6 h-0.5 bg-white/90 shadow-[0_0_12px_white]"
          initial={{ top: "10%" }}
          animate={{ top: ["10%", "90%", "10%"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
      </motion.div>
      <div>
        <motion.p {...rise(0.3)} className="text-xs text-subtle">
          Detected
        </motion.p>
        <motion.p {...rise(0.35)} className="text-xl font-bold tracking-tight">
          Avocado toast with eggs
        </motion.p>
        <motion.p {...rise(0.45)} className="mt-1 text-3xl font-bold tracking-tight text-ice-2">
          ~ 450 kcal
        </motion.p>
        <div className="mt-5 space-y-3">
          {macros.map((m, i) => (
            <div key={m.label}>
              <div className="flex justify-between text-xs">
                <span className="font-medium">{m.label}</span>
                <span className="text-muted">{m.value}</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: m.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${m.share * 100}%` }}
                  transition={{ duration: 1, delay: 0.6 + i * 0.12, ease: EASE_OUT }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const cards = [
  { name: "The Star", symbol: "✦" },
  { name: "The Sun", symbol: "☀" },
  { name: "The Moon", symbol: "☾" },
];

function StarsScreen() {
  return (
    <div className="grid min-h-[340px] items-center gap-6 bg-[#0b0820] p-4 text-white sm:grid-cols-[1.1fr_1fr] sm:p-8">
      <div>
        <motion.p {...rise(0.1)} className="font-mono text-xs uppercase tracking-widest text-white/50">
          Today · Leo ♌
        </motion.p>
        <motion.p {...rise(0.2)} className="mt-3 text-xl font-bold tracking-tight">
          A bold idea finds its moment.
        </motion.p>
        <motion.p {...rise(0.3)} className="mt-2 text-sm text-white/65">
          Your energy is high and people are listening — a good day to start something you&apos;ve been putting off.
        </motion.p>
        <motion.div {...rise(0.4)} className="mt-5 flex gap-2 text-xs">
          {["Love 82%", "Career 91%", "Mood 76%"].map((t) => (
            <span key={t} className="rounded-full border border-white/15 px-2.5 py-1 text-white/80">
              {t}
            </span>
          ))}
        </motion.div>
      </div>
      <div className="flex items-center justify-center gap-3" style={{ perspective: 800 }}>
        {cards.map((c, i) => (
          <motion.div
            key={c.name}
            className="flex aspect-[2/3] w-20 flex-col items-center justify-between rounded-lg border border-white/20 bg-gradient-to-b from-[#2a1f5c] to-[#120d2e] p-2 sm:w-24"
            initial={{ rotateY: 180, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.3 + i * 0.2, ease: EASE_OUT }}
          >
            <span className="text-[9px] uppercase tracking-widest text-white/50">{i + 1}</span>
            <span className="text-3xl text-[#c4b5fd]">{c.symbol}</span>
            <span className="text-[10px] font-semibold">{c.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const views: Record<ScreenId, () => React.JSX.Element> = { lummie: LummieScreen, snap: SnapScreen, stars: StarsScreen };

function Screen({ id }: { id: ScreenId }) {
  const View = views[id];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <View />
    </motion.div>
  );
}

export function ProductShowcase() {
  const [active, setActive] = useState(0);
  const screen = screens[active];

  return (
    <Reveal from="up" className="mt-16" duration={1.2}>
      <div className="flex flex-wrap justify-center gap-2" role="tablist">
        {screens.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              i === active ? "text-white" : "text-muted hover:text-foreground"
            }`}
          >
            {i === active && (
              <motion.span layoutId="showcase-tab" className="absolute inset-0 rounded-full bg-ink" transition={{ duration: 0.4, ease: EASE_OUT }} />
            )}
            <span className="relative">
              {s.name}
              {s.preview && <span className="ml-1.5 font-mono text-[10px] uppercase opacity-60">soon</span>}
            </span>
          </button>
        ))}
      </div>

      <div className="relative mx-auto mt-8 max-w-5xl">
        <div className="ice-glow absolute -inset-10 rounded-[48px] opacity-80 blur-2xl" aria-hidden />
        <div className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-[0_40px_100px_-40px_rgba(10,10,10,0.35)]">
          <div className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3">
            <div className="flex gap-1.5" aria-hidden>
              <span className="size-3 rounded-full bg-[#ff5f57]" />
              <span className="size-3 rounded-full bg-[#febc2e]" />
              <span className="size-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="mx-auto flex min-w-0 items-center gap-2 rounded-md border border-border bg-white px-3 py-1 font-mono text-xs text-muted">
              <svg viewBox="0 0 12 12" className="size-3 shrink-0" aria-hidden>
                <path d="M3.5 5V3.5a2.5 2.5 0 0 1 5 0V5M2.5 5h7v5h-7z" fill="none" stroke="currentColor" />
              </svg>
              <span className="truncate">{screen.url}</span>
            </div>
            <span className="w-[54px]" aria-hidden />
          </div>
          <AnimatePresence mode="wait">
            <Screen key={screen.id} id={screen.id} />
          </AnimatePresence>
        </div>
      </div>
    </Reveal>
  );
}

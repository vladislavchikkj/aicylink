"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { EASE_OUT, Reveal } from "./motion/reveal";

// DEMO product screens rendered in HTML so they stay crisp at any size.
const screens = [
  {
    id: "pulse",
    name: "Aicy Pulse",
    url: "pulse.aicylink.com/overview",
    color: "var(--ice-1)",
    kpis: [
      { label: "Active users", value: "184,209", delta: "+12.4%" },
      { label: "Conversion", value: "6.8%", delta: "+0.9%" },
      { label: "Revenue", value: "$412K", delta: "+18.1%" },
    ],
    series: [30, 42, 38, 55, 48, 62, 58, 74, 69, 83, 79, 95],
    list: ["Onboarding v3", "Paywall test B", "Push campaign", "Referral flow"],
  },
  {
    id: "edge",
    name: "Aicy Edge",
    url: "edge.aicylink.com/regions",
    color: "var(--ice-2)",
    kpis: [
      { label: "Requests / day", value: "1.2B", delta: "+8.2%" },
      { label: "p95 latency", value: "38 ms", delta: "−11%" },
      { label: "Uptime", value: "99.99%", delta: "30d" },
    ],
    series: [60, 58, 63, 61, 66, 64, 70, 68, 72, 71, 76, 78],
    list: ["Frankfurt", "Singapore", "São Paulo", "Virginia"],
  },
  {
    id: "flow",
    name: "Aicy Flow",
    url: "flow.aicylink.com/funnels",
    color: "var(--ice-3)",
    kpis: [
      { label: "Funnel starts", value: "92,410", delta: "+21%" },
      { label: "Completion", value: "64.2%", delta: "+5.3%" },
      { label: "Trials", value: "11,820", delta: "+14%" },
    ],
    series: [90, 82, 76, 71, 66, 60, 57, 53, 50, 48, 46, 44],
    list: ["Welcome", "Goals quiz", "Social proof", "Paywall"],
  },
];

function chartPath(series: number[], w = 600, h = 180) {
  const step = w / (series.length - 1);
  const points = series.map((v, i) => [i * step, h - (v / 100) * h] as const);
  const line = points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return { line, area: `${line} L${w} ${h} L0 ${h} Z` };
}

function Screen({ screen }: { screen: (typeof screens)[number] }) {
  const { line, area } = chartPath(screen.series);
  const gradientId = `fill-${screen.id}`;

  return (
    <motion.div
      key={screen.id}
      initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className="grid gap-4 p-4 sm:grid-cols-[160px_1fr] sm:p-6"
    >
      <aside className="hidden flex-col gap-1 text-sm sm:flex">
        <span className="mb-3 flex items-center gap-2 font-semibold">
          <span className="size-2.5 rounded-full" style={{ background: screen.color }} />
          {screen.name}
        </span>
        {["Overview", "Reports", "Audiences", "Settings"].map((item, i) => (
          <span key={item} className={`rounded-md px-2 py-1.5 ${i === 0 ? "bg-surface font-medium" : "text-muted"}`}>
            {item}
          </span>
        ))}
      </aside>

      <div className="min-w-0">
        <div className="grid grid-cols-3 gap-3">
          {screen.kpis.map((k) => (
            <div key={k.label} className="rounded-xl border border-border p-3">
              <p className="truncate text-[11px] text-subtle">{k.label}</p>
              <p className="mt-1 text-base font-bold tracking-tight sm:text-xl">{k.value}</p>
              <p className="text-[11px] font-medium text-emerald-600">{k.delta}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-xl border border-border p-3">
          <svg viewBox="0 0 600 180" className="h-36 w-full sm:h-44" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={screen.color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={screen.color} stopOpacity="0" />
              </linearGradient>
            </defs>
            {[45, 90, 135].map((y) => (
              <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="var(--border)" strokeDasharray="4 6" />
            ))}
            <motion.path
              d={area}
              fill={`url(#${gradientId})`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            />
            <motion.path
              d={line}
              fill="none"
              stroke={screen.color}
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, ease: EASE_OUT }}
            />
          </svg>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {screen.list.map((item, i) => (
            <div key={item} className="rounded-lg bg-surface px-3 py-2">
              <p className="truncate text-xs font-medium">{item}</p>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-border">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: screen.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${90 - i * 17}%` }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: EASE_OUT }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
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
            <span className="relative">{s.name}</span>
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
            <Screen key={screen.id} screen={screen} />
          </AnimatePresence>
        </div>
      </div>
    </Reveal>
  );
}

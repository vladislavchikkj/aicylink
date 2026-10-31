"use client";

import { motion } from "motion/react";
import { Orbitron } from "next/font/google";
import { useEffect, useState } from "react";
import type { AppId } from "@/content/site";
import { LummieMark } from "./app-icon";
import { EASE_OUT } from "./motion/reveal";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["500"] });

// Fixed star positions so server and client render the same sky.
const stars = Array.from({ length: 70 }, (_, i) => ({
  left: (i * 37.7) % 100,
  top: (i * 61.3) % 100,
  size: i % 7 === 0 ? 2 : 1,
  delay: (i % 10) * 0.4,
}));

const prompts = ["Plan a cozy weekend in Lisbon", "Draw a fox astronaut in watercolor", "Build a landing page for my café"];

function Typewriter() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    const full = prompts[index];
    if (text.length < full.length) {
      const t = setTimeout(() => setText(full.slice(0, text.length + 1)), 45);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setText("");
      setIndex((index + 1) % prompts.length);
    }, 2200);
    return () => clearTimeout(t);
  }, [text, index]);

  return (
    <span className="truncate text-white/85">
      {text}
      <span className="ml-px inline-block h-4 w-px translate-y-0.5 animate-pulse bg-white/80" />
    </span>
  );
}

const chips = ["DeepSearch", "Imagine", "App", "Hints"];

export function LummieWindow() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/80 bg-[#0b0b0d] shadow-[0_50px_120px_-40px_rgba(10,10,10,0.6)]">
      <div className="flex items-center gap-3 border-b border-white/10 bg-[#131316] px-4 py-3">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="mx-auto rounded-md bg-white/5 px-3 py-1 font-mono text-xs text-white/50">lummie.app</span>
        <span className="w-[54px]" aria-hidden />
      </div>

      <div className="relative flex min-h-[420px] sm:min-h-[460px]">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {stars.map((s, i) => (
            <span
              key={i}
              className="absolute animate-pulse rounded-full bg-white"
              style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, opacity: 0.5, animationDelay: `${s.delay}s`, animationDuration: "3s" }}
            />
          ))}
        </div>

        <aside className="relative hidden w-12 shrink-0 flex-col items-center gap-5 border-r border-white/10 py-4 text-white/60 sm:flex" aria-hidden>
          <LummieMark className="size-5 text-white" />
          {["M11 19a8 8 0 1 1 5.3-2L21 21", "M4 5h16v11H8l-4 4Z", "M4 4h7v7H4zM13 6h7M13 10h7M4 15h16M4 19h16", "M4 5h16v14H4zM8 15l3-3 3 3 2-2 4 4"].map((d) => (
            <svg key={d} viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d={d} />
            </svg>
          ))}
        </aside>

        <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE_OUT }}
          >
            <LummieMark className="mx-auto size-12 text-[#d9d9d9]" />
            <p className={`${orbitron.className} mt-4 text-4xl text-white sm:text-5xl`}>Lummie</p>
            <p className="mt-3 text-sm text-white/70">Your all-in-one AI companion for chatting, creating art, and building.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: EASE_OUT }}
            className="mt-8 flex w-full max-w-xl items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] py-2 pl-5 pr-2 text-left text-sm"
          >
            <Typewriter />
            <span className="ml-auto hidden shrink-0 text-xs text-white/50 sm:inline">⚡ Fast</span>
            <span className="flex size-9 shrink-0 items-center justify-center gap-0.5 rounded-full bg-white" aria-hidden>
              {[0.5, 1, 0.7, 0.9, 0.5].map((h, i) => (
                <motion.span
                  key={i}
                  className="w-0.5 rounded-full bg-black"
                  animate={{ height: [h * 6, h * 14, h * 6] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
                />
              ))}
            </span>
          </motion.div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {chips.map((c) => (
              <span key={c} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/75">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Concept screens for apps in development ---------- */

function SnapScreen() {
  const meals = [
    { emoji: "🥑", name: "Avocado toast", kcal: 420 },
    { emoji: "🥗", name: "Chicken salad", kcal: 510 },
    { emoji: "🍓", name: "Greek yogurt", kcal: 190 },
  ];
  return (
    <div className="flex h-full flex-col bg-[#f3fbf7] px-4 pb-4 pt-10">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-700/70">Today</p>
      <div className="relative mx-auto mt-3 size-32 shrink-0">
        <svg viewBox="0 0 120 120" className="size-full -rotate-90">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#d1fae5" strokeWidth="11" />
          <motion.circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="url(#snap-ring)"
            strokeWidth="11"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 0.62 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: EASE_OUT }}
          />
          <defs>
            <linearGradient id="snap-ring">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tracking-tight text-emerald-950">1,120</span>
          <span className="text-[10px] text-emerald-900/60">of 1,800 kcal</span>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {meals.map((m) => (
          <div key={m.name} className="flex items-center gap-2.5 rounded-xl bg-white p-2 shadow-sm">
            <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-base">{m.emoji}</span>
            <span className="flex-1 text-[11px] font-semibold text-emerald-950">{m.name}</span>
            <span className="text-[10px] text-emerald-900/60">{m.kcal}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto flex justify-center pt-3">
        <span className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-lg">
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function GlowScreen() {
  const plan = ["Vitamin C serum", "2L water", "SPF 50 before 11am", "Curtain bangs?"];
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#fff1f2] to-[#fff7ed] px-4 pb-4 pt-10">
      <div className="relative mx-auto mt-1 flex size-32 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-rose-200 via-orange-100 to-amber-200">
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full text-rose-400/70">
          {Array.from({ length: 24 }, (_, i) => (
            <circle key={i} cx={20 + (i % 6) * 12} cy={22 + Math.floor(i / 6) * 16} r="1.4" fill="currentColor" />
          ))}
        </svg>
        <motion.span
          className="absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-white/70 to-transparent"
          animate={{ top: ["-20%", "100%"] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-widest text-rose-500/80">Glow score</p>
      <p className="text-center text-3xl font-bold tracking-tight text-rose-950">8.4</p>
      <div className="mt-3 space-y-1.5">
        {plan.map((p, i) => (
          <div key={p} className="flex items-center gap-2 rounded-lg bg-white/80 px-2.5 py-2 text-[11px] font-medium text-rose-950">
            <span className={`flex size-4 items-center justify-center rounded-full ${i < 2 ? "bg-rose-500 text-white" : "border border-rose-300"}`}>
              {i < 2 && "✓"}
            </span>
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}

function StarsScreen() {
  const signs = "♈♉♊♋♌♍♎♏♐♑♒♓".split("");
  return (
    <div className="flex h-full flex-col bg-[#0b0820] px-4 pb-4 pt-10 text-white">
      <div className="relative mx-auto size-36 shrink-0">
        <motion.svg viewBox="0 0 120 120" className="size-full" animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
          <circle cx="60" cy="60" r="56" fill="none" stroke="rgba(196,181,253,0.35)" />
          <circle cx="60" cy="60" r="40" fill="none" stroke="rgba(196,181,253,0.2)" />
          {signs.map((s, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <text key={s} x={60 + Math.cos(a) * 48} y={60 + Math.sin(a) * 48 + 3} textAnchor="middle" fontSize="8" fill="#c4b5fd">
                {`${s}\uFE0E`}
              </text>
            );
          })}
        </motion.svg>
        <span className="absolute inset-0 flex items-center justify-center text-3xl">♌</span>
      </div>
      <p className="mt-3 text-center text-[10px] uppercase tracking-widest text-white/50">Today · Leo</p>
      <p className="mt-1 text-center text-sm font-semibold">A bold idea finds its moment.</p>
      <div className="mt-4 flex justify-center gap-2" style={{ perspective: 600 }}>
        {["✦", "☀", "☾"].map((s, i) => (
          <motion.span
            key={s}
            className="flex h-16 w-11 items-center justify-center rounded-md border border-white/20 bg-gradient-to-b from-[#2a1f5c] to-[#120d2e] text-lg text-[#c4b5fd]"
            initial={{ rotateY: 180, opacity: 0 }}
            whileInView={{ rotateY: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.4 + i * 0.2, ease: EASE_OUT }}
          >
            {s}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function MoveScreen() {
  const moves = [
    { name: "Wall bridge", time: "0:45" },
    { name: "Leg slides", time: "1:00" },
    { name: "Somatic breathing", time: "2:00" },
  ];
  return (
    <div className="flex h-full flex-col bg-[#fff7ed] px-4 pb-4 pt-10">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-orange-600/80">Day 12 of 28</p>
      <p className="mt-1 text-lg font-bold leading-tight tracking-tight text-orange-950">Wall Pilates · Core</p>
      <div className="relative mt-3 flex h-28 shrink-0 items-end justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500">
        <motion.svg
          viewBox="0 0 120 70"
          className="w-36 text-white"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <line x1="104" y1="0" x2="104" y2="70" stroke="currentColor" strokeOpacity="0.4" strokeWidth="3" />
          <circle cx="22" cy="56" r="6" fill="currentColor" />
          <path d="M30 58 Q55 30 80 40 L102 22 M80 40 L100 46" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        </motion.svg>
      </div>
      <div className="mt-3 space-y-1.5">
        {moves.map((m, i) => (
          <div key={m.name} className="flex items-center justify-between rounded-lg bg-white px-2.5 py-2 text-[11px] shadow-sm">
            <span className="font-semibold text-orange-950">{m.name}</span>
            <span className={i === 0 ? "font-semibold text-orange-600" : "text-orange-900/50"}>{m.time}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto h-1.5 overflow-hidden rounded-full bg-orange-100">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-orange-400 to-rose-500"
          initial={{ width: 0 }}
          whileInView={{ width: "43%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE_OUT }}
        />
      </div>
    </div>
  );
}

export function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto aspect-[9/19] w-full max-w-[240px] rounded-[2.4rem] bg-[#111] p-2 shadow-[0_40px_80px_-30px_rgba(10,10,10,0.55),inset_0_0_0_1px_rgba(255,255,255,0.08)]">
      <div className="relative h-full overflow-hidden rounded-[1.9rem]">
        <span className="absolute left-1/2 top-2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-black" aria-hidden />
        {children}
      </div>
    </div>
  );
}


function CvScreen() {
  const matches = [
    { label: "Keywords", value: 92 },
    { label: "Experience", value: 81 },
    { label: "Tone", value: 88 },
  ];
  return (
    <div className="flex h-full flex-col bg-[#eff6ff] px-4 pb-4 pt-10">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-700/70">Tailored for</p>
      <p className="mt-1 text-sm font-bold leading-tight text-blue-950">Senior Product Designer · Spotify</p>
      <div className="relative mx-auto mt-4 size-28 shrink-0">
        <svg viewBox="0 0 120 120" className="size-full -rotate-90">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#dbeafe" strokeWidth="11" />
          <motion.circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="#2563eb"
            strokeWidth="11"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 0.89 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: EASE_OUT }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tracking-tight text-blue-950">89%</span>
          <span className="text-[10px] text-blue-900/60">match</span>
        </div>
      </div>
      <div className="mt-4 space-y-2.5">
        {matches.map((m, i) => (
          <div key={m.label}>
            <div className="flex justify-between text-[11px]">
              <span className="font-medium text-blue-950">{m.label}</span>
              <span className="text-blue-900/60">{m.value}%</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-blue-100">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-600"
                initial={{ width: 0 }}
                whileInView={{ width: `${m.value}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4 + i * 0.12, ease: EASE_OUT }}
              />
            </div>
          </div>
        ))}
      </div>
      <span className="mt-auto rounded-xl bg-blue-600 py-2.5 text-center text-[11px] font-semibold text-white shadow-lg">Export PDF</span>
    </div>
  );
}

function LearnScreen() {
  const options = ["A neural network", "A spreadsheet macro", "A search engine"];
  return (
    <div className="flex h-full flex-col bg-[#eef2ff] px-4 pb-4 pt-10">
      <div className="flex items-center justify-between text-[10px] font-semibold">
        <span className="uppercase tracking-widest text-indigo-700/70">AI basics · 3/5</span>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">🔥 12</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-indigo-100">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
          initial={{ width: 0 }}
          whileInView={{ width: "60%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE_OUT }}
        />
      </div>
      <p className="mt-5 text-base font-bold leading-snug tracking-tight text-indigo-950">What powers tools like ChatGPT?</p>
      <div className="mt-4 space-y-2">
        {options.map((o, i) => (
          <motion.div
            key={o}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: EASE_OUT }}
            className={`rounded-xl px-3 py-2.5 text-[11px] font-semibold ${
              i === 0 ? "bg-emerald-500 text-white shadow-md" : "bg-white text-indigo-950 shadow-sm"
            }`}
          >
            {i === 0 && "✓ "}
            {o}
          </motion.div>
        ))}
      </div>
      <span className="mt-auto rounded-xl bg-indigo-600 py-2.5 text-center text-[11px] font-semibold text-white shadow-lg">Continue</span>
    </div>
  );
}

function DreamsScreen() {
  const tags = ["Flying", "Ocean", "Old house"];
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#312e81] to-[#6d28d9] px-4 pb-4 pt-10 text-white">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60">Last night</p>
      <p className="mt-1 text-sm font-semibold leading-snug">
        &ldquo;I was flying over a calm ocean towards my grandma&apos;s old house…&rdquo;
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span key={t} className="rounded-full bg-white/15 px-2 py-0.5 text-[10px]">
            {t}
          </span>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT }}
        className="mt-4 rounded-2xl bg-white/10 p-3 ring-1 ring-inset ring-white/15"
      >
        <p className="text-[10px] font-semibold uppercase tracking-widest text-violet-200">Interpretation</p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-white/85">
          Flying often reflects a wish for freedom. The calm ocean hints that you feel at peace with a recent change.
        </p>
      </motion.div>
      <div className="mt-auto flex items-center justify-between rounded-xl bg-white/10 px-3 py-2 text-[10px] text-white/70">
        <span>Mood · Peaceful</span>
        <span>🌙 7h 40m</span>
      </div>
    </div>
  );
}

/** Concept screens for every app except Lummie, which has its own window. */
export const appScreens: Record<Exclude<AppId, "lummie">, () => React.JSX.Element> = {
  cv: CvScreen,
  snap: SnapScreen,
  glow: GlowScreen,
  move: MoveScreen,
  learn: LearnScreen,
  stars: StarsScreen,
  dreams: DreamsScreen,
};

/** Picks the concept screen on the client, so server components can render one by id. */
export function AppScreen({ id }: { id: Exclude<AppId, "lummie"> }) {
  const Screen = appScreens[id];
  return <Screen />;
}

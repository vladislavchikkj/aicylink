"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { appHref } from "@/content/apps";
import { categories, type AppId } from "@/content/site";
import { AppIcon, appTheme } from "./app-icon";
import { appScreens, LummieWindow, Phone } from "./app-screens";
import { EASE_OUT, Reveal, Stagger, StaggerItem } from "./motion/reveal";
import { ScrollRise } from "./motion/scroll";
import { StatusBadge } from "./status-badge";
import { SectionHeading } from "./ui";

const concepts: { id: AppId; name: string; tagline: string; Screen: () => React.JSX.Element }[] = [
  { id: "snap", name: "Platey", tagline: "Calories from a photo", Screen: appScreens.snap },
  { id: "glow", name: "Glowie", tagline: "Your glow-up plan", Screen: appScreens.glow },
  { id: "stars", name: "Lunara", tagline: "Astrology & tarot", Screen: appScreens.stars },
  { id: "move", name: "Wallie", tagline: "Wall pilates at home", Screen: appScreens.move },
];

const statusOf = (id: AppId) => categories.flatMap((c) => c.products).find((p) => p.id === id)?.status ?? "early";

export function ProductShowcase() {
  const [hovered, setHovered] = useState<AppId | null>(null);

  return (
    <>
      <Reveal from="up" className="mt-20" duration={1.2}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AppIcon id="lummie" className="size-11" />
            <div>
              <p className="font-semibold">Lummie</p>
              <p className="text-sm text-muted">Our flagship AI companion</p>
            </div>
            <StatusBadge status="flagship" className="ml-2" />
          </div>
          <div className="flex items-center gap-5 text-sm font-semibold">
            <Link href={appHref("lummie")} className="transition-colors hover:text-ice-1">
              Learn more
            </Link>
            <a href="https://lummie.app" target="_blank" rel="noreferrer" className="transition-colors hover:text-ice-1">
              Try Lummie ↗
            </a>
          </div>
        </div>
        <ScrollRise>
          <LummieWindow />
        </ScrollRise>
      </Reveal>

      <div className="mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading index="02" eyebrow="In the lab" title="What we're building next." />
          <Reveal>
            <p className="max-w-sm text-muted">Early concepts of apps in development. Join a waitlist on any app page.</p>
          </Reveal>
        </div>

        {/* Swipeable row on phones, grid from tablets up */}
        <Stagger
          className="-mx-4 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-4 sm:gap-y-10 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden"
          stagger={0.12}
        >
          {concepts.map(({ id, name, tagline, Screen }) => (
            <StaggerItem key={id} from="up" className="w-[230px] shrink-0 snap-center sm:w-auto">
              <Link href={appHref(id)} className="block" onPointerEnter={() => setHovered(id)} onPointerLeave={() => setHovered(null)}>
                <motion.div animate={{ y: hovered === id ? -10 : 0 }} transition={{ duration: 0.5, ease: EASE_OUT }} className="relative">
                  <AnimatePresence>
                    {hovered === id && (
                      <motion.span
                        className="absolute inset-x-6 -bottom-4 top-10 -z-10 rounded-full blur-2xl"
                        style={{ background: appTheme[id].accent }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.35 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </AnimatePresence>
                  <StatusBadge status={statusOf(id)} className="absolute -top-2.5 left-1/2 z-20 -translate-x-1/2 shadow-sm" />
                  <Phone>
                    <Screen />
                  </Phone>
                </motion.div>
                <div className="mx-auto mt-5 flex max-w-[240px] items-center gap-3">
                  <AppIcon id={id} className="size-10" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{name}</p>
                    <p className="truncate text-xs text-muted">{tagline}</p>
                  </div>
                  <span className="ml-auto text-subtle" aria-hidden>
                    →
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </>
  );
}

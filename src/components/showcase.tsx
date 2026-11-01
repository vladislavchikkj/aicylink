"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { appDetails, appHref } from "@/content/apps";
import { categories, type AppId } from "@/content/site";
import { AppIcon, appTheme } from "./app-icon";
import { appScreens, LummieWindow, Phone } from "./app-screens";
import { EASE_OUT, Reveal, Stagger, StaggerItem } from "./motion/reveal";
import { ScrollRise } from "./motion/scroll";
import { StatusBadge } from "./status-badge";
import { Button, Chapter, Container, SectionHeading } from "./ui";

const concepts: { id: AppId; name: string; tagline: string; Screen: () => React.JSX.Element }[] = [
  { id: "snap", name: "Platey", tagline: "Calories from a photo", Screen: appScreens.snap },
  { id: "glow", name: "Glowie", tagline: "Your glow-up plan", Screen: appScreens.glow },
  { id: "stars", name: "Lunara", tagline: "Astrology & tarot", Screen: appScreens.stars },
  { id: "move", name: "Wallie", tagline: "Wall pilates at home", Screen: appScreens.move },
];

const statusOf = (id: AppId) => categories.flatMap((c) => c.products).find((p) => p.id === id)?.status ?? "early";

const lummie = appDetails.lummie;

/** Chapter 02: the flagship, described on the left and live on the right. */
export function Flagship() {
  return (
    <Chapter id="flagship" label="Flagship">
      <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div>
          <SectionHeading index="02" eyebrow="Flagship" title={lummie.headline} text={lummie.intro} />
          <Reveal delay={0.2}>
            <div className="mt-8 flex items-center gap-3">
              <AppIcon id="lummie" className="size-11" />
              <div>
                <p className="font-semibold">Lummie</p>
                <p className="text-sm text-muted">Live since January 2026</p>
              </div>
              <StatusBadge status="flagship" className="ml-2" />
            </div>
          </Reveal>
          <Stagger className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4" stagger={0.08}>
            {lummie.features.map((f) => (
              <StaggerItem key={f.title} from="up">
                <p className="text-sm font-semibold">{f.title}</p>
                <p className="mt-0.5 text-sm text-muted">{f.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button href="https://lummie.app">Try Lummie ↗</Button>
              <Button href={appHref("lummie")} variant="secondary">
                Learn more
              </Button>
            </div>
          </Reveal>
        </div>
        <ScrollRise>
          <LummieWindow />
        </ScrollRise>
      </Container>
    </Chapter>
  );
}

/** Chapter 03: concepts in development. */
export function Lab() {
  const [hovered, setHovered] = useState<AppId | null>(null);

  return (
    <Chapter id="lab" label="In the lab">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading index="03" eyebrow="In the lab" title="What we're building next." />
          <Reveal>
            <p className="max-w-sm text-muted">Early concepts of apps in development. Join a waitlist on any app page.</p>
          </Reveal>
        </div>

        {/* Swipeable row on phones, grid from tablets up; on laptops the phones shrink to fit one screen */}
        <Stagger
          className="-mx-4 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-4 sm:gap-y-10 sm:overflow-visible sm:px-0 sm:pb-0 lg:mt-10 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden"
          stagger={0.12}
        >
          {concepts.map(({ id, name, tagline, Screen }) => (
            <StaggerItem key={id} from="up" className="w-[230px] shrink-0 snap-center sm:w-auto">
              <Link href={appHref(id)} className="block" onPointerEnter={() => setHovered(id)} onPointerLeave={() => setHovered(null)}>
                <motion.div
                  animate={{ y: hovered === id ? -10 : 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  className="relative mx-auto lg:max-w-[min(240px,calc((100svh-21rem)*9/19))]"
                >
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
      </Container>
    </Chapter>
  );
}

"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

type Item = { id: string; label: string };

/**
 * Side navigation for the home page's chapters (laptops and up): a dot per chapter on a thin line
 * that fills as you go, with the current chapter's name beside it. Clicking a dot jumps there.
 */
export function ChapterRail() {
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>("[data-chapter]")];
    setItems(sections.map((el) => ({ id: el.id, label: el.dataset.chapter ?? "" })));
    const onScroll = () => {
      const mid = window.innerHeight * 0.45;
      let current = 0;
      sections.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= mid) current = i;
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (items.length < 2) return null;

  return (
    <nav aria-label="Page sections" className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block xl:right-8">
      <ol className="relative flex flex-col gap-5">
        <span className="absolute bottom-1 right-[3px] top-1 w-px bg-border" aria-hidden />
        <motion.span
          className="absolute right-[3px] top-1 w-px origin-top bg-foreground"
          style={{ height: "calc(100% - 0.5rem)" }}
          animate={{ scaleY: active / (items.length - 1) }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        />
        {items.map((item, i) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="group flex items-center justify-end gap-3" aria-current={i === active ? "true" : undefined}>
              <span
                className={`font-mono text-[10px] font-semibold uppercase tracking-widest transition-all duration-300 ${
                  i === active ? "translate-x-0 text-foreground opacity-100" : "translate-x-1 text-subtle opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                }`}
              >
                {item.label}
              </span>
              <span
                className={`relative size-[7px] rounded-full border transition-colors duration-300 ${
                  i <= active ? "border-foreground bg-foreground" : "border-subtle bg-background"
                }`}
              />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

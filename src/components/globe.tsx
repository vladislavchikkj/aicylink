"use client";

import createGlobe, { type Arc, type Marker } from "cobe";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import type { AppId } from "@/content/site";
import { AppIcon } from "./app-icon";
import { EASE_OUT } from "./motion/reveal";

type RGB = [number, number, number];

const ICE_1: RGB = [0.055, 0.647, 0.914];
const ICE_2: RGB = [0.024, 0.714, 0.831];
const ICE_3: RGB = [0.486, 0.361, 1];

const hubs: Record<string, [number, number]> = {
  sanFrancisco: [37.77, -122.42],
  newYork: [40.71, -74.01],
  saoPaulo: [-23.55, -46.63],
  london: [51.51, -0.13],
  berlin: [52.52, 13.4],
  dubai: [25.2, 55.27],
  singapore: [1.35, 103.82],
  tokyo: [35.68, 139.69],
  sydney: [-33.87, 151.21],
};

const markers: Marker[] = Object.values(hubs).map((location, i) => ({
  location,
  size: i % 3 === 0 ? 0.06 : 0.04,
  color: [ICE_1, ICE_2, ICE_3][i % 3],
}));

const arcs: Arc[] = [
  { from: hubs.sanFrancisco, to: hubs.london, color: ICE_1 },
  { from: hubs.newYork, to: hubs.berlin, color: ICE_3 },
  { from: hubs.london, to: hubs.dubai, color: ICE_2 },
  { from: hubs.dubai, to: hubs.singapore, color: ICE_1 },
  { from: hubs.singapore, to: hubs.tokyo, color: ICE_3 },
  { from: hubs.tokyo, to: hubs.sanFrancisco, color: ICE_2 },
  { from: hubs.newYork, to: hubs.saoPaulo, color: ICE_1 },
  { from: hubs.singapore, to: hubs.sydney, color: ICE_2 },
  { from: hubs.berlin, to: hubs.dubai, color: ICE_3 },
];

// App icons floating around the globe.
const orbit: { id: AppId; className: string; size: string }[] = [
  { id: "lummie", className: "left-[14%] top-[2%]", size: "size-16" },
  { id: "stars", className: "right-[10%] top-[10%]", size: "size-12" },
  { id: "snap", className: "right-[2%] bottom-[22%]", size: "size-14" },
  { id: "learn", className: "left-[34%] bottom-0", size: "size-11" },
  { id: "glow", className: "left-[-2%] top-[46%]", size: "size-12" },
];

export function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ startX: number | null; offset: number; target: number }>({
    startX: null,
    offset: 0,
    target: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = canvas.offsetWidth;
    let phi = 4.2;
    let frame = 0;
    let visible = true;

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: width * dpr,
      height: width * dpr,
      phi,
      theta: 0.28,
      dark: 0,
      diffuse: 2.4,
      mapSamples: 16000,
      mapBrightness: 1.4,
      mapBaseBrightness: 0.04,
      baseColor: [0.94, 0.97, 1],
      markerColor: ICE_1,
      glowColor: [0.86, 0.93, 1],
      markers,
      arcs,
      arcColor: ICE_1,
      arcWidth: 0.6,
      arcHeight: 0.28,
      markerElevation: 0.015,
      scale: 1.12,
    });

    const render = () => {
      const d = drag.current;
      if (d.startX === null && !reduceMotion) phi += 0.0025;
      d.offset += (d.target - d.offset) * 0.08;
      globe.update({ phi: phi + d.offset, width: width * dpr, height: width * dpr });
      if (visible) frame = requestAnimationFrame(render);
    };

    const onResize = () => {
      width = canvas.offsetWidth;
    };

    // Pause rendering while the globe is off screen.
    const observer = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting;
      if (visible && !wasVisible) frame = requestAnimationFrame(render);
    });

    observer.observe(canvas);
    window.addEventListener("resize", onResize);
    frame = requestAnimationFrame(render);
    requestAnimationFrame(() => canvas.classList.add("opacity-100"));

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      globe.destroy();
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current.startX = e.clientX - drag.current.target * 200;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (d.startX !== null) d.target = (e.clientX - d.startX) / 200;
  };
  const onPointerUp = () => {
    drag.current.startX = null;
  };

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[580px]">
      <div className="ice-glow absolute inset-[-10%] rounded-full" aria-hidden />
      <canvas
        ref={canvasRef}
        className="relative size-full cursor-grab opacity-0 transition-opacity duration-1000 [contain:layout_paint_size] active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        aria-label="Interactive globe showing the AicyLink network"
      />

      {orbit.map((o, i) => (
        <motion.div
          key={o.id}
          className={`absolute ${o.className} hidden sm:block`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 1.3 + i * 0.12, ease: EASE_OUT }}
        >
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [i % 2 ? -4 : 4, i % 2 ? 4 : -4, i % 2 ? -4 : 4] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
          >
            <AppIcon id={o.id} className={`${o.size} shadow-[0_18px_40px_-14px_rgba(10,10,10,0.45)]`} />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

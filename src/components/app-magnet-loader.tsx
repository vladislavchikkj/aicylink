"use client";

import dynamic from "next/dynamic";

// three.js loads after the page is interactive; the hero layout doesn't wait for it.
const AppMagnet = dynamic(() => import("./app-magnet"), { ssr: false });

export function AppMagnetLoader() {
  return <AppMagnet />;
}

"use client";

import dynamic from "next/dynamic";

// three.js loads after the page is interactive; the hero gradient and layout don't wait for it.
const CrystalStage = dynamic(() => import("./crystal-stage"), { ssr: false });

export function CrystalStageLoader() {
  return <CrystalStage />;
}

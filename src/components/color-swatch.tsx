"use client";

import { useState } from "react";

export function ColorSwatch({ name, value }: { name: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <button onClick={copy} className="group w-full overflow-hidden rounded-2xl border border-border text-left">
      <span className="block h-28 transition-transform duration-500 group-hover:scale-105" style={{ background: value }} />
      <span className="flex items-center justify-between bg-white p-4">
        <span className="text-sm font-semibold">{name}</span>
        <span className="font-mono text-xs text-muted">{copied ? "Copied!" : value}</span>
      </span>
    </button>
  );
}

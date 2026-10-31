import type { AppId } from "@/content/site";

// Lummie's real mark (from lummie.app), the rest are glyphs for apps in development.
export const LUMMIE_PATHS = [
  "M312 254.682V88.4099C312 86.6167 314.178 85.7296 315.431 87.0124L395.431 168.917C395.796 169.291 396 169.792 396 170.315V336.111C396 337.901 393.828 338.789 392.573 337.512L312.573 256.084C312.206 255.71 312 255.206 312 254.682Z",
  "M312.581 423.44L390.93 347.94C392.226 346.691 391.342 344.5 389.542 344.5H117C115.895 344.5 115 343.605 115 342.5V4.76829C115 2.99505 112.863 2.09889 111.598 3.34154L30.5984 82.9121C30.2156 83.2882 30 83.8023 30 84.3389V343.598C30 344.172 30.2461 344.717 30.6759 345.097L119.433 423.499C119.798 423.822 120.269 424 120.757 424H311.193C311.711 424 312.208 423.799 312.581 423.44Z",
];

export function LummieMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 425 425" className={className} fill="currentColor" aria-hidden>
      {LUMMIE_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const glyphs: Record<Exclude<AppId, "lummie">, React.ReactNode> = {
  cv: (
    <>
      <path {...stroke} d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10.5A.5.5 0 0 1 6.5 20V4a.5.5 0 0 1 .5-.5Z" />
      <path {...stroke} d="M9.5 11h5M9.5 14.5h3" />
      <path fill="currentColor" d="M17.5 13.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7Z" />
    </>
  ),
  snap: (
    <>
      <path {...stroke} d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" />
      <path fill="currentColor" d="M12 9.2c1.6-1.2 4.2-.6 4.2 2.3 0 2.6-2.1 4.8-4.2 4.8s-4.2-2.2-4.2-4.8c0-2.9 2.6-3.5 4.2-2.3Z" />
      <path {...stroke} d="M12 9.2c0-1 .5-1.9 1.5-2.4" />
    </>
  ),
  glow: (
    <>
      <path fill="currentColor" d="M11 3.5l1.6 4.9 4.9 1.6-4.9 1.6L11 16.5l-1.6-4.9L4.5 10l4.9-1.6Z" />
      <path fill="currentColor" opacity="0.75" d="M17.5 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z" />
    </>
  ),
  move: (
    <>
      <circle cx="17" cy="6" r="2" fill="currentColor" />
      <path {...stroke} d="M3.5 19.5h17M6 19.5c0-5 3-8.5 7.5-9.5l2 3.5 3 1" />
    </>
  ),
  learn: (
    <>
      <path {...stroke} d="M3.5 6.5c3-1.2 5.8-1 8.5.8 2.7-1.8 5.5-2 8.5-.8V18c-3-1.2-5.8-1-8.5.8-2.7-1.8-5.5-2-8.5-.8Z" />
      <path fill="currentColor" d="M12.8 8.5 9.8 13h2.4l-.9 3.5 3-4.5h-2.4Z" />
    </>
  ),
  stars: (
    <>
      <path fill="currentColor" d="M14.5 4.2A8 8 0 1 0 19.8 15 6.5 6.5 0 0 1 14.5 4.2Z" />
      <path fill="currentColor" d="M18 4l.6 1.6 1.6.6-1.6.6L18 8.4l-.6-1.6-1.6-.6 1.6-.6Z" />
    </>
  ),
  dreams: (
    <>
      <path {...stroke} d="M7 18.5h10a3.5 3.5 0 0 0 .4-7 5 5 0 0 0-9.6-.9A3.9 3.9 0 0 0 7 18.5Z" />
      <path fill="currentColor" d="M17.5 3.5a3 3 0 1 0 3 3.6 2.4 2.4 0 0 1-3-3.6Z" />
    </>
  ),
};

export const appTheme: Record<AppId, { background: string; accent: string }> = {
  lummie: { background: "radial-gradient(circle at 30% 20%, #26262c, #0a0a0c 70%)", accent: "#d9d9d9" },
  cv: { background: "linear-gradient(145deg, #38bdf8, #2563eb)", accent: "#2563eb" },
  snap: { background: "linear-gradient(145deg, #4ade80, #0d9488)", accent: "#10b981" },
  glow: { background: "linear-gradient(145deg, #fb7185, #f59e0b)", accent: "#f43f5e" },
  move: { background: "linear-gradient(145deg, #fb923c, #e11d48)", accent: "#f97316" },
  learn: { background: "linear-gradient(145deg, #818cf8, #06b6d4)", accent: "#6366f1" },
  stars: { background: "linear-gradient(145deg, #7c3aed, #1e1b4b)", accent: "#8b5cf6" },
  dreams: { background: "linear-gradient(145deg, #c4b5fd, #3b82f6)", accent: "#818cf8" },
};

/** iOS-style app icon. Size it with a `size-*` class. */
export function AppIcon({ id, className = "size-10" }: { id: AppId; className?: string }) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[23%] text-white shadow-[0_8px_20px_-8px_rgba(10,10,10,0.45),inset_0_0_0_1px_rgba(255,255,255,0.12)] ${className}`}
      style={{ background: appTheme[id].background }}
      aria-hidden
    >
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/25 to-transparent to-50%" />
      {id === "lummie" ? (
        <LummieMark className="relative w-[52%] text-[#d9d9d9]" />
      ) : (
        <svg viewBox="0 0 24 24" className="relative w-[58%]">
          {glyphs[id]}
        </svg>
      )}
    </span>
  );
}

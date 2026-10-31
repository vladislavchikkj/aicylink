import { useId } from "react";
import type { AppId } from "@/content/site";

// Lummie's real mark (from lummie.app).
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

export const appTheme: Record<AppId, { accent: string }> = {
  lummie: { accent: "#9ca3af" },
  cv: { accent: "#2563eb" },
  snap: { accent: "#10b981" },
  glow: { accent: "#f43f5e" },
  move: { accent: "#f97316" },
  learn: { accent: "#6366f1" },
  stars: { accent: "#8b5cf6" },
  dreams: { accent: "#818cf8" },
};

/* Each artwork is a full-bleed 100×100 scene. `u` keeps gradient ids unique per instance. */
const art: Record<AppId, (u: string) => React.ReactNode> = {
  lummie: (u) => (
    <>
      <defs>
        <radialGradient id={`${u}bg`} cx="30%" cy="20%" r="90%">
          <stop offset="0" stopColor="#2b2b31" />
          <stop offset="1" stopColor="#060607" />
        </radialGradient>
        <linearGradient id={`${u}mark`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#a8a8b0" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#${u}bg)`} />
      {[
        [14, 18, 0.8],
        [82, 14, 0.6],
        [88, 70, 0.9],
        [10, 80, 0.6],
        [70, 88, 0.5],
        [24, 50, 0.4],
      ].map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#fff" opacity="0.7" />
      ))}
      <g transform="translate(25 25) scale(0.118)" fill={`url(#${u}mark)`}>
        {LUMMIE_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </>
  ),

  cv: (u) => (
    <>
      <defs>
        <linearGradient id={`${u}bg`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#60a5fa" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id={`${u}pen`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#${u}bg)`} />
      <g transform="rotate(-8 50 52)">
        <rect x="27" y="22" width="44" height="58" rx="6" fill="#1e3a8a" opacity="0.35" transform="translate(3 4)" />
        <rect x="27" y="22" width="44" height="58" rx="6" fill="#fff" />
        <circle cx="38" cy="35" r="5.5" fill="#bfdbfe" />
        <rect x="47" y="31" width="17" height="3.5" rx="1.75" fill="#1d4ed8" />
        <rect x="47" y="37" width="11" height="3" rx="1.5" fill="#93c5fd" />
        {[48, 55, 62].map((y, i) => (
          <rect key={y} x="33" y={y} width={i === 1 ? 24 : 32} height="3" rx="1.5" fill="#dbeafe" />
        ))}
        <rect x="33" y="69" width="18" height="3" rx="1.5" fill="#dbeafe" />
      </g>
      <g transform="rotate(38 70 66)">
        <rect x="64" y="40" width="10" height="38" rx="3" fill={`url(#${u}pen)`} />
        <path d="M64 78h10l-5 9z" fill="#fef3c7" />
        <path d="M67.5 84.5h3L69 87z" fill="#1e293b" />
      </g>
      <path d="M78 18l1.8 4.6 4.6 1.8-4.6 1.8L78 30.8l-1.8-4.6-4.6-1.8 4.6-1.8z" fill="#fff" />
    </>
  ),

  snap: (u) => (
    <>
      <defs>
        <linearGradient id={`${u}bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#bbf7d0" />
          <stop offset="1" stopColor="#4ade80" />
        </linearGradient>
        <radialGradient id={`${u}flesh`} cx="45%" cy="40%" r="70%">
          <stop offset="0" stopColor="#fefce8" />
          <stop offset="0.6" stopColor="#d9f99d" />
          <stop offset="1" stopColor="#84cc16" />
        </radialGradient>
        <radialGradient id={`${u}pit`} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#d6a26b" />
          <stop offset="1" stopColor="#7c4a1e" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#${u}bg)`} />
      <path
        d="M14 30V20a6 6 0 0 1 6-6h10M70 14h10a6 6 0 0 1 6 6v10M86 70v10a6 6 0 0 1-6 6H70M30 86H20a6 6 0 0 1-6-6V70"
        fill="none"
        stroke="#14532d"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.85"
      />
      <g transform="rotate(-18 50 52)">
        <path d="M50 20c11 0 17 10 19 22 3 16-6 34-19 34S28 58 31 42c2-12 8-22 19-22Z" fill="#166534" />
        <path d="M50 25c8 0 13 8 15 18 2 13-5 28-15 28S33 56 35 43c2-10 7-18 15-18Z" fill={`url(#${u}flesh)`} />
        <circle cx="50" cy="52" r="9.5" fill={`url(#${u}pit)`} />
        <ellipse cx="47" cy="48.5" rx="3" ry="2" fill="#fff" opacity="0.45" />
      </g>
    </>
  ),

  glow: (u) => (
    <>
      <defs>
        <radialGradient id={`${u}bg`} cx="30%" cy="25%" r="95%">
          <stop offset="0" stopColor="#fecdd3" />
          <stop offset="0.55" stopColor="#fb7185" />
          <stop offset="1" stopColor="#be123c" />
        </radialGradient>
        <radialGradient id={`${u}orb`} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#ffe4e6" />
          <stop offset="1" stopColor="#fda4af" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#${u}bg)`} />
      <circle cx="50" cy="52" r="30" fill="#fff" opacity="0.18" />
      <circle cx="50" cy="52" r="23" fill={`url(#${u}orb)`} />
      <ellipse cx="42" cy="43" rx="7" ry="4.5" fill="#fff" opacity="0.9" transform="rotate(-30 42 43)" />
      <path d="M74 18l2.6 6.4L83 27l-6.4 2.6L74 36l-2.6-6.4L65 27l6.4-2.6z" fill="#fff" />
      <path d="M24 70l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z" fill="#fff" opacity="0.85" />
      <circle cx="80" cy="76" r="2" fill="#fff" opacity="0.7" />
    </>
  ),

  move: (u) => (
    <>
      <defs>
        <linearGradient id={`${u}bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fdba74" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id={`${u}wall`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff7ed" />
          <stop offset="1" stopColor="#fed7aa" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#${u}bg)`} />
      <rect x="74" y="0" width="26" height="100" fill={`url(#${u}wall)`} />
      <rect x="74" y="0" width="3" height="100" fill="#9a3412" opacity="0.18" />
      <rect x="8" y="78" width="64" height="7" rx="3.5" fill="#7c2d12" opacity="0.35" />
      <circle cx="19" cy="69" r="7.5" fill="#fff" />
      <g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round">
        <path d="M28 73 L52 71" strokeWidth="9" />
        <path d="M52 71 L60 46 L70 22" strokeWidth="8" />
        <path d="M52 71 L64 54 L70 40" strokeWidth="7" opacity="0.75" />
        <path d="M34 73 L42 80" strokeWidth="5" />
      </g>
      <circle cx="71" cy="20" r="3.2" fill="#fff" />
    </>
  ),

  learn: (u) => (
    <>
      <defs>
        <linearGradient id={`${u}bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#818cf8" />
          <stop offset="1" stopColor="#4338ca" />
        </linearGradient>
        <linearGradient id={`${u}bolt`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fef08a" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#${u}bg)`} />
      <rect x="30" y="20" width="46" height="56" rx="9" fill="#a5b4fc" transform="rotate(12 53 48)" />
      <rect x="26" y="23" width="46" height="56" rx="9" fill="#c7d2fe" transform="rotate(5 49 51)" />
      <rect x="22" y="26" width="46" height="56" rx="9" fill="#fff" />
      <path d="M49 34 35 56h11l-4 18 15-24H46z" fill={`url(#${u}bolt)`} stroke="#b45309" strokeWidth="1.2" strokeLinejoin="round" />
      <rect x="29" y="74" width="20" height="3" rx="1.5" fill="#e0e7ff" />
    </>
  ),

  stars: (u) => (
    <>
      <defs>
        <radialGradient id={`${u}bg`} cx="50%" cy="40%" r="80%">
          <stop offset="0" stopColor="#4c1d95" />
          <stop offset="1" stopColor="#0f0a2e" />
        </radialGradient>
        <linearGradient id={`${u}moon`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fef3c7" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#${u}bg)`} />
      <ellipse cx="50" cy="52" rx="38" ry="13" fill="none" stroke="#c4b5fd" strokeWidth="1.2" opacity="0.45" transform="rotate(-22 50 52)" />
      <path d="M58 22a28 28 0 1 0 20 46 23 23 0 0 1-20-46Z" fill={`url(#${u}moon)`} />
      <path d="M58 22a28 28 0 0 0-22 9 26 26 0 0 1 22-5Z" fill="#fff" opacity="0.5" />
      <path d="M74 20l1.8 4.6 4.6 1.8-4.6 1.8L74 32.8l-1.8-4.6-4.6-1.8 4.6-1.8z" fill="#fef9c3" />
      {[
        [20, 22, 1.4],
        [84, 46, 1.1],
        [16, 76, 1],
        [80, 84, 1.3],
        [30, 88, 0.8],
      ].map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#fff" />
      ))}
    </>
  ),

  dreams: (u) => (
    <>
      <defs>
        <linearGradient id={`${u}bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#c4b5fd" />
        </linearGradient>
        <linearGradient id={`${u}cloud`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e0e7ff" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#${u}bg)`} />
      <path d="M66 18a14 14 0 1 0 14 17 11 11 0 0 1-14-17Z" fill="#fde68a" />
      <path d="M24 74h50a14 14 0 0 0 1-28 20 20 0 0 0-38-4 15 15 0 0 0-13 32Z" fill="#4338ca" opacity="0.25" transform="translate(2 4)" />
      <path d="M24 74h50a14 14 0 0 0 1-28 20 20 0 0 0-38-4 15 15 0 0 0-13 32Z" fill={`url(#${u}cloud)`} />
      <text x="20" y="34" fontSize="11" fontWeight="700" fill="#fff" opacity="0.85" fontFamily="system-ui, sans-serif">
        z
      </text>
      <text x="29" y="25" fontSize="8" fontWeight="700" fill="#fff" opacity="0.6" fontFamily="system-ui, sans-serif">
        z
      </text>
    </>
  ),
};

/** App icon with its own artwork. Size it with a `size-*` class. */
export function AppIcon({ id, className = "size-10" }: { id: AppId; className?: string }) {
  const u = useId().replace(/:/g, "");
  return (
    <span
      className={`relative inline-flex shrink-0 overflow-hidden rounded-[23%] shadow-[0_8px_20px_-8px_rgba(10,10,10,0.45),inset_0_0_0_1px_rgba(255,255,255,0.12)] ${className}`}
      aria-hidden
    >
      <svg viewBox="0 0 100 100" className="size-full">
        {art[id](u)}
      </svg>
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/20 to-transparent to-40%" />
    </span>
  );
}

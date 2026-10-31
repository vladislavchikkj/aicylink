"use client";

/** Card with a soft highlight that follows the cursor. */
export function Spotlight({ children, className }: { children: React.ReactNode; className?: string }) {
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div className={`spotlight ${className ?? ""}`} onPointerMove={onPointerMove}>
      {children}
    </div>
  );
}

import type { Product } from "@/content/site";

type Status = Product["status"];

const icons: Record<Status, React.ReactNode> = {
  flagship: <path d="M6 1.2 7.4 4.3l3.3.4-2.5 2.2.7 3.3L6 8.5 3.1 10.2l.7-3.3L1.3 4.7l3.3-.4Z" fill="currentColor" />,
  beta: <circle cx="6" cy="6" r="2.5" fill="currentColor" />,
  next: <path d="M6.8 1 2.5 6.6h3l-.8 4.4 4.8-6H6.3Z" fill="currentColor" />,
  early: <path d="M6 1.5 7 5l3.5 1L7 7l-1 3.5L5 7 1.5 6 5 5Z" fill="currentColor" />,
};

const labels: Record<Status, string> = { flagship: "Flagship", beta: "Beta", next: "Next up", early: "Early access" };

const styles: Record<Status, string> = {
  flagship: "badge-flagship text-white",
  beta: "border border-sky-200 bg-sky-50 text-sky-700",
  next: "bg-gradient-to-r from-ice-3/15 to-ice-1/15 text-ice-3 ring-1 ring-inset ring-ice-3/25",
  early: "border border-border bg-white text-muted",
};

/** Marketing label for a product's stage. */
export function StatusBadge({ status, className = "" }: { status: Status; className?: string }) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center gap-1 overflow-hidden whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide ${styles[status]} ${className}`}
    >
      <svg viewBox="0 0 12 12" className={`size-2.5 ${status === "beta" ? "animate-pulse" : ""}`} aria-hidden>
        {icons[status]}
      </svg>
      {labels[status]}
    </span>
  );
}

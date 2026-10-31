type Props = { className?: string; sparkleClassName?: string };

export const MARK_PATH =
  "M342 745L515 548Q540 522 575 522H668Q703 522 728 550L886 747H772Q745 747 728 725L624 598L520 722Q502 746 472 746Z";
export const SPARKLE_PATH =
  "M861 435C865 497 872 515 945 519C872 523 865 541 861 603C857 541 850 523 778 519C850 515 857 497 861 435Z";

export function LogoMark({ className, sparkleClassName }: Props) {
  return (
    <svg viewBox="330 420 630 340" fill="currentColor" aria-hidden className={className}>
      <path d={MARK_PATH} />
      <path d={SPARKLE_PATH} className={sparkleClassName} />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold tracking-tight ${className ?? ""}`}>
      <LogoMark className="h-5 w-auto" />
      AicyLink
    </span>
  );
}

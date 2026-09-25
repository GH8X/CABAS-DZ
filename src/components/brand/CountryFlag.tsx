import { COUNTRIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { CountryCode } from "@/lib/types";

const VERTICAL: CountryCode[] = ["FR", "IT", "BE"];

export function MiniFlag({
  code,
  className,
}: {
  code: CountryCode;
  className?: string;
}) {
  const meta = COUNTRIES[code];
  const vertical = VERTICAL.includes(code);

  if (code === "EU") {
    return (
      <span
        className={cn(
          "relative inline-flex h-4 w-6 shrink-0 items-center justify-center overflow-hidden rounded-[4px] bg-[#003399] ring-1 ring-black/10",
          className,
        )}
        aria-hidden="true"
      >
        <span className="text-[7px] leading-none text-[#FFCC00]">★</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex h-4 w-6 shrink-0 overflow-hidden rounded-[4px] ring-1 ring-black/10",
        vertical ? "flex-row" : "flex-col",
        className,
      )}
      aria-hidden="true"
    >
      {meta.stripes.map((color, index) => (
        <span
          key={index}
          className="flex-1"
          style={{ backgroundColor: color }}
        />
      ))}
    </span>
  );
}

export function CountryChip({
  code,
  className,
  showName = true,
}: {
  code: CountryCode;
  className?: string;
  showName?: boolean;
}) {
  const meta = COUNTRIES[code];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-white/85 px-2.5 py-1 text-[11px] font-bold text-ink-soft backdrop-blur",
        className,
      )}
    >
      <MiniFlag code={code} className="h-3.5 w-5" />
      {showName ? <span className="truncate">{meta.name}</span> : null}
    </span>
  );
}

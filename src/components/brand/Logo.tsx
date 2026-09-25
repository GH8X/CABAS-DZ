import { Link } from "react-router-dom";
import { StarGlyph } from "./Stars";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-800 text-gold-300 shadow-soft",
        className,
      )}
    >
      <span className="flex -translate-y-[3px] flex-col items-center">
        <StarGlyph className="h-3 w-3" />
        <span className="font-display text-[13px] font-black leading-none tracking-tight text-white">
          DZ
        </span>
      </span>
      <span className="absolute inset-x-2 bottom-1 h-[2px] rounded-full bg-gold-shine" />
    </span>
  );
}

export function Logo({
  siteName = "CABAS DZ",
  logoUrl,
  className,
  compact = false,
}: {
  siteName?: string;
  logoUrl?: string;
  className?: string;
  compact?: boolean;
}) {
  const [first, ...rest] = siteName.split(" ");

  return (
    <Link
      to="/"
      className={cn("group flex items-center gap-3", className)}
      aria-label={`${siteName} — accueil`}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={siteName}
          className="h-11 w-11 rounded-2xl object-cover shadow-soft"
        />
      ) : (
        <LogoMark className="transition-transform duration-300 group-hover:-rotate-6" />
      )}
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[19px] font-black tracking-tight text-brand-900">
            {first}
            {rest.length ? <span className="text-brand-500"> {rest.join(" ")}</span> : null}
          </span>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            Pièces uniques
          </span>
        </span>
      )}
    </Link>
  );
}

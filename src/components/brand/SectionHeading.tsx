import type { ReactNode } from "react";
import { StarRow } from "./Stars";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  action,
  className,
  tone = "light",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  action?: ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        action && "sm:flex-row sm:items-end sm:justify-between sm:text-left",
        className,
      )}
    >
      <div
        className={cn(
          "max-w-2xl",
          align === "center" && !action && "mx-auto text-center",
        )}
      >
        {eyebrow ? (
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em]",
              tone === "dark"
                ? "border-white/20 bg-white/10 text-gold-200"
                : "border-brand-100 bg-brand-50 text-brand-700",
            )}
          >
            <StarRow count={3} className="justify-start" starClassName="h-2.5 w-2.5" />
            {eyebrow}
          </span>
        ) : null}

        <h2
          className={cn(
            "mt-4 font-display text-3xl font-black leading-[1.1] sm:text-4xl lg:text-[42px]",
            tone === "dark" ? "text-white" : "text-brand-900",
            align === "center" && !action && "text-balance",
          )}
        >
          {title}
        </h2>

        {subtitle ? (
          <p
            className={cn(
              "mt-4 text-base leading-relaxed",
              tone === "dark" ? "text-brand-100/80" : "text-muted-foreground",
            )}
          >
            {subtitle}
          </p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

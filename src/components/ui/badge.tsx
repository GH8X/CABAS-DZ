import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand-800 text-white",
        gold: "border-gold-200 bg-gold-shine bg-[length:200%_100%] bg-left text-brand-900",
        outline: "border-border bg-white text-ink-soft",
        soft: "border-brand-100 bg-brand-50 text-brand-700",
        muted: "border-transparent bg-cream-200 text-ink-soft",
        sold: "border-rose-200 bg-rose-50 text-rose-700",
        available: "border-emerald-200 bg-emerald-50 text-emerald-700",
        reserved: "border-gold-200 bg-gold-50 text-gold-700",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

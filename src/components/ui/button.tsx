import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-brand-800 text-white shadow-soft hover:bg-brand-900 hover:shadow-lift hover:-translate-y-0.5",
        gold: "bg-gold-shine bg-[length:200%_100%] bg-left text-brand-900 shadow-soft hover:bg-right hover:shadow-glow hover:-translate-y-0.5",
        outline:
          "border border-brand-200 bg-white/70 text-brand-800 backdrop-blur hover:border-brand-400 hover:bg-white hover:-translate-y-0.5",
        secondary:
          "bg-cream-200 text-brand-900 hover:bg-cream-300 hover:-translate-y-0.5",
        ghost: "text-brand-800 hover:bg-brand-50",
        subtle: "bg-brand-50 text-brand-700 hover:bg-brand-100",
        destructive:
          "bg-rose-600 text-white shadow-soft hover:bg-rose-700 hover:-translate-y-0.5",
        link: "text-brand-700 underline-offset-4 hover:underline rounded-none",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        default: "h-11 px-6",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-9 text-base",
        icon: "h-11 w-11",
        "icon-sm": "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

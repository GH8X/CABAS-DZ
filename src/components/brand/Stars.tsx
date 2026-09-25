import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/** A single five-branch star used across the identity. */
export function StarGlyph({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("h-4 w-4", className)}
      style={style}
    >
      <path
        fill="currentColor"
        d="M12 1.6l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 16.8 5.9 20.2l1.4-6.8L2.2 8.7l6.9-.8z"
      />
    </svg>
  );
}

/** ✦ ✦ ✦ ✦ ✦ — the recurring section separator. */
export function StarRow({
  count = 5,
  className,
  starClassName,
}: {
  count?: number;
  className?: string;
  starClassName?: string;
}) {
  return (
    <div className={cn("flex items-center justify-center gap-1.5 text-gold-400", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <StarGlyph key={index} className={cn("h-3 w-3", starClassName)} />
      ))}
    </div>
  );
}

const DOTS = [
  { top: "12%", left: "6%", size: 10, delay: 0 },
  { top: "24%", left: "88%", size: 14, delay: 0.6 },
  { top: "68%", left: "12%", size: 8, delay: 1.2 },
  { top: "78%", left: "72%", size: 12, delay: 0.3 },
  { top: "8%", left: "52%", size: 7, delay: 1.8 },
  { top: "44%", left: "94%", size: 9, delay: 2.1 },
  { top: "88%", left: "34%", size: 11, delay: 1.1 },
  { top: "36%", left: "2%", size: 6, delay: 0.9 },
  { top: "58%", left: "48%", size: 8, delay: 2.4 },
  { top: "16%", left: "28%", size: 6, delay: 1.5 },
  { top: "92%", left: "62%", size: 7, delay: 0.4 },
  { top: "30%", left: "68%", size: 5, delay: 2.7 },
];

/** Twelve drifting stars — the EU motif, kept subtle and premium. */
export function StarField({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {DOTS.map((dot, index) => (
        <motion.span
          key={index}
          className="absolute text-gold-300/70"
          style={{ top: dot.top, left: dot.left }}
          animate={{ y: [0, -16, 0], opacity: [0.25, 0.85, 0.25], rotate: [0, 12, 0] }}
          transition={{
            duration: 7 + (index % 4),
            repeat: Infinity,
            ease: "easeInOut",
            delay: dot.delay,
          }}
        >
          <StarGlyph
            className="block"
            style={{ width: dot.size, height: dot.size }}
          />
        </motion.span>
      ))}
    </div>
  );
}

/** Twelve stars arranged in a circle, like the European emblem. */
export function StarCircle({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      {Array.from({ length: 12 }).map((_, index) => {
        const angle = (index / 12) * Math.PI * 2 - Math.PI / 2;
        return (
          <motion.span
            key={index}
            className="absolute left-1/2 top-1/2 text-gold-300"
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 0.14,
              ease: "easeInOut",
            }}
          >
            <StarGlyph
              className="h-3 w-3"
              style={{
                transform: `translate(calc(-50% + ${Math.cos(angle) * 100}%), calc(-50% + ${Math.sin(angle) * 100}%))`,
              }}
            />
          </motion.span>
        );
      })}
    </div>
  );
}

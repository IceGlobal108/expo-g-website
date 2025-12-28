import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BackgroundLinesProps {
  children?: React.ReactNode;
  className?: string;
}

export const BackgroundLines = ({ children, className }: BackgroundLinesProps) => {
  const lines = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        id: index,
        left: (index / 18) * 100 + (Math.random() * 6 - 3),
        duration: 8 + Math.random() * 6,
        delay: Math.random() * 2,
      })),
    []
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/60 bg-card",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        {lines.map((line) => (
          <motion.span
            key={line.id}
            className="absolute inset-y-[-20%] w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent"
            style={{ left: `${line.left}%` }}
            animate={{ y: ["-10%", "10%", "-10%"] }}
            transition={{
              duration: line.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: line.delay,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.08),transparent_45%),radial-gradient(circle_at_bottom,hsl(var(--secondary)/0.08),transparent_45%)]" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

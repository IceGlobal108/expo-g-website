import { useState } from "react";
import { cn } from "@/lib/utils";

interface PointerHighlightProps {
  children: React.ReactNode;
  className?: string;
  rectangleClassName?: string;
  pointerClassName?: string;
}

export const PointerHighlight = ({
  children,
  className,
  rectangleClassName,
  pointerClassName,
}: PointerHighlightProps) => {
  const [coords, setCoords] = useState({ x: 50, y: 50 });

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y });
  };

  const handleLeave = () => setCoords({ x: 50, y: 50 });

  return (
    <div
      className={cn("group relative inline-flex", className)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-[-6px] rounded-2xl border border-border/70 bg-card/80 transition duration-300",
          rectangleClassName
        )}
        style={{
          background: `radial-gradient(220px at ${coords.x}% ${coords.y}%, hsl(var(--primary)/0.12), transparent 60%)`,
        }}
      />
      <div className="relative z-10 px-3 py-2">{children}</div>
      <div
        className={cn(
          "pointer-events-none absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/30 bg-primary/15 opacity-0 blur-xl transition-opacity duration-200 group-hover:opacity-100",
          pointerClassName
        )}
        style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
      />
    </div>
  );
};

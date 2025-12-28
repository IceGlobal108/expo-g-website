import { useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParallaxScrollProps {
  images: string[];
  className?: string;
}

export const ParallaxScroll = ({ images, className }: ParallaxScrollProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const columns = useMemo(
    () => [0, 1, 2].map((columnIndex) => images.filter((_, i) => i % 3 === columnIndex)),
    [images]
  );

  const translateValues = [
    useTransform(scrollYProgress, [0, 1], [0, -80]),
    useTransform(scrollYProgress, [0, 1], [0, -140]),
    useTransform(scrollYProgress, [0, 1], [0, -110]),
  ];

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-6 md:p-10",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
      <div className="relative grid grid-cols-1 gap-4 md:grid-cols-3">
        {columns.map((column, index) => (
          <motion.div key={index} style={{ y: translateValues[index] }} className="space-y-4">
            {column.map((image, imageIndex) => (
              <div
                key={`${image}-${imageIndex}`}
                className="overflow-hidden rounded-2xl border border-border/60 bg-muted/40"
              >
                <img
                  src={image}
                  alt="Parallax gallery item"
                  className="h-48 w-full object-cover md:h-64"
                  loading="lazy"
                />
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface BackgroundBeamsProps {
  className?: string;
}

export const BackgroundBeams = ({ className }: BackgroundBeamsProps) => {
  const [beams, setBeams] = useState<
    { id: number; left: number; delay: number; duration: number }[]
  >([]);

  useEffect(() => {
    const generateBeams = () => {
      const newBeams = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 5,
      }));
      setBeams(newBeams);
    };
    generateBeams();
  }, []);

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5" />
      {beams.map((beam) => (
        <motion.div
          key={beam.id}
          className="absolute w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent"
          style={{
            left: `${beam.left}%`,
            height: "100%",
          }}
          animate={{
            y: ["100%", "-100%"],
          }}
          transition={{
            duration: beam.duration,
            repeat: Infinity,
            delay: beam.delay,
            ease: "linear",
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background" />
    </div>
  );
};

interface BackgroundGradientProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: BackgroundGradientProps) => {
  return (
    <div className={cn("relative p-[4px] group", containerClassName)}>
      <motion.div
        animate={
          animate
            ? {
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }
            : undefined
        }
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: "400% 400%",
        }}
        className={cn(
          "absolute inset-0 rounded-xl z-[1] opacity-60 group-hover:opacity-100 blur-xl transition duration-500 will-change-transform",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,hsl(var(--primary)),transparent),radial-gradient(circle_farthest-side_at_100%_0,hsl(var(--secondary)),transparent),radial-gradient(circle_farthest-side_at_100%_100%,hsl(var(--accent)),transparent),radial-gradient(circle_farthest-side_at_0_0,hsl(var(--primary)),hsl(var(--background)))]"
        )}
      />
      <motion.div
        animate={
          animate
            ? {
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }
            : undefined
        }
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: "400% 400%",
        }}
        className={cn(
          "absolute inset-0 rounded-xl z-[1] will-change-transform",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,hsl(var(--primary)),transparent),radial-gradient(circle_farthest-side_at_100%_0,hsl(var(--secondary)),transparent),radial-gradient(circle_farthest-side_at_100%_100%,hsl(var(--accent)),transparent),radial-gradient(circle_farthest-side_at_0_0,hsl(var(--primary)),hsl(var(--background)))]"
        )}
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};

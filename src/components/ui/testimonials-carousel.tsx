"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Star, ArrowUpRight } from "lucide-react";

interface TestimonialCardProps {
  image: string;
  name: string;
  role: string;
  company: string;
  rating: number;
}

const TestimonialCard = ({
  image,
  name,
  role,
  company,
  rating,
}: TestimonialCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="relative flex-shrink-0 w-[280px] md:w-[320px] rounded-2xl overflow-hidden group cursor-pointer"
    >
      <div className="aspect-[3/4] relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ArrowUpRight className="w-5 h-5 text-foreground" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/95 via-background/80 to-transparent">
        <div className="flex gap-0.5 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-4 h-4",
                i < rating ? "fill-accent text-accent" : "text-muted"
              )}
            />
          ))}
        </div>
        <h3 className="font-display font-semibold text-foreground text-lg">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {role}, {company}
        </p>
      </div>
    </motion.div>
  );
};

interface TestimonialsCarouselProps {
  testimonials: TestimonialCardProps[];
  title?: string;
  subtitle?: string;
}

export const TestimonialsCarousel = ({
  testimonials,
  title = "What our partners say",
  subtitle = "Hear from brands and visitors who've experienced our expos firsthand",
}: TestimonialsCarouselProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      return () => container.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16">
          <div>
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-display text-foreground mt-2">
              {title}
            </h2>
            <p className="text-muted-foreground mt-4 max-w-lg">{subtitle}</p>
          </div>
          <div className="flex gap-3 mt-6 md:mt-0">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={cn(
                "w-12 h-12 rounded-full border border-border flex items-center justify-center transition-all duration-300",
                canScrollLeft
                  ? "hover:bg-card hover:border-primary/50 text-foreground"
                  : "opacity-50 cursor-not-allowed text-muted-foreground"
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={cn(
                "w-12 h-12 rounded-full border border-border flex items-center justify-center transition-all duration-300",
                canScrollRight
                  ? "hover:bg-card hover:border-primary/50 text-foreground"
                  : "opacity-50 cursor-not-allowed text-muted-foreground"
              )}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Building2, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

type CtaCard = {
  eyebrow?: string;
  title: string;
  description?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
};

interface DualCtaSectionProps {
  sellers: CtaCard;
  buyers: CtaCard;
  className?: string;
}

const DualCtaSection = ({ sellers, buyers, className }: DualCtaSectionProps) => {
  const cards: Array<CtaCard & { icon: React.ReactNode; variant: "primary" | "secondary" }> = [
    { ...sellers, icon: <Building2 className="w-5 h-5" />, variant: "primary" },
    { ...buyers, icon: <ShoppingBag className="w-5 h-5" />, variant: "secondary" },
  ];

  return (
    <section className={cn("section-padding", className)}>
      <div className="container-custom grid gap-6 lg:grid-cols-2">
        {cards.map((card, idx) => (
          <motion.div
            key={card.title + idx}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: idx * 0.05 }}
            className={cn(
              "relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 shadow-2xl shadow-primary/10 p-8 flex flex-col gap-5",
              card.variant === "primary"
                ? "bg-gradient-to-br from-primary/10 via-card to-background/80"
                : "bg-gradient-to-br from-secondary/10 via-card to-background/80"
            )}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.14),transparent_45%),radial-gradient(circle_at_80%_80%,hsl(var(--secondary)/0.14),transparent_45%)]" />
            <div className="relative space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/70 border border-border text-xs uppercase tracking-[0.25em]">
                {card.icon}
                <span>{card.eyebrow ?? "CTA"}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-display font-semibold text-foreground">
                {card.title}
              </h3>
              {card.description && (
                <p className="text-muted-foreground text-sm md:text-base">
                  {card.description}
                </p>
              )}
            </div>
            <div className="relative flex flex-wrap gap-3 pt-1">
              <Link
                to={card.primary.href}
                className={cn(
                  "inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all",
                  card.variant === "primary"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30"
                    : "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/20 hover:shadow-secondary/30"
                )}
              >
                {card.primary.label}
              </Link>
              {card.secondary && (
                <Link
                  to={card.secondary.href}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border hover:border-primary/60 text-foreground bg-card/80 transition-all"
                >
                  {card.secondary.label}
                </Link>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default DualCtaSection;

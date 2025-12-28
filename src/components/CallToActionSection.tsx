import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CallToActionSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  className?: string;
}

const CallToActionSection = ({
  eyebrow,
  title,
  description,
  primary,
  secondary,
  className,
}: CallToActionSectionProps) => {
  return (
    <section className={cn("section-padding", className)}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/80 shadow-2xl shadow-primary/10 px-6 py-10 md:px-10 md:py-14 flex flex-col gap-6 md:gap-8 md:flex-row md:items-center md:justify-between"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.12),transparent_45%),radial-gradient(circle_at_80%_80%,hsl(var(--secondary)/0.12),transparent_45%)]" />
          <div className="relative space-y-3 max-w-2xl">
            {eyebrow && (
              <span className="text-primary font-medium text-sm uppercase tracking-[0.25em]">
                {eyebrow}
              </span>
            )}
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              {title}
            </h2>
            {description && <p className="text-muted-foreground text-base md:text-lg">{description}</p>}
          </div>

          <div className="relative flex flex-wrap gap-3">
            <Link
              to={primary.href}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
            >
              {primary.label}
              <ArrowRight className="w-4 h-4" />
            </Link>
            {secondary && (
              <Link
                to={secondary.href}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:border-primary/60 text-foreground bg-card transition-all"
              >
                {secondary.label}
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToActionSection;

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ParallaxGridScroll } from "@/components/ui/parallax-grid-scroll";

type Cta = {
  label: string;
  href: string;
};

interface ReviewMomentsSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  images: { src: string; href: string }[];
  cta?: Cta;
}

const ReviewMomentsSection = ({
  eyebrow = "Review the moment",
  title,
  description,
  images,
  cta,
}: ReviewMomentsSectionProps) => {
  const imagesWithLinks = images.map((img) => ({
    src: img.src,
    href: img.href || cta?.href || "/gallery",
  }));

  return (
    <section className="relative overflow-hidden">
      <div className="container-custom pt-16 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          {eyebrow && (
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              {eyebrow}
            </span>
          )}
          <h2 className="text-3xl md:text-5xl font-bold font-display text-foreground mt-2">
            {title}
          </h2>
          {description && (
            <p className="text-muted-foreground mt-4">
              {description}
            </p>
          )}
        </motion.div>
      </div>

      <ParallaxGridScroll images={imagesWithLinks} />

      {cta && (
        <div className="container-custom pb-16 md:pb-24 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              to={cta.href}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group"
            >
              <span className="font-display font-semibold text-foreground">
                {cta.label}
              </span>
              <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default ReviewMomentsSection;

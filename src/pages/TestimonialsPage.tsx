import { motion } from "framer-motion";
import { FloatingNavbar } from "@/components/ui/floating-navbar";
import Footer from "@/components/Footer";
import { navItems, testimonials } from "@/data/expo-data";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const stagger = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5 },
  }),
};

const TestimonialsPage = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <FloatingNavbar navItems={navItems} />

      <section className="relative overflow-hidden pt-28 md:pt-36 pb-14">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background pointer-events-none" />
        <div className="container-custom relative space-y-4">
          <Badge variant="secondary" className="text-xs uppercase tracking-[0.25em]">
            Voices
          </Badge>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-display font-bold"
          >
            Testimonials
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground max-w-3xl text-lg"
          >
            What our partners, founders, and attendees say about INDIA GLOBAL EXPO. Animated stories from the floor to the
            main stage.
          </motion.p>
        </div>
      </section>

      <section className="container-custom pb-16 space-y-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              custom={i}
              className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-xl shadow-primary/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
              <div className="relative flex flex-col gap-4 p-6">
                <div className="flex items-center gap-4">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="h-14 w-14 rounded-full object-cover border border-border/60"
                  />
                  <div>
                    <div className="font-display font-semibold text-lg">{t.name}</div>
                    <p className="text-sm text-muted-foreground">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-primary">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-primary" />
                  ))}
                </div>
                <motion.p
                  initial={{ opacity: 0.6 }}
                  whileHover={{ opacity: 1, y: -2 }}
                  className="text-muted-foreground leading-relaxed"
                >
                  “INDIA GLOBAL EXPO made our launch feel like a festival. Production, people, and ROI—all aligned.”
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="text-xs uppercase tracking-[0.2em] text-primary"
                >
                  Live on stage · {t.rating}-star experience
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-3xl border border-border/60 bg-card/70 p-6 md:p-8 text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em]">
            Share yours
          </div>
          <h2 className="text-3xl font-display font-bold">Were you at the expo?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tell us what you loved, what you’d improve, and what you want to see next year. Your feedback shapes the next edition.
          </p>
          <a
            href="/feedback"
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:translate-y-[-2px] transition-all"
          >
            Send feedback
          </a>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
};

export default TestimonialsPage;

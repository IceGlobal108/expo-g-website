import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { FloatingNavbar } from "@/components/ui/floating-navbar";
import { BackgroundBeams } from "@/components/ui/background-effects";
import Footer from "@/components/Footer";
import { brandHighlights, brandStories, navItems } from "@/data/expo-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import NotFound from "./NotFound";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

const BrandDetail = () => {
  const { slug } = useParams();
  const brand = useMemo(() => brandHighlights.find((item) => item.slug === slug), [slug]);
  const story = slug ? brandStories[slug] : undefined;

  const { scrollYProgress } = useScroll();
  const imageScale = useTransform(scrollYProgress, [0, 0.3], [1.05, 1]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.85]);

  if (!brand || !story) {
    return <NotFound />;
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <FloatingNavbar navItems={navItems} />

      <section className="relative min-h-[70vh] flex items-end pb-16 pt-28 md:pt-36 overflow-hidden">
        <BackgroundBeams className="z-0" />
        <motion.img
          src={story.heroImage}
          alt={brand.name}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ scale: imageScale, opacity: imageOpacity }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="container-custom relative z-10 space-y-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back home
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary">{brand.relationship}</Badge>
            <Badge>{brand.category}</Badge>
          </div>
          <div className="max-w-4xl space-y-4">
            <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">
              {brand.name}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">{story.summary}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="text-base px-4 py-2">
              Trusted by Industry Leaders
            </Badge>
            <Button asChild variant="hero-outline" size="sm">
              <a href="#highlights" className="flex items-center gap-2">
                Read the story <ArrowUpRight className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section id="highlights" className="section-padding">
        <div className="container-custom grid lg:grid-cols-3 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-2 space-y-12">
            {story.highlights.map((section, index) => {
              const delay = index * 0.1;
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="grid md:grid-cols-5 gap-6 md:gap-10 items-start"
                >
                  <div className={`md:col-span-2 space-y-3 ${isEven ? "" : "md:order-last"}`}>
                    <div className="text-sm uppercase tracking-[0.2em] text-primary">Chapter {index + 1}</div>
                    <h2 className="text-2xl md:text-3xl font-display font-semibold">{section.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">{section.body}</p>
                  </div>
                  <div className="md:col-span-3">
                    <motion.div
                      initial={{ scale: 0.96, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, delay: delay + 0.05 }}
                      viewport={{ once: true, margin: "-50px" }}
                      className="relative overflow-hidden rounded-2xl bg-card border border-border/70 h-full min-h-[240px]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.18),transparent_45%),radial-gradient(circle_at_bottom_right,hsl(var(--secondary)/0.18),transparent_45%)]" />
                      <div className="relative h-full p-6 flex items-end">
                        <p className="text-lg text-foreground/90 leading-relaxed">
                          {story.pullQuote}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="space-y-6 sticky top-28">
            <div className="glass rounded-2xl p-6 border border-border/70 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium">
                Impact snapshot
              </div>
              <div className="grid grid-cols-2 gap-4">
                {story.metrics.map((metric) => (
                  <div key={metric.label} className="rounded-xl border border-border/60 p-4 bg-card/70">
                    <div className="text-2xl font-display font-semibold">{metric.value}</div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground mt-1">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Built with the ICE GLOBAL  production team—staging, content, and operations in one playbook.
              </p>
              <Button asChild variant="hero" className="w-full">
                <Link to="/contact">Plan a showcase with us</Link>
              </Button>
            </div>

            <div className="rounded-2xl border border-border p-6 bg-card/80 space-y-3">
              <h3 className="text-lg font-display font-semibold">More partners</h3>
              <div className="flex flex-col gap-2">
                {brandHighlights
                  .filter((item) => item.slug !== brand.slug)
                  .map((item) => (
                    <Link
                      key={item.slug}
                      to={`/brands/${item.slug}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-card transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover border border-border/60"
                      />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.relationship}</div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default BrandDetail;

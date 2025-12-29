import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { FloatingNavbar } from "@/components/ui/floating-navbar";
import Footer from "@/components/Footer";
import { navItems } from "@/data/expo-data";
import { CheckCircle2, ArrowRight } from "lucide-react";

const SubmitSuccess = () => {
  const location = useLocation();
  const [content, setContent] = useState({
    badge: "Success",
    title: "Submission received",
    message: "Thanks! We received your submission.",
    primaryLabel: "Back to home",
    primaryHref: "/",
    secondaryLabel: "Contact us",
    secondaryHref: "/contact",
    note: "We typically respond within 1–2 business days.",
  });

  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE_URL || "";
    const load = async () => {
      try {
        const res = await fetch(`${base}/submit-success`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setContent((prev) => ({ ...prev, ...data }));
      } catch {
        // keep defaults
      }
    };
    load();
  }, []);

  const message = (location.state as any)?.message || content.message;
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <FloatingNavbar navItems={navItems} />
      <div className="flex-1 flex items-center justify-center px-4 pt-28 pb-16">
        <div className="relative max-w-2xl w-full">
          <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.12),transparent_40%),radial-gradient(circle_at_80%_30%,hsl(var(--secondary)/0.12),transparent_35%),radial-gradient(circle_at_50%_80%,hsl(var(--primary)/0.08),transparent_40%)] blur-3xl" />
          <div className="relative rounded-3xl border border-border/60 bg-card/80 backdrop-blur p-8 md:p-12 shadow-2xl shadow-primary/10 space-y-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-[0.2em]">
              <CheckCircle2 className="w-4 h-4" />
              {content.badge}
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight">{content.title}</h1>
            <p className="text-muted-foreground text-lg">{message}</p>
            <div className="grid sm:grid-cols-2 gap-3 justify-items-center">
              <Link
                to={content.primaryHref || "/"}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:translate-y-[-2px] transition-all w-full"
              >
                {content.primaryLabel} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={content.secondaryHref || "/contact"}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border hover:border-primary transition-colors w-full"
              >
                {content.secondaryLabel}
              </Link>
            </div>
            <div className="text-xs text-muted-foreground">{content.note}</div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default SubmitSuccess;

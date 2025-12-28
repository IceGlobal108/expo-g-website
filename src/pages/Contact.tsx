import { useState } from "react";
import { motion } from "framer-motion";
import { FloatingNavbar } from "@/components/ui/floating-navbar";
import { BackgroundBeams } from "@/components/ui/background-effects";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { navItems } from "@/data/expo-data";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const contactCards = [
  { icon: Mail, title: "Email", value: "hello@ICEglobal.com", hint: "We reply within one business day" },
  { icon: Phone, title: "Phone", value: "+91 98765 43210", hint: "Mon–Fri, 9:30 AM – 6:30 PM IST" },
  { icon: MapPin, title: "Studio", value: "Bangalore, India", hint: "Visit by appointment only" },
  { icon: Clock, title: "Turnaround", value: "2–3 days for proposals", hint: "Faster for returning partners" },
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });

  const handleChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production this would post to an API; for now just clear and show a toast.
    setForm({ name: "", email: "", company: "", message: "" });
    alert("Thanks! We received your note and will get back shortly.");
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <FloatingNavbar navItems={navItems} />

      <section className="relative overflow-hidden pt-28 md:pt-36 pb-14">
        <BackgroundBeams className="z-0" />
        <div className="container-custom relative z-10 grid lg:grid-cols-2 gap-10 items-end">
          <div className="space-y-5">
            <Badge variant="secondary" className="text-xs uppercase tracking-[0.25em]">
              Contact
            </Badge>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">
                Let's design your next <span className="text-gradient">show-stopping moment</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
                Tell us what you want to launch, celebrate, or showcase. We'll shape a tailored experience—stage, booth,
                VR zone, and media ops included.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline">Production + AV</Badge>
              <Badge variant="outline">Experience Design</Badge>
              <Badge variant="outline">Media & Streaming</Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {contactCards.map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-5"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
                <div className="relative space-y-2">
                  <card.icon className="w-5 h-5 text-primary" />
                  <div className="font-display font-semibold">{card.title}</div>
                  <div className="text-foreground">{card.value}</div>
                  <div className="text-xs text-muted-foreground">{card.hint}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold">Tell us about your goals</h2>
            <p className="text-muted-foreground">
              Share what success looks like—launch metrics, lead targets, or the vibe you want to create. We’ll respond
              with a tailored plan and a call slot.
            </p>
          </div>
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3 glass rounded-3xl border border-border/60 p-6 md:p-8 space-y-4"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Name</label>
                <Input value={form.name} onChange={handleChange("name")} placeholder="Your name" required />
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Company</label>
              <Input value={form.company} onChange={handleChange("company")} placeholder="Brand or organization" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Project details</label>
              <Textarea
                value={form.message}
                onChange={handleChange("message")}
                placeholder="Tell us about the experience you want to create, timelines, and goals."
                rows={4}
                required
              />
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <Button type="submit" variant="hero">
                Send message
              </Button>
              <p className="text-sm text-muted-foreground">We usually reply in 24–48 hours.</p>
            </div>
          </motion.form>
        </div>
      </section>

      <section className="section-padding bg-card/40 border-t border-border/60">
        <div className="container-custom grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-xl shadow-primary/10"
          >
            <h3 className="text-xl font-display font-semibold mb-3">How we work</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>• Discovery call to define goals and the feeling you want guests to have.</li>
              <li>• Experience blueprint: stage, booth, XR, wayfinding, lounges, and media ops.</li>
              <li>• Production plan with timelines, budgets, and measurement framework.</li>
              <li>• Onsite execution with live dashboards for dwell time, sentiment, and leads.</li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-card/70 to-secondary/10 p-6"
          >
            <h3 className="text-xl font-display font-semibold mb-3">What to bring</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Your brand story, launch goals, and any must-show products.</p>
              <p>• Target audience, expected footfall, and desired vibe (concert, lounge, gallery).</p>
              <p>• Timelines, budget range, and any existing assets (logos, media, 3D).</p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Contact;

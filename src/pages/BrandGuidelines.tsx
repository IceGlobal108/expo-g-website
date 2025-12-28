import { useState } from "react";
import { FloatingNavbar } from "@/components/ui/floating-navbar";
import Footer from "@/components/Footer";
import { navItems } from "@/data/expo-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const BrandGuidelines = () => {
  const [form, setForm] = useState({ name: "", email: "", company: "", intent: "" });

  const handleChange =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForm({ name: "", email: "", company: "", intent: "" });
    alert("Thanks! We'll share the brand guidelines and assets shortly.");
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <FloatingNavbar navItems={navItems} />

      <section className="container-custom pt-28 md:pt-36 pb-12 space-y-6">
        <Badge variant="secondary" className="text-xs uppercase tracking-[0.25em]">
          Brand assets
        </Badge>
        <h1 className="text-4xl md:text-5xl font-display font-bold">Brand Guidelines</h1>
        <p className="text-muted-foreground max-w-3xl">
          Request our logo kit, color values, and usage rules to keep every mention of INDIA GLOBAL EXPO consistent.
          Share how you plan to use our assets and we’ll send the latest toolkit.
        </p>
      </section>

      <section className="container-custom pb-16">
        <form
          onSubmit={handleSubmit}
          className="glass rounded-3xl border border-border/60 p-6 md:p-8 space-y-4 max-w-3xl"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Name</label>
              <Input value={form.name} onChange={handleChange("name")} required placeholder="Your name" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                required
                placeholder="you@company.com"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-2">Company</label>
            <Input value={form.company} onChange={handleChange("company")} placeholder="Brand or organization" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-2">How will you use our brand?</label>
            <Textarea
              value={form.intent}
              onChange={handleChange("intent")}
              required
              rows={4}
              placeholder="e.g., press release, co-marketing, social post, event signage."
            />
          </div>
          <div className="flex gap-3 items-center">
            <Button type="submit" variant="hero">
              Request guidelines
            </Button>
            <p className="text-sm text-muted-foreground">We reply within 1–2 business days.</p>
          </div>
        </form>
      </section>

      <Footer />
    </main>
  );
};

export default BrandGuidelines;

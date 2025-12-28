import { useState } from "react";
import { FloatingNavbar } from "@/components/ui/floating-navbar";
import Footer from "@/components/Footer";
import { navItems } from "@/data/expo-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Sponsor = () => {
  const [form, setForm] = useState({ name: "", email: "", company: "", budget: "", message: "" });

  const handleChange =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForm({ name: "", email: "", company: "", budget: "", message: "" });
    alert("Thanks for your interest in sponsoring. We'll contact you soon.");
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <FloatingNavbar navItems={navItems} />

      <section className="container-custom pt-28 md:pt-36 pb-12 space-y-6">
        <Badge variant="secondary" className="text-xs uppercase tracking-[0.25em]">
          Sponsorships
        </Badge>
        <h1 className="text-4xl md:text-5xl font-display font-bold">Sponsor an Event</h1>
        <p className="text-muted-foreground max-w-3xl">
          Put your brand at the center of the expo. Tell us your objectives and budget so we can tailor a sponsorship
          that delivers attention and ROI.
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
            <label className="text-sm text-muted-foreground block mb-2">Budget range</label>
            <Input
              value={form.budget}
              onChange={handleChange("budget")}
              placeholder="e.g., $25k–$75k"
              required
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-2">What do you want to achieve?</label>
            <Textarea
              value={form.message}
              onChange={handleChange("message")}
              required
              rows={4}
              placeholder="Share goals like reach, leads, categories, or specific placements."
            />
          </div>
          <div className="flex gap-3 items-center">
            <Button type="submit" variant="hero">
              Submit
            </Button>
            <p className="text-sm text-muted-foreground">We reply within 1–2 business days.</p>
          </div>
        </form>
      </section>

      <Footer />
    </main>
  );
};

export default Sponsor;

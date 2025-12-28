import { useState } from "react";
import { FloatingNavbar } from "@/components/ui/floating-navbar";
import Footer from "@/components/Footer";
import { navItems } from "@/data/expo-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Feedback = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    message: "",
    rating: "5",
  });

  const handleChange =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForm({ name: "", email: "", role: "", message: "", rating: "5" });
    alert("Thanks for your feedback! We appreciate your time.");
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <FloatingNavbar navItems={navItems} />

      <section className="container-custom pt-28 md:pt-36 pb-12 space-y-6">
        <Badge variant="secondary" className="text-xs uppercase tracking-[0.25em]">
          Feedback
        </Badge>
        <h1 className="text-4xl md:text-5xl font-display font-bold">Share your experience</h1>
        <p className="text-muted-foreground max-w-3xl">
          Tell us what you loved and what we can improve. Your input shapes the next INDIA GLOBAL EXPO.
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
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Role</label>
              <Input value={form.role} onChange={handleChange("role")} placeholder="Attendee, partner, sponsor..." />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Rating</label>
              <select
                value={form.rating}
                onChange={handleChange("rating")}
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r.toString()}>
                    {r} - {r === 5 ? "Excellent" : r === 1 ? "Poor" : "Good"}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-2">Feedback</label>
            <Textarea
              value={form.message}
              onChange={handleChange("message")}
              placeholder="Share highlights, suggestions, or issues you faced."
              rows={4}
              required
            />
          </div>
          <div className="flex gap-3 items-center">
            <Button type="submit" variant="hero">
              Submit feedback
            </Button>
            <p className="text-sm text-muted-foreground">We read every response.</p>
          </div>
        </form>
      </section>

      <Footer />
    </main>
  );
};

export default Feedback;

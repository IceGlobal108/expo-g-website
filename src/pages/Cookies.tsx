import { Link } from "react-router-dom";
import { FloatingNavbar } from "@/components/ui/floating-navbar";
import Footer from "@/components/Footer";
import { navItems } from "@/data/expo-data";

const Cookies = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <FloatingNavbar navItems={navItems} />

      <section className="container-custom pt-28 md:pt-36 pb-12 space-y-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">Legal</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold">Cookie Policy</h1>
          <p className="text-muted-foreground max-w-3xl">
            This policy explains how we use cookies and similar technologies on our site.
          </p>
        </div>

        <div className="space-y-6 max-w-4xl">
          <section className="space-y-2">
            <h2 className="text-xl font-display font-semibold">What are cookies?</h2>
            <p className="text-muted-foreground">
              Cookies are small text files stored on your device to improve site experience and remember preferences.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-display font-semibold">How we use cookies</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Essential: to keep the site functioning (navigation, forms).</li>
              <li>Analytics: to understand traffic and improve content.</li>
              <li>Preferences: to remember language/theme choices.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-display font-semibold">Managing cookies</h2>
            <p className="text-muted-foreground">
              You can adjust browser settings to block or delete cookies. Some features may not work without essential cookies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-display font-semibold">Third-party cookies</h2>
            <p className="text-muted-foreground">
              Services like analytics or media embeds may set their own cookies. Review their policies for details.
            </p>
          </section>

          <p className="text-xs text-muted-foreground">Last updated: 2024</p>
        </div>

        <Link to="/" className="inline-flex text-primary hover:text-primary/80 text-sm">Back to home</Link>
      </section>

      <Footer />
    </main>
  );
};

export default Cookies;

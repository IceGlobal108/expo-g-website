import { Link } from "react-router-dom";
import { FloatingNavbar } from "@/components/ui/floating-navbar";
import Footer from "@/components/Footer";
import { navItems } from "@/data/expo-data";

const Terms = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <FloatingNavbar navItems={navItems} />

      <section className="container-custom pt-28 md:pt-36 pb-12 space-y-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">Legal</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold">Terms of Service</h1>
          <p className="text-muted-foreground max-w-3xl">
            These terms govern your use of our website and services. By accessing the site, you agree to these terms.
          </p>
        </div>

        <div className="space-y-6 max-w-4xl">
          <section className="space-y-2">
            <h2 className="text-xl font-display font-semibold">Use of the site</h2>
            <p className="text-muted-foreground">
              You may browse and use the site for lawful purposes. Do not disrupt, attempt to breach security, or misuse content.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-display font-semibold">Content & IP</h2>
            <p className="text-muted-foreground">
              All branding, media, and copy are owned by India Global Expo or our partners. Do not reproduce without permission.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-display font-semibold">Links to third parties</h2>
            <p className="text-muted-foreground">
              External links are provided for convenience. We are not responsible for third-party content or practices.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-display font-semibold">Disclaimers</h2>
            <p className="text-muted-foreground">
              The site is provided “as is.” We do not guarantee uninterrupted access. To the extent permitted by law, we exclude liability for indirect or consequential damages.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-display font-semibold">Changes</h2>
            <p className="text-muted-foreground">
              We may update these terms. Continued use after changes means you accept the updated terms.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-display font-semibold">Governing law</h2>
            <p className="text-muted-foreground">
              These terms are governed by the laws of India. Disputes will be handled in Bangalore jurisdiction.
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

export default Terms;

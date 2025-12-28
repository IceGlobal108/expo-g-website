import { Link } from "react-router-dom";
import { FloatingNavbar } from "@/components/ui/floating-navbar";
import Footer from "@/components/Footer";
import { navItems } from "@/data/expo-data";

const Privacy = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <FloatingNavbar navItems={navItems} />

      <section className="container-custom pt-28 md:pt-36 pb-12 space-y-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">Legal</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground max-w-3xl">
            We respect your privacy. This policy explains what data we collect, how we use it, and the choices you have.
          </p>
        </div>

        <div className="space-y-6 max-w-4xl">
          <section className="space-y-2">
            <h2 className="text-xl font-display font-semibold">Information we collect</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Contact details you provide (name, email, company) via forms.</li>
              <li>Usage data (pages viewed, interactions) through analytics.</li>
              <li>Device and browser information (IP, user agent) for security and analytics.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-display font-semibold">How we use information</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>To respond to inquiries and manage event participation.</li>
              <li>To improve our site experience and content.</li>
              <li>To secure our services, prevent abuse, and comply with legal obligations.</li>
              <li>To send updates you opt into; you can opt out anytime.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-display font-semibold">Data sharing</h2>
            <p className="text-muted-foreground">
              We do not sell your data. We share it only with service providers who help us operate the site (hosting,
              analytics, email) under confidentiality terms, or when required by law.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-display font-semibold">Data retention</h2>
            <p className="text-muted-foreground">
              We keep data only as long as needed for the purposes above or to meet legal requirements. You can request
              deletion of your personal data unless we must keep it for legal reasons.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-display font-semibold">Your rights</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Access, correct, or delete your personal data.</li>
              <li>Withdraw consent for communications.</li>
              <li>Contact us to exercise these rights: <a href="mailto:privacy@indiaglobalexpo.com" className="text-primary">privacy@indiaglobalexpo.com</a>.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-display font-semibold">Contact</h2>
            <p className="text-muted-foreground">
              For privacy inquiries, email <a href="mailto:privacy@indiaglobalexpo.com" className="text-primary">privacy@indiaglobalexpo.com</a> or write to us at Bangalore, India.
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

export default Privacy;

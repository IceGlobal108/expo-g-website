import { useLocation, Link } from "react-router-dom";
import { FloatingNavbar } from "@/components/ui/floating-navbar";
import Footer from "@/components/Footer";
import { navItems } from "@/data/expo-data";

const SubmitError = () => {
  const location = useLocation();
  const message = (location.state as any)?.message || "We couldn’t submit your request. Please try again later.";
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <FloatingNavbar navItems={navItems} />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-xl">
          <p className="inline-flex px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-semibold uppercase tracking-[0.2em]">
            Error
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold">Submission failed</h1>
          <p className="text-muted-foreground">{message}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Go back
            </button>
            <Link to="/" className="px-4 py-2 rounded-lg border border-border hover:border-primary">
              Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default SubmitError;

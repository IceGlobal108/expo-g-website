import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FloatingNavbar } from "@/components/ui/floating-navbar";
import { BackgroundBeams } from "@/components/ui/background-effects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Lock, LogIn, ShieldCheck, User2 } from "lucide-react";
import { navItems } from "@/data/expo-data";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const apiBase = import.meta.env.VITE_API_BASE_URL || "";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch(`${apiBase}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Login failed");
      }
      const data = await res.json();
      localStorage.setItem("admin_access_token", data.accessToken);
      localStorage.setItem("admin_refresh_token", data.refreshToken);
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Unable to login right now");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <FloatingNavbar navItems={[...navItems, { name: "Admin", href: "/admin/login" }]} />
      <section className="relative pt-28 md:pt-32 pb-16 md:pb-20 overflow-hidden">
        <BackgroundBeams className="z-0" />
        <div className="container-custom relative z-10 max-w-3xl mx-auto">
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em]">
              <ShieldCheck className="w-4 h-4" />
              Admin Access
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold">Sign in to CMS</h1>
            <p className="text-muted-foreground">
              Secure access for ICE administrators. Use your issued credentials to manage content and approvals.
            </p>
          </div>

          <Card className="bg-card/80 border-border/70 shadow-2xl shadow-primary/10">
            <CardHeader>
              <CardTitle>Admin Login</CardTitle>
              <CardDescription>Authenticate to continue to the admin workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User2 className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
                    <Input
                      id="username"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-9"
                      placeholder="admin"
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg p-2.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  <LogIn className="w-4 h-4 mr-2" />
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default AdminLogin;

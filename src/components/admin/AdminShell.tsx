import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Sparkles } from "lucide-react";

interface AdminShellProps {
  sidebarTitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  nav: { key: string; label: string }[];
  active: string;
  onNavChange: (key: string) => void;
}

export const AdminShell = ({
  sidebarTitle = "Admin Control",
  actions,
  children,
  nav,
  active,
  onNavChange,
}: AdminShellProps) => {
  return (
    <div className="container-custom grid lg:grid-cols-[280px_1fr] gap-6 pb-12">
      <Card className="bg-card/80 border-border/70 p-4 space-y-4 h-fit">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">CMS</p>
            <p className="font-display font-semibold">{sidebarTitle}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {nav.map((item) => (
            <Button
              key={item.key}
              variant={active === item.key ? "secondary" : "ghost"}
              className={cn(
                "justify-start",
                active === item.key ? "border border-primary/30" : "border border-transparent"
              )}
              onClick={() => onNavChange(item.key)}
            >
              {item.label}
            </Button>
          ))}
        </div>
        <div className="rounded-xl border border-border/60 bg-card/60 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">Staging</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Preview changes on staging before publishing to the New Home page.
          </p>
          <Badge variant="outline" className="text-[11px] uppercase tracking-wide">
            Workspace: ICE New Home
          </Badge>
        </div>
      </Card>
      <div className="space-y-6">
        {actions && <div className="flex flex-wrap justify-between gap-3 items-center">{actions}</div>}
        {children}
      </div>
    </div>
  );
};

export default AdminShell;

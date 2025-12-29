import AdminLayout from "@/components/admin/AdminLayout";
import { adminNavLinks } from "@/data/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";

const homeSections = [
  { name: "Hero & Navigation", href: "/admin/hero", desc: "Hero content and navbar links." },
  { name: "Reviews / Moments", href: "/admin/reviews", desc: "Homepage reviews and testimonial carousel." },
  { name: "Brands Highlights", href: "/admin/brand-editor", desc: "Partner brands showcase and CTAs." },
  { name: "Celebrities", href: "/admin/celebrities", desc: "Celebrity highlights." },
  { name: "Gallery Highlights", href: "/admin/gallery", desc: "Hero gallery items and filters." },
  { name: "Entrance Arches", href: "/admin/arches", desc: "Arches content and CTA." },
  { name: "Stalls Mosaic", href: "/admin/stalls", desc: "Stalls imagery and stats." },
  { name: "VVIP Spotlight", href: "/admin/vvips", desc: "VVIP guests and CTA content." },
  { name: "Founders Spotlight", href: "/admin/founder-editor", desc: "Founders content and CTA." },
  { name: "Co-founders Spotlight", href: "/admin/cofounder-editor", desc: "Co-founders content and CTA." },
  { name: "Counts", href: "/admin/counts", desc: "Homepage stats strip." },
  { name: "Dual CTA", href: "/admin/dual-cta", desc: "Buyers & sellers dual CTA." },
  { name: "Dual CTA / Partner CTA", href: "/admin/partner", desc: "Partner CTA content." },
  { name: "Sponsor CTA", href: "/admin/sponsor", desc: "Sponsor CTA content." },
  { name: "Counts / Stats", href: "/admin/about", desc: "Homepage stats (counts) section." },
  { name: "Footer", href: "/admin/footer", desc: "Footer CTAs, links, and contact." },
];

const AdminHomeSections = () => {
  const navigate = useNavigate();
  return (
    <AdminLayout
      title="Home Section Management"
      description="Quick access to all homepage editors."
      navItems={adminNavLinks}
      sections={[{ id: "home-sections", label: "Home Sections" }]}
    >
      <Card id="home-sections" className="bg-card/70 border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Home Sections
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {homeSections.map((item) => (
            <div key={item.href} className="rounded-xl border border-border/50 bg-background/60 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{item.name}</div>
                <Badge variant="outline">Edit</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
              <Button variant="outline" className="w-full" onClick={() => navigate(item.href)}>
                Open
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminHomeSections;

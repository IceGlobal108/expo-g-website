import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminNavLinks } from "@/data/admin";
import BrandEditor, { type BrandsData, type BrandItem } from "@/components/admin/sections/BrandEditor";

const emptyBrands: BrandsData = {
  eyebrow: "",
  title: "",
  description: "",
  ctaLabel: "",
  ctaHref: "/brands",
  brands: [],
};

type BrandsResponse = {
  data: BrandItem[];
};

const AdminBrandEditor = () => {
  const base = import.meta.env.VITE_API_BASE_URL || "";
  const [data, setData] = useState<BrandsData>(emptyBrands);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("pageSize", "24");
      const res = await fetch(`${base}/brands?${params.toString()}`);
      const heroRes = await fetch(`${base}/brands/hero`);
      const payload = (await res.json()) as BrandsResponse;
      const hero = heroRes.ok ? await heroRes.json() : {};
      setData({
        eyebrow: hero?.badge || "",
        title: hero?.title || "",
        description: hero?.subtitle || "",
        ctaLabel: hero?.ctaLabel || "",
        ctaHref: hero?.ctaHref || "/brands",
        brands: payload?.data || [],
      });
    } catch {
      setData(emptyBrands);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminLayout
      title="Brand Highlights (Editor only)"
      description="Quick view of the Brand Highlights editor. Use Brand Management page to persist changes."
      navItems={adminNavLinks}
      sections={[{ id: "brands", label: "Brand Highlights" }]}
    >
      <div className="text-sm text-muted-foreground mb-4">
        This inline editor is for reference; saving/restoring is disabled. Go to Brand Management to persist changes.
      </div>
      <BrandEditor
        data={data}
        onChange={setData}
        onAddBrand={() =>
          setData({
            ...data,
            brands: [...(data.brands || []), { slug: "", name: "", logo: "", relationship: "", category: "", image: "" }],
          })
        }
        onRemoveBrand={(idx) => setData({ ...data, brands: (data.brands || []).filter((_, i) => i !== idx) })}
        onSave={() => {}}
        onRestore={() => load()}
        saving={false}
        loading={loading}
      />
    </AdminLayout>
  );
};

export default AdminBrandEditor;

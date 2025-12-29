import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminNavLinks } from "@/data/admin";
import HeroEditor, { type HeroContent, type HeroItem, type NavItem } from "@/components/admin/sections/HeroEditor";

const emptyContent: HeroContent = { title: "", subtitle: "", description: "" };

const AdminHero = () => {
  const base = import.meta.env.VITE_API_BASE_URL || "";
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [heroItems, setHeroItems] = useState<HeroItem[]>([]);
  const [heroContent, setHeroContent] = useState<HeroContent>(emptyContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("admin_refresh_token");
    if (!refreshToken) return null;
    const res = await fetch(`${base}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      localStorage.removeItem("admin_access_token");
      localStorage.removeItem("admin_refresh_token");
      return null;
    }
    const tokenData = await res.json();
    if (tokenData.accessToken) {
      localStorage.setItem("admin_access_token", tokenData.accessToken);
      return tokenData.accessToken as string;
    }
    return null;
  };

  const getAccessToken = async () => {
    const token = localStorage.getItem("admin_access_token");
    if (token) return token;
    return refreshAccessToken();
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${base}/hero`);
      if (!res.ok) throw new Error("Failed to load hero");
      const payload = await res.json();
      setNavItems(payload?.navItems || []);
      setHeroItems(payload?.heroProducts || []);
      setHeroContent(payload?.heroContent || emptyContent);
    } catch {
      setNavItems([]);
      setHeroItems([]);
      setHeroContent(emptyContent);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Not authenticated");
      const attempt = async (authToken: string | null) =>
        fetch(`${base}/hero`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
          body: JSON.stringify({ navItems, heroProducts: heroItems, heroContent }),
        });
      let res = await attempt(token);
      if (res && res.status === 401) {
        const refreshed = await refreshAccessToken();
        res = await attempt(refreshed);
      }
      if (!res || !res.ok) throw new Error("Save failed");
      await load();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const restore = async () => {
    setSaving(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Not authenticated");
      await fetch(`${base}/hero/restore`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      await load();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Hero & Navigation"
      description="Manage homepage hero content and navigation items."
      navItems={adminNavLinks}
      sections={[{ id: "hero", label: "Hero" }]}
    >
      <HeroEditor
        navItems={navItems}
        heroItems={heroItems}
        heroContent={heroContent}
        onNavChange={(idx, key, value) => {
          const next = [...navItems];
          next[idx] = { ...next[idx], [key]: value };
          setNavItems(next);
        }}
        onNavAdd={() => setNavItems([...navItems, { name: "", href: "/" }])}
        onNavRemove={(idx) => setNavItems(navItems.filter((_, i) => i !== idx))}
        onHeroChange={(idx, key, value) => {
          const next = [...heroItems];
          next[idx] = { ...next[idx], [key]: value };
          setHeroItems(next);
        }}
        onHeroAdd={() => setHeroItems([...heroItems, { title: "", link: "", thumbnail: "" }])}
        onHeroRemove={(idx) => setHeroItems(heroItems.filter((_, i) => i !== idx))}
        onHeroContentChange={(key, value) => setHeroContent({ ...heroContent, [key]: value })}
        onSave={save}
        onRestore={restore}
        saving={saving}
        loading={loading}
      />
    </AdminLayout>
  );
};

export default AdminHero;

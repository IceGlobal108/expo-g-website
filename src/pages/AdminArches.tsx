import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminNavLinks } from "@/data/admin";
import ArchesEditor, { type ArchesData } from "@/components/admin/sections/ArchesEditor";

const emptyArches: ArchesData = {
  eyebrow: "",
  title: "",
  description: "",
  ctaLabel: "",
  ctaHref: "",
  arches: [],
};

const AdminArches = () => {
  const base = import.meta.env.VITE_API_BASE_URL || "";
  const [data, setData] = useState<ArchesData>(emptyArches);
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
      const res = await fetch(`${base}/arches`);
      if (!res.ok) throw new Error("Failed to load arches");
      const payload = await res.json();
      setData({ ...emptyArches, ...(payload || {}), arches: payload?.arches || [] });
    } catch {
      setData(emptyArches);
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
        fetch(`${base}/arches`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
          body: JSON.stringify(data),
        });
      let res = await attempt(token);
      if (res && res.status === 401) {
        const refreshed = await refreshAccessToken();
        res = await attempt(refreshed);
      }
      if (!res || !res.ok) throw new Error("Save failed");
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
      await fetch(`${base}/arches/restore`, {
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
      title="Entrance Arches"
      description="Manage mega entrance arches content."
      navItems={adminNavLinks}
      sections={[{ id: "arches", label: "Arches" }]}
    >
      <ArchesEditor
        data={data}
        onChange={setData}
        onAdd={() =>
          setData((prev) => ({
            ...prev,
            arches: [...(prev.arches || []), { city: "", year: "", highlight: "", image: "", href: "" }],
          }))
        }
        onRemove={(idx) =>
          setData((prev) => ({
            ...prev,
            arches: (prev.arches || []).filter((_, i) => i !== idx),
          }))
        }
        onSave={save}
        onRestore={restore}
        saving={saving}
        loading={loading}
      />
    </AdminLayout>
  );
};

export default AdminArches;

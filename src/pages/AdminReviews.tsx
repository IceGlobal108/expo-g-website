import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminNavLinks } from "@/data/admin";
import ReviewEditor, { type ReviewData } from "@/components/admin/sections/ReviewEditor";

const emptyReview: ReviewData = {
  eyebrow: "",
  title: "",
  description: "",
  ctaLabel: "",
  ctaHref: "",
  images: [],
};

const AdminReviews = () => {
  const base = import.meta.env.VITE_API_BASE_URL || "";
  const [data, setData] = useState<ReviewData>(emptyReview);
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
      const res = await fetch(`${base}/review`);
      if (!res.ok) throw new Error("Failed to load review");
      const payload = await res.json();
      setData({ ...emptyReview, ...(payload || {}) });
    } catch {
      setData(emptyReview);
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
        fetch(`${base}/review`, {
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
      await fetch(`${base}/review/restore`, {
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
      title="Reviews / Moments"
      description="Manage the What is ICE Exhibitions (Infographics & Photos) section."
      navItems={adminNavLinks}
      sections={[{ id: "reviews", label: "Reviews" }]}
    >
      <ReviewEditor data={data} onChange={setData} onSave={save} onRestore={restore} saving={saving} loading={loading} />
    </AdminLayout>
  );
};

export default AdminReviews;

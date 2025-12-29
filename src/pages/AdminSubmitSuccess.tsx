import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminNavLinks } from "@/data/admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Save } from "lucide-react";

type SuccessPayload = {
  badge: string;
  title: string;
  message: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  note: string;
};

const defaultPayload: SuccessPayload = {
  badge: "Success",
  title: "Submission received",
  message: "Thanks! We received your submission.",
  primaryLabel: "Back to home",
  primaryHref: "/",
  secondaryLabel: "Contact us",
  secondaryHref: "/contact",
  note: "We typically respond within 1–2 business days.",
};

const AdminSubmitSuccess = () => {
  const [data, setData] = useState<SuccessPayload>(defaultPayload);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const base = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${base}/submit-success`);
        if (!res.ok) throw new Error("Failed to load");
        const payload = await res.json();
        setData({ ...defaultPayload, ...(payload || {}) });
      } catch (err: any) {
        setError(err.message || "Unable to load");
        setData(defaultPayload);
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const save = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Not authenticated.");
      const attempt = async (authToken: string | null) =>
        fetch(`${base}/submit-success`, {
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
      setSuccess("Success page updated");
    } catch (err: any) {
      setError(err.message || "Unable to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Submit Success Page"
      description="Manage the copy and links shown after a successful form submission."
      navItems={adminNavLinks}
      sections={[{ id: "submit-success", label: "Submit Success" }]}
    >
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg p-3">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 rounded-lg p-3">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      <Card className="bg-card/70 border-border/60">
        <CardHeader>
          <CardTitle>Hero</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Badge</label>
              <Input value={data.badge} onChange={(e) => setData({ ...data, badge: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Title</label>
              <Input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Message</label>
            <Input value={data.message} onChange={(e) => setData({ ...data, message: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/70 border-border/60 mt-4">
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Primary label</label>
              <Input value={data.primaryLabel} onChange={(e) => setData({ ...data, primaryLabel: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Primary href</label>
              <Input value={data.primaryHref} onChange={(e) => setData({ ...data, primaryHref: e.target.value })} />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Secondary label</label>
              <Input value={data.secondaryLabel} onChange={(e) => setData({ ...data, secondaryLabel: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Secondary href</label>
              <Input value={data.secondaryHref} onChange={(e) => setData({ ...data, secondaryHref: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Note</label>
            <Input value={data.note} onChange={(e) => setData({ ...data, note: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-4">
        <Button onClick={save} disabled={saving || loading}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </AdminLayout>
  );
};

export default AdminSubmitSuccess;

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminNavLinks } from "@/data/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save } from "lucide-react";

type NotificationEvent = {
  key: string;
  title: string;
  description: string;
  enabled: boolean;
};

const AdminNotifications = () => {
  const base = import.meta.env.VITE_API_BASE_URL || "";
  const [events, setEvents] = useState<NotificationEvent[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${base}/notifications/settings`);
      if (!res.ok) throw new Error("Failed to load events");
      const payload = await res.json();
      setEvents(payload.data || []);
    } catch (err) {
      console.error(err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Not authenticated");
      const payload = {
        settings: events.map((e) => ({
          event: e.key,
          enabled: e.enabled,
        })),
      };
      const res = await fetch(`${base}/notifications/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Email notifications"
      description="Enable/disable platform emails and choose which template is used for each event."
      navItems={adminNavLinks}
      sections={[{ id: "notifications", label: "Events" }]}
    >
      <Card id="notifications" className="bg-card/70 border-border/60">
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Events</CardTitle>
            <CardDescription>All available events. No creation/removal — just toggle and pick a template.</CardDescription>
          </div>
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save settings
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading && <p className="text-sm text-muted-foreground">Loading events…</p>}
          {!loading &&
            events.map((event) => (
              <div
                key={event.key}
                className="flex flex-col md:flex-row md:items-center gap-3 p-3 rounded-lg border border-border/60 bg-muted/30"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{event.title}</CardTitle>
                  </div>
                  <CardDescription>{event.description}</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={event.enabled}
                    onCheckedChange={(val) =>
                      setEvents((prev) => prev.map((e) => (e.key === event.key ? { ...e, enabled: val } : e)))
                    }
                  />
                </div>
              </div>
            ))}
          {!loading && events.length === 0 && <p className="text-sm text-muted-foreground">No events found.</p>}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminNotifications;

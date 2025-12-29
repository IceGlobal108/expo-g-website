import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminNavLinks } from "@/data/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
  const [testing, setTesting] = useState<string | null>(null);
  const [testOpen, setTestOpen] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testEvent, setTestEvent] = useState<NotificationEvent | null>(null);
  const [placeholderJson, setPlaceholderJson] = useState("{\n  \"name\": \"Jane Doe\"\n}");

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

  const sendTest = async () => {
    if (!testEvent) return;
    const to = testEmail.trim();
    let placeholders: Record<string, string> = {};
    if (placeholderJson.trim()) {
      try {
        const parsed = JSON.parse(placeholderJson);
        if (typeof parsed === "object" && parsed !== null) {
          placeholders = parsed as Record<string, string>;
        }
      } catch (err) {
        alert("Placeholder JSON is invalid");
        return;
      }
    }
    setTesting(testEvent.key);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Not authenticated");
      const res = await fetch(`${base}/notifications/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ event: testEvent.key, to, placeholders }),
      });
      if (!res.ok) throw new Error("Test failed");
      setTestOpen(false);
      setTestEvent(null);
      setTestEmail("");
    } catch (err) {
      console.error(err);
    } finally {
      setTesting(null);
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTestEvent(event);
                      setTestOpen(true);
                    }}
                    disabled={!!testing}
                  >
                    {testing === event.key ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                    Test email
                  </Button>
                </div>
              </div>
            ))}
          {!loading && events.length === 0 && <p className="text-sm text-muted-foreground">No events found.</p>}
        </CardContent>
      </Card>
      <Dialog open={testOpen} onOpenChange={(open) => { setTestOpen(open); if (!open) { setTesting(null); setTestEmail(""); setTestEvent(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send test email</DialogTitle>
            <DialogDescription>
              Enter an email to receive a test for <strong>{testEvent?.title ?? "this event"}</strong>. Leave blank to use the default sender.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendTest();
            }}
            className="space-y-4"
          >
            <Input
              type="email"
              placeholder="you@example.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
            />
            <div>
              <p className="text-xs text-muted-foreground mb-1">Placeholder values (JSON)</p>
              <textarea
                className="w-full rounded-md border border-border/60 bg-background/60 p-2 text-sm font-mono min-h-[120px]"
                value={placeholderJson}
                onChange={(e) => setPlaceholderJson(e.target.value)}
              />
            </div>
            <DialogFooter className="justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setTestOpen(false)} disabled={!!testing}>
                Cancel
              </Button>
              <Button type="submit" disabled={!!testing}>
                {testing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Send test
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminNotifications;

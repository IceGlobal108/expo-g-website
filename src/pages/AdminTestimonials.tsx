import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminNavLinks } from "@/data/admin";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Plus, Save, Trash2, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MediaUploadModal, { type MediaUploadResult } from "@/components/admin/MediaUploadModal";
import { toast } from "@/components/ui/sonner";

type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  variants?: { key: string; path?: string; fileName?: string }[];
  rating: number;
  quote: string;
};

type Payload = {
  hero: {
    badge: string;
    title: string;
    intro: string;
    ctaLabel: string;
    ctaHref: string;
    ctaBadge: string;
    ctaTitle: string;
    ctaBody: string;
  };
  testimonials: Testimonial[];
};

const defaultPayload: Payload = {
  hero: {
    badge: "Voices",
    title: "Testimonials",
    intro: "What our partners, founders, and attendees say about INDIA GLOBAL EXPO. Animated stories from the floor to the main stage.",
    ctaLabel: "Send feedback",
    ctaHref: "/feedback",
    ctaBadge: "Share yours",
    ctaTitle: "Were you at the expo?",
    ctaBody: "Tell us what you loved, what you’d improve, and what you want to see next year. Your feedback shapes the next edition.",
  },
  testimonials: [],
};

const createId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `testimonial-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const AdminTestimonials = () => {
  const [data, setData] = useState<Payload>(defaultPayload);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [uploadTarget, setUploadTarget] = useState<number | null>(null);
  const [pendingDeletes, setPendingDeletes] = useState<string[]>([]);

  const base = import.meta.env.VITE_API_BASE_URL || "";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rating = ratingFilter === "all" ? null : Number(ratingFilter);
    const items = data.testimonials || [];
    const filteredItems = items.filter((t) => {
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.company.toLowerCase().includes(q) ||
        t.role.toLowerCase().includes(q) ||
        t.quote.toLowerCase().includes(q);
      const matchesRating = rating ? t.rating === rating : true;
      return matchesSearch && matchesRating;
    });
    const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;
    return {
      page: safePage,
      totalPages,
      total: filteredItems.length,
      items: filteredItems.slice(start, start + pageSize),
    };
  }, [data.testimonials, page, pageSize, ratingFilter, search]);

  const normalizeTestimonial = (t: Testimonial): Testimonial => ({
    ...t,
    variants: t.variants && t.variants.length ? t.variants : [{ key: "main", path: t.image }],
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${base}/testimonials`);
        if (!res.ok) throw new Error("Failed to load testimonials");
        const payload = (await res.json()) as Payload;
        setData({
          hero: { ...defaultPayload.hero, ...(payload.hero || {}) },
          testimonials: payload.testimonials?.length ? payload.testimonials.map(normalizeTestimonial) : [],
        });
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

  useEffect(() => {
    if (page > filtered.totalPages) {
      setPage(filtered.totalPages || 1);
    }
  }, [filtered.totalPages]);

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
      const attempt = async (authToken: string) =>
        fetch(`${base}/testimonials`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
          body: JSON.stringify(data),
        });
      let res = await attempt(token);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken();
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }
      if (!res.ok) throw new Error("Save failed");

      if (pendingDeletes.length) {
        const cleanup = await fetch(`${base}/media/delete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ paths: Array.from(new Set(pendingDeletes)), reason: "testimonial-image-replace" }),
        });
        if (!cleanup.ok) {
          toast.error("Some old images could not be queued for deletion");
        } else {
          setPendingDeletes([]);
        }
      }

      setSuccess("Testimonials updated");
    } catch (err: any) {
      setError(err.message || "Unable to save");
    } finally {
      setSaving(false);
    }
  };

  const addTestimonial = () =>
    setData((prev) => ({
      ...prev,
      testimonials: [
        ...prev.testimonials,
        { id: createId(), name: "", role: "", company: "", image: "", rating: 5, quote: "" },
      ],
    }));

  const updateTestimonial = (idx: number, key: keyof Testimonial, value: any) =>
    setData((prev) => {
      const testimonials = [...prev.testimonials];
      testimonials[idx] = { ...testimonials[idx], [key]: value };
      return { ...prev, testimonials };
    });

  const removeTestimonial = async (id: string) => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Not authenticated.");
      const attempt = async (authToken: string | null) =>
        fetch(`${base}/testimonials/${id}`, {
          method: "DELETE",
          headers: {
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
        });
      let res = await attempt(token);
      if (res && res.status === 401) {
        const refreshed = await refreshAccessToken();
        res = await attempt(refreshed);
      }
      if (!res || !res.ok) throw new Error("Delete failed");
      setData((prev) => ({ ...prev, testimonials: prev.testimonials.filter((t) => t.id !== id) }));
      setSuccess("Testimonial deleted");
    } catch (err: any) {
      setError(err.message || "Unable to delete testimonial");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Testimonials Management"
      description="Edit testimonials hero and individual quotes."
      navItems={adminNavLinks}
      sections={[{ id: "testimonials", label: "Testimonials" }]}
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
            <Input
              value={data.hero.badge}
              onChange={(e) => setData({ ...data, hero: { ...data.hero, badge: e.target.value } })}
              placeholder="Badge"
            />
            <Input
              value={data.hero.title}
              onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })}
              placeholder="Title"
            />
          </div>
          <Textarea
            value={data.hero.intro}
            rows={3}
            onChange={(e) => setData({ ...data, hero: { ...data.hero, intro: e.target.value } })}
            placeholder="Intro"
          />
          <div className="grid md:grid-cols-2 gap-3">
            <Input
              value={data.hero.ctaLabel}
              onChange={(e) => setData({ ...data, hero: { ...data.hero, ctaLabel: e.target.value } })}
              placeholder="CTA label"
            />
            <Input
              value={data.hero.ctaHref}
              onChange={(e) => setData({ ...data, hero: { ...data.hero, ctaHref: e.target.value } })}
              placeholder="CTA href"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <Input
              value={data.hero.ctaBadge}
              onChange={(e) => setData({ ...data, hero: { ...data.hero, ctaBadge: e.target.value } })}
              placeholder="CTA badge"
            />
            <Input
              value={data.hero.ctaTitle}
              onChange={(e) => setData({ ...data, hero: { ...data.hero, ctaTitle: e.target.value } })}
              placeholder="CTA title"
            />
          </div>
          <Textarea
            value={data.hero.ctaBody}
            rows={2}
            onChange={(e) => setData({ ...data, hero: { ...data.hero, ctaBody: e.target.value } })}
            placeholder="CTA body"
          />
        </CardContent>
      </Card>

      <Card className="bg-card/70 border-border/60">
        <CardHeader>
          <CardTitle>Testimonials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, company, quote"
                className="pl-9"
              />
            </div>
            <Select value={ratingFilter} onValueChange={(v) => setRatingFilter(v)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ratings</SelectItem>
                {[5, 4, 3, 2, 1].map((r) => (
                  <SelectItem key={r} value={String(r)}>
                    {r} stars
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
              Page {filtered.page} / {filtered.totalPages} • {filtered.total} items
              <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[6, 12, 24, 48].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size} / page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="ghost" disabled={filtered.page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  Prev
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={filtered.page >= filtered.totalPages}
                  onClick={() => setPage((p) => Math.min(filtered.totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>

          {filtered.items.map((t) => {
            const idx = data.testimonials.findIndex((item) => item.id === t.id);
            return (
              <div key={t.id} className="border border-border/60 rounded-xl p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <Input
                    value={t.name}
                    onChange={(e) => updateTestimonial(idx, "name", e.target.value)}
                    placeholder="Name"
                    className="font-semibold"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeTestimonial(t.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 gap-2">
                  <Input value={t.role} onChange={(e) => updateTestimonial(idx, "role", e.target.value)} placeholder="Role" />
                  <Input value={t.company} onChange={(e) => updateTestimonial(idx, "company", e.target.value)} placeholder="Company" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-muted-foreground">Image path (auto-filled)</label>
                    <Button variant="secondary" size="sm" onClick={() => setUploadTarget(idx)}>
                      Upload
                    </Button>
                  </div>
                  <Input value={t.image} readOnly placeholder="Upload to fill automatically" />
                  <div className="grid md:grid-cols-3 gap-2 mt-2">
                    {(t.variants ?? []).map((variant, vIdx) => (
                      <div key={`${variant.key}-${vIdx}`} className="space-y-1">
                        <label className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="inline-flex h-5 px-2 rounded bg-muted text-[11px] uppercase tracking-wide">{variant.key}</span>
                          <span>Path</span>
                        </label>
                        <Input value={variant.path || variant.fileName || ""} readOnly />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid md:grid-cols-[1fr,auto] gap-2 items-center">
                  <Textarea value={t.quote} rows={2} onChange={(e) => updateTestimonial(idx, "quote", e.target.value)} placeholder="Quote" />
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    value={t.rating}
                    onChange={(e) => updateTestimonial(idx, "rating", Number(e.target.value))}
                    className="w-24"
                  />
                </div>
              </div>
            );
          })}
          {!filtered.items.length && <p className="text-sm text-muted-foreground">No testimonials yet.</p>}
          <div className="flex justify-end">
            <Button variant="outline" onClick={addTestimonial}>
              <Plus className="w-4 h-4 mr-2" />
              Add testimonial
            </Button>
            <Button className="ml-2" onClick={save} disabled={saving || loading}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save all"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <MediaUploadModal
        open={uploadTarget !== null}
        onOpenChange={(open) => {
          if (!open) setUploadTarget(null);
        }}
        onUploaded={(result: MediaUploadResult) => {
          if (uploadTarget === null) return;
          const prevVariants = data.testimonials[uploadTarget]?.variants || [];
          const prevPaths = prevVariants.map((v) => v.path || v.fileName).filter(Boolean) as string[];
          const mainVariant = result.variants.find((v) => v.key === "main") ?? result.variants[0];
          const imagePath = mainVariant?.path || mainVariant?.fileName || data.testimonials[uploadTarget].image;
          setData((prev) => {
            const next = { ...prev };
            next.testimonials = [...prev.testimonials];
            next.testimonials[uploadTarget] = {
              ...next.testimonials[uploadTarget],
              image: imagePath,
              variants: result.variants,
            };
            return next;
          });
          setPendingDeletes((prev) => [...prev, ...prevPaths]);
          setUploadTarget(null);
        }}
      />
    </AdminLayout>
  );
};

export default AdminTestimonials;

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminNavLinks } from "@/data/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart3, Gauge, LineChart as LineChartIcon, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type TimePoint = { date: string; count: number };
type GallerySummary = {
  totalItems: number;
  likes: number;
  comments: number;
  byCategory: { category: string; count: number }[];
  byYear: { year: string; count: number }[];
  topTags: { tag: string; count: number }[];
};

type EngagementRow = { id: string; title: string; likes: number; comments: number };

const AdminAnalytics = () => {
  const base = import.meta.env.VITE_API_BASE_URL || "";
  const navigate = useNavigate();
  const [range, setRange] = useState("30");
  const [formsSeries, setFormsSeries] = useState<TimePoint[]>([]);
  const [commentSeries, setCommentSeries] = useState<TimePoint[]>([]);
  const [gallerySummary, setGallerySummary] = useState<GallerySummary | null>(null);
  const [engagement, setEngagement] = useState<EngagementRow[]>([]);
  const [userStats, setUserStats] = useState<{ total: number; today: number; last7d: number; last30d: number }>({
    total: 0,
    today: 0,
    last7d: 0,
    last30d: 0,
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState<{
    id: string;
    title: string;
    year?: string;
    category?: string;
    brand?: string;
    tags?: string[];
    excerpt?: string;
    article?: { heading?: string; body?: string }[];
    image?: string;
  } | null>(null);

  const chartRangeLabel = useMemo(() => {
    switch (range) {
      case "7":
        return "Last 7 days";
      case "90":
        return "Last 90 days";
      default:
        return "Last 30 days";
    }
  }, [range]);

  const mergedEngagementSeries = useMemo(() => {
    const map = new Map<string, { date: string; forms: number; comments: number }>();
    formsSeries.forEach((p) => {
      map.set(p.date, { date: p.date, forms: p.count, comments: 0 });
    });
    commentSeries.forEach((p) => {
      const existing = map.get(p.date);
      if (existing) {
        existing.comments = p.count;
      } else {
        map.set(p.date, { date: p.date, forms: 0, comments: p.count });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [formsSeries, commentSeries]);

  const loadDetail = async (id: string) => {
    setDetailLoading(true);
    setOpen(true);
    try {
      const res = await fetch(`${base}/gallery/${id}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setDetail({
        id,
        title: data.title || id,
        year: data.year,
        category: data.category,
        brand: data.brand,
        tags: data.tags || [],
        excerpt: data.excerpt,
        article: data.article || [],
        image: data.image,
      });
    } catch {
      setDetail({
        id,
        title: "Unable to load item",
      });
    } finally {
      setDetailLoading(false);
    }
  };

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
      navigate("/admin/login", { replace: true });
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

  const handle401 = () => {
    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("admin_refresh_token");
    navigate("/admin/login", { replace: true });
  };

  const load = async () => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("No token");
      const commonHeaders = { Authorization: `Bearer ${token}` };
      const [formsRes, commentsRes, summaryRes, engagementRes, usersRes] = await Promise.all([
        fetch(`${base}/admin/analytics/timeseries?kind=forms&days=${range}&tz=UTC`, { headers: commonHeaders }),
        fetch(`${base}/admin/analytics/timeseries?kind=comments&days=${range}&tz=UTC`, { headers: commonHeaders }),
        fetch(`${base}/admin/analytics/gallery-summary`, { headers: commonHeaders }),
        fetch(`${base}/admin/analytics/gallery-engagement?limit=5&sort=likes`, { headers: commonHeaders }),
        fetch(`${base}/admin/analytics/users`, { headers: commonHeaders }),
      ]);
      if ([formsRes, commentsRes, summaryRes, engagementRes, usersRes].some((r) => r.status === 401)) {
        handle401();
        return;
      }
      const [formsData, commentsData, summaryData, engagementData, usersData] = await Promise.all([
        formsRes.ok ? formsRes.json() : { points: [] },
        commentsRes.ok ? commentsRes.json() : { points: [] },
        summaryRes.ok ? summaryRes.json() : null,
        engagementRes.ok ? engagementRes.json() : { data: [] },
        usersRes.ok ? usersRes.json() : { total: 0, today: 0, last7d: 0, last30d: 0 },
      ]);
      setFormsSeries(formsData.points || []);
      setCommentSeries(commentsData.points || []);
      setGallerySummary(summaryData);
      setEngagement(engagementData.data || []);
      setUserStats({
        total: usersData.total || 0,
        today: usersData.today || 0,
        last7d: usersData.last7d || 0,
        last30d: usersData.last30d || 0,
      });
    } catch (err) {
      console.error(err);
      setFormsSeries([]);
      setCommentSeries([]);
      setGallerySummary(null);
      setEngagement([]);
      setUserStats({ total: 0, today: 0, last7d: 0, last30d: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  return (
    <AdminLayout
      title="Analytics"
      description="Operational view of engagement, leads, and audience."
      navItems={adminNavLinks}
      sections={[
        { id: "overview", label: "Overview" },
        { id: "engagement", label: "Engagement" },
        { id: "forms", label: "Forms" },
      ]}
    >
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 shadow-lg">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-sm font-medium text-foreground">Loading analytics...</span>
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Visualise key KPIs</p>
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-primary to-primary/40" />
        </div>
        <Select value={range} onValueChange={(v) => setRange(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div id="overview" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-gradient-to-br from-card to-muted/30 border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Gauge className="w-4 h-4" /> Gallery items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-semibold">{gallerySummary?.totalItems ?? (loading ? "…" : 0)}</div>
            <p className="text-xs text-muted-foreground">Across categories</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-muted/30 border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Gauge className="w-4 h-4" /> Likes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-semibold">{gallerySummary?.likes ?? (loading ? "…" : 0)}</div>
            <p className="text-xs text-muted-foreground">Buffered + stored</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-muted/30 border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Gauge className="w-4 h-4" /> Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-semibold">{gallerySummary?.comments ?? (loading ? "…" : 0)}</div>
            <p className="text-xs text-muted-foreground">All-time</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-muted/30 border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" /> Registered users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-semibold">{userStats.total}</div>
            <div className="text-xs text-muted-foreground flex gap-2">
              <span>Today {userStats.today}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>7d {userStats.last7d}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>30d {userStats.last30d}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div id="engagement" className="grid gap-4 mt-8">
        <Card className="bg-card/70 border-border/60 shadow-sm">
          <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <CardTitle className="flex items-center gap-2">
              <LineChartIcon className="w-4 h-4" /> Engagement velocity
            </CardTitle>
            <Badge variant="outline">{chartRangeLabel}</Badge>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mergedEngagementSeries}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="forms" name="Form submissions" stroke="#2563eb" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="comments" name="Comments" stroke="#f97316" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/70 border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Top performing gallery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {engagement.length === 0 && <p className="text-sm text-muted-foreground">No engagement yet.</p>}
            {engagement.map((item) => (
              <div key={item.id} className="rounded-lg border border-border/60 p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{item.title}</div>
                  <Badge variant="secondary">#{item.id}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Likes</span>
                  <span className="font-semibold text-foreground">{item.likes}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Comments</span>
                  <span className="font-semibold text-foreground">{item.comments}</span>
                </div>
                <Button variant="ghost" size="sm" className="mt-1" onClick={() => loadDetail(item.id)}>
                  View item
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div id="forms" className="grid gap-4 mt-8 lg:grid-cols-2">
        <Card className="bg-card/70 border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChartIcon className="w-4 h-4" /> Forms over time
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formsSeries}>
                <defs>
                  <linearGradient id="formsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#22c55e" fill="url(#formsGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-card/70 border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChartIcon className="w-4 h-4" /> Comments over time
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={commentSeries}>
                <defs>
                  <linearGradient id="commentsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#f97316" fill="url(#commentsGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 mt-8 lg:grid-cols-2">
        <Card className="bg-card/70 border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {gallerySummary?.byCategory?.length ? (
              gallerySummary.byCategory.map((cat) => (
                <div key={cat.category} className="flex items-center justify-between text-sm">
                  <span>{cat.category}</span>
                  <Badge variant="secondary">{cat.count}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No category data yet.</p>
            )}
          </CardContent>
        </Card>
        <Card className="bg-card/70 border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle>Top tags</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {gallerySummary?.topTags?.length ? (
              gallerySummary.topTags.map((tag) => (
                <Badge key={tag.tag} variant="outline">
                  {tag.tag} · {tag.count}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No tag data yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{detail?.title || "Gallery item"}</DialogTitle>
            <DialogDescription>
              {detail?.brand && <span className="mr-2">Brand · {detail.brand}</span>}
              {detail?.category && <span className="mr-2">Category · {detail.category}</span>}
              {detail?.year && <span>Year · {detail.year}</span>}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {detailLoading && <p className="text-sm text-muted-foreground">Loading details...</p>}
            {!detailLoading && detail?.excerpt && <p className="text-sm text-foreground">{detail.excerpt}</p>}
            {!detailLoading && detail?.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {detail.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}
            {!detailLoading && detail?.article?.length ? (
              <ScrollArea className="h-64 rounded-md border border-border/60 p-3">
                <div className="space-y-2">
                  {detail.article.map((a, idx) => (
                    <div key={`${a.heading}-${idx}`} className="space-y-1">
                      {a.heading && <div className="font-semibold">{a.heading}</div>}
                      {a.body && <p className="text-sm text-muted-foreground">{a.body}</p>}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : null}
            {!detailLoading && detail?.image && (
              <div className="rounded-lg overflow-hidden border border-border/60">
                <img src={detail.image} alt={detail.title} className="w-full h-48 object-cover" />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminAnalytics;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminNavLinks } from "@/data/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, EyeOff, Eye, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type CommentRow = {
  id: string;
  itemId: string;
  itemTitle?: string;
  message: string;
  date: string;
  author?: string;
  hidden?: boolean;
};

const AdminComments = () => {
  const base = import.meta.env.VITE_API_BASE_URL || "";
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rows, setRows] = useState<CommentRow[]>([]);
  const [search, setSearch] = useState("");
  const [itemId, setItemId] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [cursor, setCursor] = useState<string | null>(null);
  const [next, setNext] = useState<string | null>(null);
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
      if (res.status === 401) {
        localStorage.removeItem("admin_access_token");
        localStorage.removeItem("admin_refresh_token");
        toast({ title: "Session expired", description: "Please sign in again.", variant: "destructive" });
        navigate("/admin/login", { replace: true });
        return null;
      }
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

  const load = async (reset = false) => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Not authenticated");
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (itemId.trim()) params.set("itemId", itemId.trim());
      if (start) params.set("start", start);
      if (end) params.set("end", end);
      if (!reset && cursor) params.set("cursor", cursor);
      const res = await fetch(`${base}/admin/comments?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("admin_access_token");
        localStorage.removeItem("admin_refresh_token");
        toast({ title: "Session expired", description: "Please sign in again.", variant: "destructive" });
        navigate("/admin/login", { replace: true });
        return;
      }
      if (!res.ok) throw new Error("Load failed");
      const data = await res.json();
      setRows(reset ? data.data || [] : [...rows, ...(data.data || [])]);
      setNext(data.cursor?.next || null);
      setCursor(reset ? data.cursor?.next || null : data.cursor?.next || null);
    } catch (err) {
      console.error(err);
      setRows(reset ? [] : rows);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilters = () => {
    setCursor(null);
    load(true);
  };

  const toggleHidden = async (id: string, hidden: boolean) => {
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Not authenticated");
      const res = await fetch(`${base}/admin/comments/${id}/hide`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ hidden: !hidden }),
      });
      if (res.status === 401) {
        localStorage.removeItem("admin_access_token");
        localStorage.removeItem("admin_refresh_token");
        toast({ title: "Session expired", description: "Please sign in again.", variant: "destructive" });
        navigate("/admin/login", { replace: true });
        return;
      }
      if (!res.ok) throw new Error("Toggle failed");
      setRows((prev) => prev.map((c) => (c.id === id ? { ...c, hidden: !hidden } : c)));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteComment = async (id: string) => {
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Not authenticated");
      const res = await fetch(`${base}/admin/comments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("admin_access_token");
        localStorage.removeItem("admin_refresh_token");
        toast({ title: "Session expired", description: "Please sign in again.", variant: "destructive" });
        navigate("/admin/login", { replace: true });
        return;
      }
      if (!res.ok) throw new Error("Delete failed");
      setRows((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout
      title="Comments moderation"
      description="Review, hide, or delete gallery comments across the platform."
      navItems={adminNavLinks}
      sections={[{ id: "comments", label: "Comments" }]}
    >
      <Card id="comments" className="bg-card/70 border-border/60">
        <CardHeader>
          <CardTitle>Comments</CardTitle>
          <CardDescription>Search, filter by gallery item, and moderate visibility.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-5 gap-3">
            <Input placeholder="Search text" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Input placeholder="Gallery ID" value={itemId} onChange={(e) => setItemId(e.target.value)} />
            <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
            <Button onClick={applyFilters} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Apply
            </Button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border/60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Message</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[160px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="max-w-xs">
                      <div className="text-sm text-foreground">{c.message}</div>
                      <div className="text-xs text-muted-foreground">by {c.author || "user"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{c.itemTitle || c.itemId}</div>
                      <div className="text-xs text-muted-foreground">{c.itemId}</div>
                    </TableCell>
                    <TableCell>{new Date(c.date).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={c.hidden ? "outline" : "default"}>{c.hidden ? "Hidden" : "Visible"}</Badge>
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => toggleHidden(c.id, !!c.hidden)}>
                        {c.hidden ? <Eye className="w-4 h-4 mr-1" /> : <EyeOff className="w-4 h-4 mr-1" />}
                        {c.hidden ? "Unhide" : "Hide"}
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteComment(c.id)}>
                        <Trash className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!rows.length && !loading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No comments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => load()} disabled={loading || !next}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {next ? "Load more" : "No more"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminComments;

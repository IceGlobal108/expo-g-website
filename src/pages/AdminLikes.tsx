import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminNavLinks } from "@/data/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type LikeRow = {
  user: string;
  itemId: string;
};

const AdminLikes = () => {
  const base = import.meta.env.VITE_API_BASE_URL || "";
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rows, setRows] = useState<LikeRow[]>([]);
  const [itemId, setItemId] = useState("");
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
    if (!itemId.trim()) {
      setRows([]);
      return;
    }
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Not authenticated");
      const params = new URLSearchParams();
      params.set("limit", "50");
      if (!reset && cursor) params.set("cursor", cursor);
      const res = await fetch(`${base}/admin/gallery/${itemId.trim()}/likes?${params.toString()}`, {
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
      if (reset) setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    setCursor(null);
    load(true);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminLayout
      title="Likes"
      description="See which users liked a gallery item."
      navItems={adminNavLinks}
      sections={[{ id: "likes", label: "Likes" }]}
    >
      <Card id="likes" className="bg-card/70 border-border/60">
        <CardHeader>
          <CardTitle>Likes</CardTitle>
          <CardDescription>Enter a gallery ID to list users who liked it.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input placeholder="Gallery ID (e.g., city-market)" value={itemId} onChange={(e) => setItemId(e.target.value)} />
            <Button onClick={applyFilters} disabled={loading || !itemId.trim()}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Load
            </Button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border/60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Gallery ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={`${r.itemId}-${r.user}`}>
                    <TableCell>{r.user}</TableCell>
                    <TableCell>{r.itemId}</TableCell>
                  </TableRow>
                ))}
                {!rows.length && !loading && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                      No likes found.
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

export default AdminLikes;

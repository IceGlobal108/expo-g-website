import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

type Variant = {
  key: string;
  format: "webp" | "jpeg" | "png" | "avif";
  width?: number;
  height?: number;
  quality?: number;
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
  path?: string;
  fileName?: string;
};

type MediaConfig = {
  variants: Variant[];
  keepOriginal: boolean;
  maxSizeMb: number;
  allowedTypes: string[];
  pathStyle: "date" | "flat";
  folder: string;
};

const defaultVariant: Variant = {
  key: "main",
  format: "webp",
  quality: 82,
  fit: "cover",
};

const AdminMediaConfig = () => {
  const base = import.meta.env.VITE_API_BASE_URL || "";
  const mediaBase = import.meta.env.VITE_MEDIA_BASE_URL || base;
  const [config, setConfig] = useState<MediaConfig>({
    variants: [defaultVariant],
    keepOriginal: false,
    maxSizeMb: 10,
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
    pathStyle: "date",
    folder: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testFile, setTestFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  type VariantWithUrl = Variant & { url: string; size: number; width?: number; height?: number };
  const [uploadVariants, setUploadVariants] = useState<VariantWithUrl[]>([]);
  const [recentMedia, setRecentMedia] = useState<
    { id?: string; originalName: string; mime: string; size: number; variants: any[] }[]
  >([]);

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

  const authedFetch = async (url: string, options: RequestInit = {}) => {
    let token = await getAccessToken();
    const isFormData = options.body instanceof FormData;
    const attempt = async (authToken: string | null) =>
      fetch(url, {
        ...options,
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          ...(options.headers as Record<string, string>),
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
      });
    let res = await attempt(token);
    if (res.status === 401) {
      token = await refreshAccessToken();
      res = await attempt(token);
    }
    return res;
  };

  const loadConfig = async () => {
    setLoading(true);
    try {
      const res = await authedFetch(`${base}/media/config`);
      if (!res.ok) throw new Error("Failed to load media config");
      const payload = await res.json();
      setConfig({
        variants: payload.variants ?? [defaultVariant],
        keepOriginal: Boolean(payload.keepOriginal),
        maxSizeMb: Number(payload.maxSizeMb ?? 10),
        allowedTypes: payload.allowedTypes ?? config.allowedTypes,
        pathStyle: payload.pathStyle ?? "date",
        folder: payload.folder ?? "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Could not load media config");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
    loadRecentMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveConfig = async () => {
    setSaving(true);
    try {
      const res = await authedFetch(`${base}/media/config`, {
        method: "PUT",
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success("Media settings saved");
    } catch (err) {
      console.error(err);
      toast.error("Could not save media settings");
    } finally {
      setSaving(false);
    }
  };

  const restoreDefaults = async () => {
    setSaving(true);
    try {
      const res = await authedFetch(`${base}/media/config/restore`, { method: "POST" });
      if (!res.ok) throw new Error("Restore failed");
      const payload = await res.json();
      setConfig({
        variants: payload.variants ?? [defaultVariant],
        keepOriginal: Boolean(payload.keepOriginal),
        maxSizeMb: Number(payload.maxSizeMb ?? 10),
        allowedTypes: payload.allowedTypes ?? config.allowedTypes,
        pathStyle: payload.pathStyle ?? "date",
        folder: payload.folder ?? "",
      });
      toast.success("Media settings restored to defaults");
    } catch (err) {
      console.error(err);
      toast.error("Could not restore defaults");
    } finally {
      setSaving(false);
    }
  };

  const updateVariant = (index: number, field: keyof Variant, value: string) => {
    setConfig((prev) => {
      const variants = [...prev.variants];
      const variant = { ...variants[index] };
      if (field === "width" || field === "height" || field === "quality") {
        const numeric = value === "" ? undefined : Number(value);
        variant[field] = Number.isNaN(numeric) ? undefined : numeric;
      } else if (field === "format" || field === "fit" || field === "key") {
        (variant as any)[field] = value as any;
      }
      variants[index] = variant;
      return { ...prev, variants };
    });
  };

  const addVariant = () => {
    setConfig((prev) => ({
      ...prev,
      variants: [...prev.variants, { ...defaultVariant, key: `variant-${prev.variants.length + 1}` }],
    }));
  };

  const removeVariant = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const uploadTest = async () => {
    if (!testFile) {
      toast.error("Choose a file to upload");
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", testFile);
      const res = await authedFetch(`${base}/media/upload`, { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload failed");
      const payload = await res.json();
      setUploadVariants(payload.variants || []);
      toast.success("Test upload created variants");
      loadRecentMedia();
    } catch (err) {
      console.error(err);
      toast.error("Test upload failed");
    } finally {
      setUploading(false);
    }
  };

  const loadRecentMedia = async () => {
    try {
      const res = await authedFetch(`${base}/media?limit=6`);
      if (!res.ok) return;
      const payload = await res.json();
      setRecentMedia(payload.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
    const val = bytes / 1024 ** i;
    return `${val.toFixed(val >= 10 ? 0 : 1)} ${sizes[i]}`;
  };

  const buildMediaUrl = (p?: string) => {
    if (!p) return "";
    const trimmedBase = (mediaBase || "").replace(/\/$/, "");
    return `${trimmedBase}/${p.replace(/^\/+/, "")}`;
  };

  return (
    <AdminLayout
      title="Media Settings"
      description="Configure upload limits, allowed types, and generated variants for media assets."
      sections={[{ id: "media-config", label: "Media Configuration" }]}
    >
      <Card id="media-config">
        <CardHeader>
          <CardTitle>Media configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="maxSizeMb">Max size (MB)</Label>
              <Input
                id="maxSizeMb"
                type="number"
                min={1}
                value={config.maxSizeMb}
                onChange={(e) => setConfig((prev) => ({ ...prev, maxSizeMb: Number(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allowedTypes">Allowed MIME types (comma separated)</Label>
              <Input
                id="allowedTypes"
                value={config.allowedTypes.join(",")}
                onChange={(e) => setConfig((prev) => ({ ...prev, allowedTypes: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keepOriginal">Keep original file</Label>
              <div className="flex items-center gap-3">
                <input
                  id="keepOriginal"
                  type="checkbox"
                  checked={config.keepOriginal}
                  onChange={(e) => setConfig((prev) => ({ ...prev, keepOriginal: e.target.checked }))}
                  className="h-4 w-4"
                />
                <span className="text-sm text-muted-foreground">Store the original upload alongside generated variants.</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pathStyle">Path style</Label>
              <select
                id="pathStyle"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={config.pathStyle}
                onChange={(e) => setConfig((prev) => ({ ...prev, pathStyle: e.target.value as MediaConfig["pathStyle"] }))}
              >
                <option value="date">Date-based folders (YYYY/MM/DD)</option>
                <option value="flat">Flat (single folder)</option>
              </select>
              <p className="text-xs text-muted-foreground">Controls how files are organized on disk/URLs.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="folder">Folder prefix (optional)</Label>
              <Input
                id="folder"
                placeholder="e.g. uploads or brand-assets"
                value={config.folder}
                onChange={(e) => setConfig((prev) => ({ ...prev, folder: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">Applied on top of the path style.</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Variants</h3>
              <Button type="button" variant="secondary" onClick={addVariant}>
                Add variant
              </Button>
            </div>
            <div className="space-y-4">
              {config.variants.map((variant, idx) => (
                <div key={variant.key ?? idx} className="grid gap-3 md:grid-cols-6 items-end border rounded-lg p-4">
                  <div className="space-y-1">
                    <Label>Key</Label>
                    <Input value={variant.key} onChange={(e) => updateVariant(idx, "key", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Format</Label>
                    <Input value={variant.format} onChange={(e) => updateVariant(idx, "format", e.target.value)} placeholder="webp/jpeg/png/avif" />
                  </div>
                  <div className="space-y-1">
                    <Label>Width</Label>
                    <Input value={variant.width ?? ""} onChange={(e) => updateVariant(idx, "width", e.target.value)} type="number" min={1} />
                  </div>
                  <div className="space-y-1">
                    <Label>Height</Label>
                    <Input value={variant.height ?? ""} onChange={(e) => updateVariant(idx, "height", e.target.value)} type="number" min={1} />
                  </div>
                  <div className="space-y-1">
                    <Label>Quality</Label>
                    <Input value={variant.quality ?? ""} onChange={(e) => updateVariant(idx, "quality", e.target.value)} type="number" min={1} max={100} />
                  </div>
                  <div className="flex items-center gap-3">
                    <Button type="button" variant="destructive" onClick={() => removeVariant(idx)}>
                      Remove
                    </Button>
                  </div>
                  <div className="md:col-span-6 space-y-1">
                    <Label>Fit</Label>
                    <Input value={variant.fit ?? "cover"} onChange={(e) => updateVariant(idx, "fit", e.target.value)} placeholder="cover/contain/fill/inside/outside" />
                  </div>
                </div>
              ))}
              {config.variants.length === 0 && <p className="text-sm text-muted-foreground">No variants configured.</p>}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={saveConfig} disabled={saving}>
              {saving ? "Saving..." : "Save settings"}
            </Button>
            <Button type="button" variant="outline" onClick={restoreDefaults} disabled={saving}>
              Restore defaults
            </Button>
            {loading && <span className="text-sm text-muted-foreground">Loading settings…</span>}
          </div>
        </CardContent>
      </Card>

      <Card id="media-test">
        <CardHeader>
          <CardTitle>Test upload & preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="testFile">Choose a file</Label>
              <Input id="testFile" type="file" accept={config.allowedTypes.join(",")} onChange={(e) => setTestFile(e.target.files?.[0] ?? null)} />
              <div className="flex gap-3">
                <Button type="button" onClick={uploadTest} disabled={uploading}>
                  {uploading ? "Uploading…" : "Upload test"}
                </Button>
                {testFile && <span className="text-sm text-muted-foreground">Selected: {testFile.name}</span>}
              </div>
              <p className="text-xs text-muted-foreground">
                Applies current media configuration. Successful upload will show all generated variants with preview and file size.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Generated variants</Label>
              {uploadVariants.length ? (
                <ScrollArea className="h-72 rounded-md border p-3 space-y-3">
                  {uploadVariants.map((variant: any, idx: number) => (
                    <div key={variant.key ?? idx} className="flex gap-3 items-center">
                      <div className="w-24 h-16 bg-muted/40 rounded overflow-hidden border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={buildMediaUrl(variant.path ?? variant.fileName)} alt={variant.key} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">{variant.key}</div>
                        <div className="text-sm text-muted-foreground">
                          {variant.format} {variant.width ? `${variant.width}px` : ""} {variant.height ? `x ${variant.height}px` : ""}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {variant.fileName} • {formatSize(variant.size)}
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              ) : (
                <p className="text-sm text-muted-foreground">Upload a test image to see generated variants.</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent media</h3>
              <Button type="button" variant="ghost" size="sm" onClick={loadRecentMedia}>
                Refresh
              </Button>
            </div>
            {recentMedia.length ? (
              <div className="grid gap-3 md:grid-cols-3">
                {recentMedia.map((item) => {
                  const preview = item.variants?.[0];
                  return (
                    <div key={item.id ?? item.originalName} className="border rounded-lg overflow-hidden">
                      <div className="h-32 bg-muted/40 border-b overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {preview?.path || preview?.fileName ? (
                          <img src={buildMediaUrl(preview.path ?? preview.fileName)} alt={item.originalName} className="w-full h-full object-cover" />
                        ) : null}
                      </div>
                      <div className="p-3 space-y-1">
                        <div className="text-sm font-medium truncate">{item.originalName}</div>
                        <div className="text-xs text-muted-foreground">{item.mime}</div>
                        <div className="text-xs text-muted-foreground">{formatSize(item.size)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No media yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminMediaConfig;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FloatingNavbar } from "@/components/ui/floating-navbar";
import { BackgroundBeams } from "@/components/ui/background-effects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { navItems as staticNav } from "@/data/expo-data";
import { AlertCircle, Plus, Save, Trash2, RotateCcw } from "lucide-react";

const makeId = () => Math.random().toString(36).slice(2, 10);

type NavItem = { name: string; href: string };
type HeroItem = { title: string; link: string; thumbnail: string };
type HeroContent = { title: string; subtitle: string; description: string };
type HeroResponse = { navItems: NavItem[]; heroProducts: HeroItem[]; heroContent?: HeroContent };
type ReviewData = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  images: { src: string; href: string }[];
};
type BrandItem = {
  slug: string;
  name: string;
  logo: string;
  relationship: string;
  category: string;
  image: string;
};
type BrandsResponse = {
  eyebrow: string;
  title: string;
  description: string;
  brands: BrandItem[];
};
type CelebItem = {
  name: string;
  title: string;
  quote: string;
  image: string;
  badge: string;
  href?: string;
};
type CelebResponse = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  celebrities: CelebItem[];
};
type SellerItem = {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  outcome: string;
  image: string;
  href?: string;
};
type SellersResponse = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  sellers: SellerItem[];
};
type TimelineItem = { title: string; description: string; image?: string };
type TimelineResponse = {
  eyebrow: string;
  title: string;
  description: string;
  milestones: TimelineItem[];
};
type ArchItem = {
  city: string;
  year: string;
  highlight: string;
  image: string;
  href?: string;
};
type ArchesResponse = {
  eyebrow: string;
  title: string;
  description: string;
  arches: ArchItem[];
};
type StallImage = { src: string; href?: string };
type StallsResponse = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  images: StallImage[];
  stats?: { label: string; value: string; icon?: "grid" | "users" }[];
};
type BuyerMosaicResponse = StallsResponse;
type VvipItem = {
  name: string;
  title: string;
  role: string;
  image: string;
  highlight: string;
  href?: string;
};
type VvipResponse = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  guests: VvipItem[];
};
type FounderItem = {
  name: string;
  title: string;
  era: "ICE 1.0" | "ICE 2.0";
  focus: string;
  image: string;
  highlight: string;
  href?: string;
};
type FoundersResponse = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  founders: FounderItem[];
};
type CoFounderItem = {
  name: string;
  track: "IGE" | "IGN" | "IGE & IGN";
  title: string;
  focus: string;
  image: string;
  highlight: string;
  href?: string;
};
type CoFoundersResponse = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  cofounders: CoFounderItem[];
};
type DualCtaCard = {
  eyebrow?: string;
  title: string;
  description?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
};
type DualCtaResponse = {
  sellers: DualCtaCard;
  buyers: DualCtaCard;
};
type FooterResponse = {
  ctaTitle: string;
  ctaDescription: string;
  partnerHref: string;
  sponsorHref: string;
  exploreLinks: { name: string; href: string }[];
  partnersLinks: { name: string; href: string }[];
  legalLinks: { name: string; href: string }[];
  contact: { location: string; email: string; phone: string };
  socials: { label: string; href: string }[];
};
type BuyerItem = {
  id: string;
  name: string;
  city: string;
  segment: string;
  quote: string;
  spend: string;
  visits: string;
  image: string;
  href?: string;
};
type BuyersResponse = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  buyers: BuyerItem[];
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [navItems, setNavItems] = useState<NavItem[]>(staticNav);
  const [heroItems, setHeroItems] = useState<HeroItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [heroContent, setHeroContent] = useState<HeroContent>({ title: "", subtitle: "", description: "" });
  const [reviewData, setReviewData] = useState<ReviewData>({
    eyebrow: "",
    title: "",
    description: "",
    ctaLabel: "",
    ctaHref: "",
    images: [],
  });
  const [brandsData, setBrandsData] = useState<BrandsResponse>({
    eyebrow: "",
    title: "",
    description: "",
    brands: [],
  });
  const [celebsData, setCelebsData] = useState<CelebResponse>({
    eyebrow: "",
    title: "",
    description: "",
    ctaLabel: "",
    ctaHref: "",
    celebrities: [],
  });
  const [sellersData, setSellersData] = useState<SellersResponse>({
    eyebrow: "",
    title: "",
    description: "",
    ctaLabel: "",
    ctaHref: "",
    sellers: [],
  });
  const [buyersData, setBuyersData] = useState<BuyersResponse>({
    eyebrow: "",
    title: "",
    description: "",
    ctaLabel: "",
    ctaHref: "",
    buyers: [],
  });
  const [timelineData, setTimelineData] = useState<TimelineResponse>({
    eyebrow: "",
    title: "",
    description: "",
    milestones: [],
  });
  const [archesData, setArchesData] = useState<ArchesResponse>({
    eyebrow: "",
    title: "",
    description: "",
    arches: [],
  });
  const [stallsData, setStallsData] = useState<StallsResponse>({
    eyebrow: "",
    title: "",
    description: "",
    ctaLabel: "",
    ctaHref: "",
    images: [],
    stats: [],
  });
  const [buyerMosaicData, setBuyerMosaicData] = useState<BuyerMosaicResponse>({
    eyebrow: "",
    title: "",
    description: "",
    ctaLabel: "",
    ctaHref: "",
    images: [],
    stats: [],
  });
  const [vvipData, setVvipData] = useState<VvipResponse>({
    eyebrow: "",
    title: "",
    description: "",
    ctaLabel: "",
    ctaHref: "",
    guests: [],
  });
  const [foundersData, setFoundersData] = useState<FoundersResponse>({
    eyebrow: "",
    title: "",
    description: "",
    ctaLabel: "",
    ctaHref: "",
    founders: [],
  });
  const [cofoundersData, setCofoundersData] = useState<CoFoundersResponse>({
    eyebrow: "",
    title: "",
    description: "",
    ctaLabel: "",
    ctaHref: "",
    cofounders: [],
  });
  const [countsData, setCountsData] = useState<{ stats: { value: number; suffix?: string; label: string }[] }>({
    stats: [],
  });
  const [dualCtaData, setDualCtaData] = useState<DualCtaResponse>({
    sellers: { eyebrow: "", title: "", description: "", primary: { label: "", href: "" }, secondary: { label: "", href: "" } },
    buyers: { eyebrow: "", title: "", description: "", primary: { label: "", href: "" }, secondary: { label: "", href: "" } },
  });
  const [footerData, setFooterData] = useState<FooterResponse>({
    ctaTitle: "",
    ctaDescription: "",
    partnerHref: "",
    sponsorHref: "",
    exploreLinks: [],
    partnersLinks: [],
    legalLinks: [],
    contact: { location: "", email: "", phone: "" },
    socials: [],
  });

  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE_URL || "";
    const loadHero = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${base}/hero`);
        if (!res.ok) throw new Error("Failed to load hero data");
        const data = (await res.json()) as HeroResponse;
        setNavItems(data.navItems ?? staticNav);
        if (data.heroContent) {
          setHeroContent(data.heroContent);
        } else {
          setHeroContent({ title: "", subtitle: "", description: "" });
        }
        setHeroItems(data.heroProducts ?? []);
      } catch (err: any) {
        setError(err.message || "Unable to load hero data");
        setNavItems(staticNav);
      } finally {
        setLoading(false);
      }
    };
    const loadReview = async () => {
      try {
        const res = await fetch(`${base}/review`);
        if (!res.ok) throw new Error("Failed to load review data");
        const data = await res.json();
        setReviewData({
          eyebrow: data.eyebrow || "",
          title: data.title || "",
          description: data.description || "",
          ctaLabel: data.ctaLabel || "",
          ctaHref: data.ctaHref || "",
          images: (data.images || []).map((img: any) => ({
            src: img?.src || "",
            href: img?.href || "",
          })),
        });
      } catch (err: any) {
        setError((prev) => prev || err.message || "Unable to load review data");
      }
    };
    const loadBrands = async () => {
      try {
        const res = await fetch(`${base}/brands/highlights`);
        if (!res.ok) throw new Error("Failed to load brands data");
        const data = (await res.json()) as BrandsResponse;
        setBrandsData({
          eyebrow: data.eyebrow || "",
          title: data.title || "",
          description: data.description || "",
          brands: data.brands || [],
        });
      } catch (err: any) {
        setError((prev) => prev || err.message || "Unable to load brands data");
      }
    };
    const loadCelebs = async () => {
      try {
        const res = await fetch(`${base}/celebrities`);
        if (!res.ok) throw new Error("Failed to load celebrity data");
        const data = (await res.json()) as CelebResponse;
        setCelebsData({
          eyebrow: data.eyebrow || "",
          title: data.title || "",
          description: data.description || "",
          ctaLabel: data.ctaLabel || "",
          ctaHref: data.ctaHref || "",
          celebrities: data.celebrities || [],
        });
      } catch (err: any) {
        setError((prev) => prev || err.message || "Unable to load celebrity data");
      }
    };
    const loadSellers = async () => {
      try {
        const res = await fetch(`${base}/sellers`);
        if (!res.ok) throw new Error("Failed to load seller data");
        const data = (await res.json()) as SellersResponse;
        setSellersData({
          eyebrow: data.eyebrow || "",
          title: data.title || "",
          description: data.description || "",
          ctaLabel: data.ctaLabel || "",
          ctaHref: data.ctaHref || "",
          sellers: data.sellers || [],
        });
      } catch (err: any) {
        setError((prev) => prev || err.message || "Unable to load seller data");
      }
    };
    const loadBuyers = async () => {
      try {
        const res = await fetch(`${base}/buyers`);
        if (!res.ok) throw new Error("Failed to load buyer data");
        const data = (await res.json()) as BuyersResponse;
        setBuyersData({
          eyebrow: data.eyebrow || "",
          title: data.title || "",
          description: data.description || "",
          ctaLabel: data.ctaLabel || "",
          ctaHref: data.ctaHref || "",
          buyers: data.buyers || [],
        });
      } catch (err: any) {
        setError((prev) => prev || err.message || "Unable to load buyer data");
      }
    };
    const loadTimeline = async () => {
      try {
        const res = await fetch(`${base}/timeline`);
        if (!res.ok) throw new Error("Failed to load timeline data");
        const data = (await res.json()) as TimelineResponse;
        setTimelineData({
          eyebrow: data.eyebrow || "",
          title: data.title || "",
          description: data.description || "",
          milestones: data.milestones || [],
        });
      } catch (err: any) {
        setError((prev) => prev || err.message || "Unable to load timeline data");
      }
    };
    const loadArches = async () => {
      try {
        const res = await fetch(`${base}/arches`);
        if (!res.ok) throw new Error("Failed to load arches data");
        const data = (await res.json()) as ArchesResponse;
        setArchesData({
          eyebrow: data.eyebrow || "",
          title: data.title || "",
          description: data.description || "",
          arches: data.arches || [],
        });
      } catch (err: any) {
        setError((prev) => prev || err.message || "Unable to load arches data");
      }
    };
    const loadStalls = async () => {
      try {
        const res = await fetch(`${base}/stalls`);
        if (!res.ok) throw new Error("Failed to load stalls data");
        const data = (await res.json()) as StallsResponse;
        setStallsData({
          eyebrow: data.eyebrow || "",
          title: data.title || "",
          description: data.description || "",
          ctaLabel: data.ctaLabel || "",
          ctaHref: data.ctaHref || "",
          images: data.images || [],
          stats: data.stats || [],
        });
      } catch (err: any) {
        setError((prev) => prev || err.message || "Unable to load stalls data");
      }
    };
    const loadBuyerMosaic = async () => {
      try {
        const res = await fetch(`${base}/buyer-mosaic`);
        if (!res.ok) throw new Error("Failed to load buyer mosaic data");
        const data = (await res.json()) as BuyerMosaicResponse;
        setBuyerMosaicData({
          eyebrow: data.eyebrow || "",
          title: data.title || "",
          description: data.description || "",
          ctaLabel: data.ctaLabel || "",
          ctaHref: data.ctaHref || "",
          images: data.images || [],
          stats: data.stats || [],
        });
      } catch (err: any) {
        setError((prev) => prev || err.message || "Unable to load buyer mosaic data");
      }
    };
    const loadVvips = async () => {
      try {
        const res = await fetch(`${base}/vvips`);
        if (!res.ok) throw new Error("Failed to load VVIP data");
        const data = (await res.json()) as VvipResponse;
        setVvipData({
          eyebrow: data.eyebrow || "",
          title: data.title || "",
          description: data.description || "",
          ctaLabel: data.ctaLabel || "",
          ctaHref: data.ctaHref || "",
          guests: data.guests || [],
        });
      } catch (err: any) {
        setError((prev) => prev || err.message || "Unable to load VVIP data");
      }
    };
    const loadFounders = async () => {
      try {
        const res = await fetch(`${base}/founders`);
        if (!res.ok) throw new Error("Failed to load founders data");
        const data = (await res.json()) as FoundersResponse;
        setFoundersData({
          eyebrow: data.eyebrow || "",
          title: data.title || "",
          description: data.description || "",
          ctaLabel: data.ctaLabel || "",
          ctaHref: data.ctaHref || "",
          founders: data.founders || [],
        });
      } catch (err: any) {
        setError((prev) => prev || err.message || "Unable to load founders data");
      }
    };
    const loadCofounders = async () => {
      try {
        const res = await fetch(`${base}/cofounders`);
        if (!res.ok) throw new Error("Failed to load co-founders data");
        const data = (await res.json()) as CoFoundersResponse;
        setCofoundersData({
          eyebrow: data.eyebrow || "",
          title: data.title || "",
          description: data.description || "",
          ctaLabel: data.ctaLabel || "",
          ctaHref: data.ctaHref || "",
          cofounders: data.cofounders || [],
        });
      } catch (err: any) {
        setError((prev) => prev || err.message || "Unable to load co-founders data");
      }
    };
    const loadCounts = async () => {
      try {
        const res = await fetch(`${base}/counts`);
        if (!res.ok) throw new Error("Failed to load counts data");
        const data = (await res.json()) as { stats: { value: number; suffix?: string; label: string }[] };
        setCountsData({
          stats:
            data.stats && data.stats.length
              ? data.stats
              : [
                  { value: 20, suffix: "M+", label: "buyers" },
                  { value: 10000, suffix: "+", label: "brands & sellers" },
                  { value: 10, label: "cities across India" },
                  { value: 30, suffix: "+", label: "years of mega exhibitions" },
                ],
        });
      } catch (err: any) {
        setError((prev) => prev || err.message || "Unable to load counts data");
      }
    };
    const loadDualCta = async () => {
      try {
        const res = await fetch(`${base}/dual-cta`);
        if (!res.ok) throw new Error("Failed to load dual CTA data");
        const data = (await res.json()) as DualCtaResponse;
        setDualCtaData({
          sellers: data.sellers || dualCtaData.sellers,
          buyers: data.buyers || dualCtaData.buyers,
        });
      } catch (err: any) {
        setError((prev) => prev || err.message || "Unable to load dual CTA data");
      }
    };
    const loadFooter = async () => {
      try {
        const res = await fetch(`${base}/footer`);
        if (!res.ok) throw new Error("Failed to load footer data");
        const data = (await res.json()) as FooterResponse;
        setFooterData(data);
      } catch (err: any) {
        setError((prev) => prev || err.message || "Unable to load footer data");
      }
    };
    loadHero();
    loadReview();
    loadBrands();
    loadCelebs();
    loadSellers();
    loadBuyers();
    loadTimeline();
    loadArches();
    loadStalls();
    loadBuyerMosaic();
    loadVvips();
    loadFounders();
    loadCofounders();
    loadCounts();
    loadDualCta();
    loadFooter();
  }, []);

  const updateNav = (idx: number, key: keyof NavItem, value: string) => {
    setNavItems((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: value };
      return next;
    });
  };

  const updateHero = (idx: number, key: keyof HeroItem, value: string) => {
    setHeroItems((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: value };
      return next;
    });
  };

  const addNav = () => setNavItems((prev) => [...prev, { name: "", href: "" }]);
  const addHero = () =>
    setHeroItems((prev) => [
      ...prev,
      { title: "", link: "/gallery", thumbnail: "https://via.placeholder.com/800x600" },
    ]);

  const removeNav = (idx: number) =>
    setNavItems((prev) => prev.filter((_, i) => i !== idx));
  const removeHero = (idx: number) =>
    setHeroItems((prev) => prev.filter((_, i) => i !== idx));
  const addReviewImage = () =>
    setReviewData((prev) => ({
      ...prev,
      images: [...prev.images, { src: "https://via.placeholder.com/800x600", href: "/gallery" }],
    }));
  const removeReviewImage = (idx: number) =>
    setReviewData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  const addBrand = () =>
    setBrandsData((prev) => ({
      ...prev,
      brands: [
        ...prev.brands,
        { slug: "", name: "", logo: "", relationship: "", category: "", image: "https://via.placeholder.com/400x300" },
      ],
    }));
  const removeBrand = (idx: number) =>
    setBrandsData((prev) => ({ ...prev, brands: prev.brands.filter((_, i) => i !== idx) }));
  const addCeleb = () =>
    setCelebsData((prev) => ({
      ...prev,
      celebrities: [
        ...prev.celebrities,
        { name: "", title: "", quote: "", image: "https://via.placeholder.com/600x800", badge: "" },
      ],
    }));
  const removeCeleb = (idx: number) =>
    setCelebsData((prev) => ({ ...prev, celebrities: prev.celebrities.filter((_, i) => i !== idx) }));
  const addSeller = () =>
    setSellersData((prev) => ({
      ...prev,
      sellers: [
        ...prev.sellers,
        {
          id: makeId(),
          name: "",
          role: "",
          company: "",
          quote: "",
          outcome: "",
          image: "https://via.placeholder.com/400x500",
          href: "",
        },
      ],
    }));
  const removeSeller = (idx: number) =>
    setSellersData((prev) => ({ ...prev, sellers: prev.sellers.filter((_, i) => i !== idx) }));
  const addBuyer = () =>
    setBuyersData((prev) => ({
      ...prev,
      buyers: [
        ...prev.buyers,
        {
          id: makeId(),
          name: "",
          city: "",
          segment: "",
          quote: "",
          spend: "",
          visits: "",
          image: "https://via.placeholder.com/400x500",
          href: "",
        },
      ],
    }));
  const removeBuyer = (idx: number) =>
    setBuyersData((prev) => ({ ...prev, buyers: prev.buyers.filter((_, i) => i !== idx) }));
  const addMilestone = () =>
    setTimelineData((prev) => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        { title: "", description: "", image: "https://via.placeholder.com/800x600" },
      ],
    }));
  const removeMilestone = (idx: number) =>
    setTimelineData((prev) => ({ ...prev, milestones: prev.milestones.filter((_, i) => i !== idx) }));
  const addArch = () =>
    setArchesData((prev) => ({
      ...prev,
      arches: [
        ...prev.arches,
        {
          city: "",
          year: "",
          highlight: "",
          image: "https://via.placeholder.com/900x700",
          href: "",
        },
      ],
    }));
  const removeArch = (idx: number) =>
    setArchesData((prev) => ({ ...prev, arches: prev.arches.filter((_, i) => i !== idx) }));
  const addStallImage = () =>
    setStallsData((prev) => ({
      ...prev,
      images: [...prev.images, { src: "https://via.placeholder.com/900x700", href: "/gallery" }],
    }));
  const removeStallImage = (idx: number) =>
    setStallsData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  const addBuyerImage = () =>
    setBuyerMosaicData((prev) => ({
      ...prev,
      images: [...prev.images, { src: "https://via.placeholder.com/900x700", href: "/gallery" }],
    }));
  const removeBuyerImage = (idx: number) =>
    setBuyerMosaicData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  const addVvip = () =>
    setVvipData((prev) => ({
      ...prev,
      guests: [
        ...prev.guests,
        {
          name: "",
          title: "",
          role: "",
          image: "https://via.placeholder.com/600x800",
          highlight: "",
          href: "",
        },
      ],
    }));
  const removeVvip = (idx: number) =>
    setVvipData((prev) => ({ ...prev, guests: prev.guests.filter((_, i) => i !== idx) }));
  const addFounder = () =>
    setFoundersData((prev) => ({
      ...prev,
      founders: [
        ...prev.founders,
        {
          name: "",
          title: "",
          era: "ICE 1.0",
          focus: "",
          image: "https://via.placeholder.com/600x800",
          highlight: "",
          href: "",
        },
      ],
    }));
  const removeFounder = (idx: number) =>
    setFoundersData((prev) => ({ ...prev, founders: prev.founders.filter((_, i) => i !== idx) }));
  const addCofounder = () =>
    setCofoundersData((prev) => ({
      ...prev,
      cofounders: [
        ...prev.cofounders,
        {
          name: "",
          track: "IGE",
          title: "",
          focus: "",
          image: "https://via.placeholder.com/600x800",
          highlight: "",
          href: "",
        },
      ],
    }));
  const removeCofounder = (idx: number) =>
    setCofoundersData((prev) => ({ ...prev, cofounders: prev.cofounders.filter((_, i) => i !== idx) }));
  const addCount = () =>
    setCountsData((prev) => ({
      stats: [...prev.stats, { value: 0, suffix: "", label: "" }],
    }));
  const removeCount = (idx: number) =>
    setCountsData((prev) => ({ stats: prev.stats.filter((_, i) => i !== idx) }));

  const save = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }

      const attempt = async (token: string) =>
        fetch(`${base}/hero`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ navItems, heroProducts: heroItems, heroContent }),
        });

      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Save failed");
      }
      setSuccess("Hero section updated");
    } catch (err: any) {
      setError(err.message || "Unable to save hero");
    } finally {
      setSaving(false);
    }
  };

  const restoreDefaults = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }

      const attempt = async (token: string) =>
        fetch(`${base}/hero/restore`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Restore failed");
      }
      const data = await res.json();
      setNavItems(data.navItems ?? []);
      setHeroItems(data.heroProducts ?? []);
      if (data.heroContent) {
        setHeroContent(data.heroContent);
      } else {
        setHeroContent({ title: "", subtitle: "", description: "" });
      }
      setSuccess("Restored default hero content");
    } catch (err: any) {
      setError(err.message || "Unable to restore hero");
    } finally {
      setSaving(false);
    }
  };

  const saveReview = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }

      const attempt = async (token: string) =>
        fetch(`${base}/review`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reviewData),
        });

      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Save failed");
      }
      setSuccess("Review section updated");
    } catch (err: any) {
      setError(err.message || "Unable to save review");
    } finally {
      setSaving(false);
    }
  };

  const restoreReview = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }

      const attempt = async (token: string) =>
        fetch(`${base}/review/restore`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Restore failed");
      }
      const data = await res.json();
      setReviewData({
        eyebrow: data.eyebrow || "",
        title: data.title || "",
        description: data.description || "",
        ctaLabel: data.ctaLabel || "",
        ctaHref: data.ctaHref || "",
        images: data.images || [],
      });
      setSuccess("Restored default review content");
    } catch (err: any) {
      setError(err.message || "Unable to restore review");
    } finally {
      setSaving(false);
    }
  };

  const saveCelebs = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }
      const attempt = async (token: string) =>
        fetch(`${base}/celebrities`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(celebsData),
        });
      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Save failed");
      }
      setSuccess("Celebrities updated");
    } catch (err: any) {
      setError(err.message || "Unable to save celebrities");
    } finally {
      setSaving(false);
    }
  };

  const restoreCelebs = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }
      const attempt = async (token: string) =>
        fetch(`${base}/celebrities/restore`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Restore failed");
      }
      const data = await res.json();
      setCelebsData({
        eyebrow: data.eyebrow || "",
        title: data.title || "",
        description: data.description || "",
        celebrities: data.celebrities || [],
      });
      setSuccess("Restored celebrities");
    } catch (err: any) {
      setError(err.message || "Unable to restore celebrities");
    } finally {
      setSaving(false);
    }
  };

  const saveBrands = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }

      const attempt = async (token: string) =>
        fetch(`${base}/brands/highlights`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(brandsData),
        });

      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Save failed");
      }
      setSuccess("Brand highlights updated");
    } catch (err: any) {
      setError(err.message || "Unable to save brands");
    } finally {
      setSaving(false);
    }
  };

  const restoreBrands = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }

      const attempt = async (token: string) =>
        fetch(`${base}/brands/highlights/restore`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Restore failed");
      }
      const data = await res.json();
      setBrandsData({
        eyebrow: data.eyebrow || "",
        title: data.title || "",
        description: data.description || "",
        brands: data.brands || [],
      });
      setSuccess("Restored brand highlights");
    } catch (err: any) {
      setError(err.message || "Unable to restore brands");
    } finally {
      setSaving(false);
    }
  };

  const getAccessToken = async (base: string) => {
    const token = localStorage.getItem("admin_access_token");
    if (token) return token;
    const refreshed = await refreshAccessToken(base);
    if (!refreshed) {
      setError("Not authenticated. Please login again.");
      navigate("/admin/login");
    }
    return refreshed;
  };

  const refreshAccessToken = async (base: string) => {
    const refresh = localStorage.getItem("admin_refresh_token");
    if (!refresh) return null;
    const res = await fetch(`${base}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refresh }),
    });
    if (!res.ok) {
      localStorage.removeItem("admin_access_token");
      localStorage.removeItem("admin_refresh_token");
      return null;
    }
    const data = await res.json();
    if (data.accessToken) {
      localStorage.setItem("admin_access_token", data.accessToken);
      return data.accessToken as string;
    }
    return null;
  };

  const saveSellers = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }
      const attempt = async (token: string) =>
        fetch(`${base}/sellers`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(sellersData),
        });

      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Save failed");
      }
      setSuccess("Sellers updated");
    } catch (err: any) {
      setError(err.message || "Unable to save sellers");
    } finally {
      setSaving(false);
    }
  };

  const restoreSellers = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }

      const attempt = async (token: string) =>
        fetch(`${base}/sellers/restore`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Restore failed");
      }
      const data = await res.json();
      setSellersData({
        eyebrow: data.eyebrow || "",
        title: data.title || "",
        description: data.description || "",
        ctaLabel: data.ctaLabel || "",
        ctaHref: data.ctaHref || "",
        sellers: data.sellers || [],
      });
      setSuccess("Restored sellers");
    } catch (err: any) {
      setError(err.message || "Unable to restore sellers");
    } finally {
      setSaving(false);
    }
  };

  const saveBuyers = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }
      const attempt = async (token: string) =>
        fetch(`${base}/buyers`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(buyersData),
        });

      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Save failed");
      }
      setSuccess("Buyers updated");
    } catch (err: any) {
      setError(err.message || "Unable to save buyers");
    } finally {
      setSaving(false);
    }
  };

  const restoreBuyers = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }

      const attempt = async (token: string) =>
        fetch(`${base}/buyers/restore`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Restore failed");
      }
      const data = await res.json();
      setBuyersData({
        eyebrow: data.eyebrow || "",
        title: data.title || "",
        description: data.description || "",
        ctaLabel: data.ctaLabel || "",
        ctaHref: data.ctaHref || "",
        buyers: data.buyers || [],
      });
      setSuccess("Restored buyers");
    } catch (err: any) {
      setError(err.message || "Unable to restore buyers");
    } finally {
      setSaving(false);
    }
  };

  const saveTimeline = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }
      const attempt = async (token: string) =>
        fetch(`${base}/timeline`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(timelineData),
        });
      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Save failed");
      }
      setSuccess("Timeline updated");
    } catch (err: any) {
      setError(err.message || "Unable to save timeline");
    } finally {
      setSaving(false);
    }
  };

  const restoreTimeline = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }
      const attempt = async (token: string) =>
        fetch(`${base}/timeline/restore`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Restore failed");
      }
      const data = await res.json();
      setTimelineData({
        eyebrow: data.eyebrow || "",
        title: data.title || "",
        description: data.description || "",
        milestones: data.milestones || [],
      });
      setSuccess("Restored timeline");
    } catch (err: any) {
      setError(err.message || "Unable to restore timeline");
    } finally {
      setSaving(false);
    }
  };

  const saveArches = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }
      const attempt = async (token: string) =>
        fetch(`${base}/arches`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(archesData),
        });
      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Save failed");
      }
      setSuccess("Entrance arches updated");
    } catch (err: any) {
      setError(err.message || "Unable to save entrance arches");
    } finally {
      setSaving(false);
    }
  };

  const saveStalls = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }
      const attempt = async (token: string) =>
        fetch(`${base}/stalls`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(stallsData),
        });
      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Save failed");
      }
      setSuccess("Stalls mosaic updated");
    } catch (err: any) {
      setError(err.message || "Unable to save stalls");
    } finally {
      setSaving(false);
    }
  };

  const restoreStalls = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }

      const attempt = async (token: string) =>
        fetch(`${base}/stalls/restore`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Restore failed");
      }
      const data = await res.json();
      setStallsData({
        eyebrow: data.eyebrow || "",
        title: data.title || "",
        description: data.description || "",
        ctaLabel: data.ctaLabel || "",
        ctaHref: data.ctaHref || "",
        images: data.images || [],
        stats: data.stats || [],
      });
      setSuccess("Restored stalls mosaic");
    } catch (err: any) {
      setError(err.message || "Unable to restore stalls");
    } finally {
      setSaving(false);
    }
  };

  const saveBuyerMosaic = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }
      const attempt = async (token: string) =>
        fetch(`${base}/buyer-mosaic`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(buyerMosaicData),
        });
      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Save failed");
      }
      setSuccess("Buyer mosaic updated");
    } catch (err: any) {
      setError(err.message || "Unable to save buyer mosaic");
    } finally {
      setSaving(false);
    }
  };

  const restoreBuyerMosaic = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }

      const attempt = async (token: string) =>
        fetch(`${base}/buyer-mosaic/restore`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Restore failed");
      }
      const data = await res.json();
      setBuyerMosaicData({
        eyebrow: data.eyebrow || "",
        title: data.title || "",
        description: data.description || "",
        ctaLabel: data.ctaLabel || "",
        ctaHref: data.ctaHref || "",
        images: data.images || [],
        stats: data.stats || [],
      });
      setSuccess("Restored buyer mosaic");
    } catch (err: any) {
      setError(err.message || "Unable to restore buyer mosaic");
    } finally {
      setSaving(false);
    }
  };

  const saveVvips = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }
      const attempt = async (token: string) =>
        fetch(`${base}/vvips`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(vvipData),
        });
      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Save failed");
      }
      setSuccess("VVIPs updated");
    } catch (err: any) {
      setError(err.message || "Unable to save VVIPs");
    } finally {
      setSaving(false);
    }
  };

  const restoreVvips = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }
      const attempt = async (token: string) =>
        fetch(`${base}/vvips/restore`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Restore failed");
      }
      const data = await res.json();
      setVvipData({
        eyebrow: data.eyebrow || "",
        title: data.title || "",
        description: data.description || "",
        ctaLabel: data.ctaLabel || "",
        ctaHref: data.ctaHref || "",
        guests: data.guests || [],
      });
      setSuccess("Restored VVIPs");
    } catch (err: any) {
      setError(err.message || "Unable to restore VVIPs");
    } finally {
      setSaving(false);
    }
  };

  const saveFounders = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }
      const attempt = async (token: string) =>
        fetch(`${base}/founders`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(foundersData),
        });
      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Save failed");
      }
      setSuccess("Founders updated");
    } catch (err: any) {
      setError(err.message || "Unable to save founders");
    } finally {
      setSaving(false);
    }
  };

  const restoreFounders = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }
      const attempt = async (token: string) =>
        fetch(`${base}/founders/restore`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Restore failed");
      }
      const data = await res.json();
      setFoundersData({
        eyebrow: data.eyebrow || "",
        title: data.title || "",
        description: data.description || "",
        ctaLabel: data.ctaLabel || "",
        ctaHref: data.ctaHref || "",
        founders: data.founders || [],
      });
      setSuccess("Restored founders");
    } catch (err: any) {
      setError(err.message || "Unable to restore founders");
    } finally {
      setSaving(false);
    }
  };

  const saveCofounders = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }
      const attempt = async (token: string) =>
        fetch(`${base}/cofounders`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cofoundersData),
        });
      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Save failed");
      }
      setSuccess("Co-founders updated");
    } catch (err: any) {
      setError(err.message || "Unable to save co-founders");
    } finally {
      setSaving(false);
    }
  };

  const restoreCofounders = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }
      const attempt = async (token: string) =>
        fetch(`${base}/cofounders/restore`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Restore failed");
      }
      const data = await res.json();
      setCofoundersData({
        eyebrow: data.eyebrow || "",
        title: data.title || "",
        description: data.description || "",
        ctaLabel: data.ctaLabel || "",
        ctaHref: data.ctaHref || "",
        cofounders: data.cofounders || [],
      });
      setSuccess("Restored co-founders");
    } catch (err: any) {
      setError(err.message || "Unable to restore co-founders");
    } finally {
      setSaving(false);
    }
  };

  const saveCounts = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }
      const attempt = async (token: string) =>
        fetch(`${base}/counts`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(countsData),
        });
      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Save failed");
      }
      setSuccess("Counts updated");
    } catch (err: any) {
      setError(err.message || "Unable to save counts");
    } finally {
      setSaving(false);
    }
  };

  const restoreCounts = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }
      const attempt = async (token: string) =>
        fetch(`${base}/counts/restore`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Restore failed");
      }
      const data = await res.json();
      setCountsData({
        stats: data.stats || [],
      });
      setSuccess("Restored counts");
    } catch (err: any) {
      setError(err.message || "Unable to restore counts");
    } finally {
      setSaving(false);
    }
  };

  const saveDualCta = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }
      const attempt = async (token: string) =>
        fetch(`${base}/dual-cta`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dualCtaData),
        });
      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Save failed");
      }
      setSuccess("Dual CTAs updated");
    } catch (err: any) {
      setError(err.message || "Unable to save dual CTAs");
    } finally {
      setSaving(false);
    }
  };

  const saveFooter = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }
      const attempt = async (token: string) =>
        fetch(`${base}/footer`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(footerData),
        });
      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Save failed");
      }
      setSuccess("Footer updated");
    } catch (err: any) {
      setError(err.message || "Unable to save footer");
    } finally {
      setSaving(false);
    }
  };

  const restoreFooter = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }

      const attempt = async (token: string) =>
        fetch(`${base}/footer/restore`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Restore failed");
      }
      const data = await res.json();
      setFooterData(data);
      setSuccess("Restored footer");
    } catch (err: any) {
      setError(err.message || "Unable to restore footer");
    } finally {
      setSaving(false);
    }
  };

  const restoreDualCta = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }

      const attempt = async (token: string) =>
        fetch(`${base}/dual-cta/restore`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Restore failed");
      }
      const data = await res.json();
      setDualCtaData({
        sellers: data.sellers || { eyebrow: "", title: "", description: "", primary: { label: "", href: "" }, secondary: { label: "", href: "" } },
        buyers: data.buyers || { eyebrow: "", title: "", description: "", primary: { label: "", href: "" }, secondary: { label: "", href: "" } },
      });
      setSuccess("Restored dual CTAs");
    } catch (err: any) {
      setError(err.message || "Unable to restore dual CTAs");
    } finally {
      setSaving(false);
    }
  };

  const restoreArches = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const ensureToken = await getAccessToken(base);
      if (!ensureToken) {
        setSaving(false);
        return;
      }

      const attempt = async (token: string) =>
        fetch(`${base}/arches/restore`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      let res = await attempt(ensureToken);
      if (res.status === 401) {
        const refreshed = await refreshAccessToken(base);
        if (!refreshed) throw new Error("Session expired. Please login again.");
        res = await attempt(refreshed);
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Restore failed");
      }
      const data = await res.json();
      setArchesData({
        eyebrow: data.eyebrow || "",
        title: data.title || "",
        description: data.description || "",
        arches: data.arches || [],
      });
      setSuccess("Restored entrance arches");
    } catch (err: any) {
      setError(err.message || "Unable to restore entrance arches");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <FloatingNavbar navItems={[...staticNav, { name: "Admin", href: "/admin" }]} />
      <section className="relative pt-28 md:pt-32 pb-16 md:pb-8 overflow-hidden">
        <BackgroundBeams className="z-0" />
        <div className="container-custom relative z-10 max-w-5xl mx-auto space-y-6">
          <div className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl font-display font-bold">Hero Editor</h1>
            <p className="text-muted-foreground">
              Edit nav items and hero products for the home page hero section.
            </p>
            <Badge variant="secondary">Hero CMS</Badge>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg p-3">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 rounded-lg p-3">
              <AlertCircle className="w-4 h-4" />
              <span>{success}</span>
            </div>
          )}

            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid grid-cols-4 md:grid-cols-5">
                <TabsTrigger value="content">Hero content</TabsTrigger>
                <TabsTrigger value="nav">Nav items</TabsTrigger>
                <TabsTrigger value="products">Hero items</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>

            <TabsContent value="content" className="mt-4">
              <Card className="bg-card/80 border-border/70">
                <CardHeader>
                  <CardTitle>Hero content</CardTitle>
                  <CardDescription>Headline, subtitle, and description displayed above the hero parallax.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                    <Input
                      value={heroContent.title}
                      onChange={(e) => setHeroContent((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Experience the Expo Legacy"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Subtitle</label>
                    <Input
                      value={heroContent.subtitle}
                      onChange={(e) => setHeroContent((prev) => ({ ...prev, subtitle: e.target.value }))}
                      placeholder="A decade of immersive expos..."
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                    <Input
                      value={heroContent.description}
                      onChange={(e) => setHeroContent((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Where brands connect, innovate, and inspire..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nav" className="mt-4">
              <Card className="bg-card/80 border-border/70">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Navigation</CardTitle>
                    <CardDescription>Links displayed in the floating navbar.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {navItems.map((item, idx) => (
                    <div key={idx} className="grid md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Label</label>
                        <Input
                          value={item.name}
                          onChange={(e) => updateNav(idx, "name", e.target.value)}
                          placeholder="Home"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Href</label>
                        <Input
                          value={item.href}
                          onChange={(e) => updateNav(idx, "href", e.target.value)}
                          placeholder="/"
                        />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeNav(idx)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {!navItems.length && <p className="text-sm text-muted-foreground">No nav items yet.</p>}
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={addNav}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add nav item
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="mt-4">
              <Card className="bg-card/80 border-border/70">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Hero products</CardTitle>
                    <CardDescription>Cards shown in the parallax hero.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {heroItems.map((item, idx) => (
                    <div key={idx} className="grid md:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                        <Input
                          value={item.title}
                          onChange={(e) => updateHero(idx, "title", e.target.value)}
                          placeholder="Main Stage"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Link</label>
                        <Input
                          value={item.link}
                          onChange={(e) => updateHero(idx, "link", e.target.value)}
                          placeholder="/gallery"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Thumbnail URL</label>
                        <Input
                          value={item.thumbnail}
                          onChange={(e) => updateHero(idx, "thumbnail", e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeHero(idx)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {!heroItems.length && <p className="text-sm text-muted-foreground">No hero items yet.</p>}
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={addHero}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add hero item
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <Card className="bg-card/70 border-border/60">
                <CardHeader>
                  <CardTitle>Hero preview</CardTitle>
                  <CardDescription>Quick glance at how hero items will appear (static grid preview).</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {heroItems.map((item) => (
                      <div key={item.title} className="rounded-2xl border border-border/60 overflow-hidden bg-card/80">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-36 object-cover border-b border-border/60"
                        />
                        <div className="p-3 space-y-1">
                          <div className="font-semibold text-sm">{item.title}</div>
                          <div className="text-xs text-muted-foreground">{item.link}</div>
                        </div>
                      </div>
                    ))}
                    {!heroItems.length && (
                      <p className="text-sm text-muted-foreground col-span-full">
                        No hero items to preview.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="actions" className="mt-4">
              <Card className="bg-card/80 border-border/70">
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                  <CardDescription>Restore defaults or publish changes.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap justify-end gap-3">
                  <Button variant="outline" onClick={restoreDefaults} disabled={saving || loading}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restore defaults
                  </Button>
                  <Button onClick={save} disabled={saving || loading}>
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Saving..." : "Save hero"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="pt-10 space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-display font-semibold">Review Moments Editor</h2>
              <p className="text-muted-foreground text-sm">
                Manage the “What is ICE Exhibitions (Infographics & Photos)” section content.
              </p>
            </div>
            <Tabs defaultValue="review-content" className="w-full">
              <TabsList className="grid grid-cols-4 md:grid-cols-4">
              <TabsTrigger value="review-content">Content</TabsTrigger>
              <TabsTrigger value="review-images">Images</TabsTrigger>
              <TabsTrigger value="review-preview">Preview</TabsTrigger>
              <TabsTrigger value="review-actions">Actions</TabsTrigger>
            </TabsList>

              <TabsContent value="review-content" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Content</CardTitle>
                    <CardDescription>Eyebrow, title, description, and CTA for the review moments section.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Eyebrow</label>
                      <Input
                        value={reviewData.eyebrow}
                        onChange={(e) => setReviewData((prev) => ({ ...prev, eyebrow: e.target.value }))}
                        placeholder="What is ICE Exhibitions"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                      <Input
                        value={reviewData.title}
                        onChange={(e) => setReviewData((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Infographics & Photos"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                      <Input
                        value={reviewData.description}
                        onChange={(e) => setReviewData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="A quick visual walkthrough..."
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">CTA Label</label>
                        <Input
                          value={reviewData.ctaLabel}
                          onChange={(e) => setReviewData((prev) => ({ ...prev, ctaLabel: e.target.value }))}
                          placeholder="Explore Full Gallery"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">CTA Href</label>
                        <Input
                          value={reviewData.ctaHref}
                          onChange={(e) => setReviewData((prev) => ({ ...prev, ctaHref: e.target.value }))}
                          placeholder="/gallery"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="review-images" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Images</CardTitle>
                    <CardDescription>Images shown in the review moments mosaic.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {reviewData.images.map((img, idx) => (
                      <div key={idx} className="grid md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                        <Input
                          value={img.src}
                          onChange={(e) =>
                            setReviewData((prev) => {
                              const next = [...prev.images];
                              next[idx] = { ...next[idx], src: e.target.value };
                              return { ...prev, images: next };
                            })
                          }
                          placeholder="https://..."
                        />
                        <Input
                          value={img.href}
                          onChange={(e) =>
                            setReviewData((prev) => {
                              const next = [...prev.images];
                              next[idx] = { ...next[idx], href: e.target.value };
                              return { ...prev, images: next };
                            })
                          }
                          placeholder="/gallery/some-id"
                        />
                        <Button variant="ghost" size="icon" onClick={() => removeReviewImage(idx)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {!reviewData.images.length && (
                      <p className="text-sm text-muted-foreground">No images yet.</p>
                    )}
                    <div className="flex justify-end">
                      <Button variant="outline" onClick={addReviewImage}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add image
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="review-preview" className="mt-4">
                <Card className="bg-card/70 border-border/60">
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>Static preview of the review moments section.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <div className="font-semibold">{reviewData.eyebrow}</div>
                      <div className="text-xl font-display">{reviewData.title}</div>
                      <div className="text-muted-foreground">{reviewData.description}</div>
                      <div className="text-primary text-sm mt-1">
                        {reviewData.ctaLabel} → {reviewData.ctaHref}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {reviewData.images.map((img, idx) => (
                        <div key={idx} className="rounded-xl overflow-hidden border border-border/60 bg-card/80">
                          <img src={img.src} alt={`Preview ${idx}`} className="w-full h-32 object-cover" />
                          <div className="p-2 text-xs text-primary">{img.href}</div>
                        </div>
                      ))}
                      {!reviewData.images.length && (
                        <p className="text-sm text-muted-foreground col-span-full">
                          No images to preview.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="review-actions" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>Restore defaults or publish changes for the review section.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap justify-end gap-3">
                    <Button variant="outline" onClick={restoreReview} disabled={saving || loading}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restore defaults
                    </Button>
                    <Button onClick={saveReview} disabled={saving || loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "Saving..." : "Save review"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="pt-10 space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-display font-semibold">Brand Highlights Editor</h2>
              <p className="text-muted-foreground text-sm">
                Manage the “Brands logo / Trustworthy Leaders” section content.
              </p>
            </div>
            <Tabs defaultValue="brands-content" className="w-full">
              <TabsList className="grid grid-cols-4 md:grid-cols-4">
                <TabsTrigger value="brands-content">Content</TabsTrigger>
                <TabsTrigger value="brands-list">Brands</TabsTrigger>
                <TabsTrigger value="brands-preview">Preview</TabsTrigger>
                <TabsTrigger value="brands-actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="brands-content" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Content</CardTitle>
                    <CardDescription>Eyebrow, title, and description for the brand highlights.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Eyebrow</label>
                      <Input
                        value={brandsData.eyebrow}
                        onChange={(e) => setBrandsData((prev) => ({ ...prev, eyebrow: e.target.value }))}
                        placeholder="Trustworthy Leaders"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                      <Input
                        value={brandsData.title}
                        onChange={(e) => setBrandsData((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Brands that trust ICE Exhibitions"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                      <Input
                        value={brandsData.description}
                        onChange={(e) => setBrandsData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Logos and stories from partners..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="brands-list" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Brands</CardTitle>
                      <CardDescription>Cards shown in the brand highlights section.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {brandsData.brands.map((brand, idx) => (
                      <div key={idx} className="grid md:grid-cols-3 gap-3 items-end border border-border/60 rounded-xl p-3">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Name</label>
                          <Input
                            value={brand.name}
                            onChange={(e) =>
                              setBrandsData((prev) => {
                                const next = [...prev.brands];
                                next[idx] = { ...next[idx], name: e.target.value };
                                return { ...prev, brands: next };
                              })
                            }
                            placeholder="Brand name"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Slug</label>
                          <Input
                            value={brand.slug}
                            onChange={(e) =>
                              setBrandsData((prev) => {
                                const next = [...prev.brands];
                                next[idx] = { ...next[idx], slug: e.target.value };
                                return { ...prev, brands: next };
                              })
                            }
                            placeholder="brand-slug"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Logo</label>
                          <Input
                            value={brand.logo}
                            onChange={(e) =>
                              setBrandsData((prev) => {
                                const next = [...prev.brands];
                                next[idx] = { ...next[idx], logo: e.target.value };
                                return { ...prev, brands: next };
                              })
                            }
                            placeholder="TV"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Relationship</label>
                          <Input
                            value={brand.relationship}
                            onChange={(e) =>
                              setBrandsData((prev) => {
                                const next = [...prev.brands];
                                next[idx] = { ...next[idx], relationship: e.target.value };
                                return { ...prev, brands: next };
                              })
                            }
                            placeholder="3-Year Partner"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Category</label>
                          <Input
                            value={brand.category}
                            onChange={(e) =>
                              setBrandsData((prev) => {
                                const next = [...prev.brands];
                                next[idx] = { ...next[idx], category: e.target.value };
                                return { ...prev, brands: next };
                              })
                            }
                            placeholder="Technology"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Image URL</label>
                          <Input
                            value={brand.image}
                            onChange={(e) =>
                              setBrandsData((prev) => {
                                const next = [...prev.brands];
                                next[idx] = { ...next[idx], image: e.target.value };
                                return { ...prev, brands: next };
                              })
                            }
                            placeholder="https://..."
                          />
                        </div>
                        <div className="flex justify-end md:col-span-3">
                          <Button variant="ghost" size="icon" onClick={() => removeBrand(idx)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {!brandsData.brands.length && (
                      <p className="text-sm text-muted-foreground">No brands yet.</p>
                    )}
                    <div className="flex justify-end">
                      <Button variant="outline" onClick={addBrand}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add brand
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="brands-preview" className="mt-4">
                <Card className="bg-card/70 border-border/60">
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>Static preview of the brand highlights.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <div className="font-semibold">{brandsData.eyebrow}</div>
                      <div className="text-xl font-display">{brandsData.title}</div>
                      <div className="text-muted-foreground">{brandsData.description}</div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {brandsData.brands.map((brand) => (
                        <div key={brand.slug} className="rounded-xl border border-border/60 bg-card/80 p-3 space-y-2">
                          <img src={brand.image} alt={brand.name} className="w-full h-24 object-cover rounded-lg" />
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold">{brand.name}</div>
                              <div className="text-xs text-muted-foreground">{brand.relationship}</div>
                            </div>
                            <Badge variant="secondary">{brand.category}</Badge>
                          </div>
                        </div>
                      ))}
                      {!brandsData.brands.length && (
                        <p className="text-sm text-muted-foreground col-span-full">
                          No brands to preview.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="brands-actions" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>Restore defaults or publish changes for brand highlights.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap justify-end gap-3">
                    <Button variant="outline" onClick={restoreBrands} disabled={saving || loading}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restore defaults
                    </Button>
                    <Button onClick={saveBrands} disabled={saving || loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "Saving..." : "Save brands"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="pt-10 space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-display font-semibold">Celebrity Spotlight Editor</h2>
              <p className="text-muted-foreground text-sm">
                Manage the “Celebrity photos” section content.
              </p>
            </div>
            <Tabs defaultValue="celeb-content" className="w-full">
              <TabsList className="grid grid-cols-4 md:grid-cols-4">
                <TabsTrigger value="celeb-content">Content</TabsTrigger>
                <TabsTrigger value="celeb-list">Celebrities</TabsTrigger>
                <TabsTrigger value="celeb-preview">Preview</TabsTrigger>
                <TabsTrigger value="celeb-actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="celeb-content" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Content</CardTitle>
                    <CardDescription>Eyebrow, title, and description for the celebrity section.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Eyebrow</label>
                      <Input
                        value={celebsData.eyebrow}
                        onChange={(e) => setCelebsData((prev) => ({ ...prev, eyebrow: e.target.value }))}
                        placeholder="Celebrity Photos"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                      <Input
                        value={celebsData.title}
                        onChange={(e) => setCelebsData((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Faces that amplify the spotlight"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                      <Input
                        value={celebsData.description}
                        onChange={(e) => setCelebsData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="A rotating showcase..."
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">CTA Label</label>
                        <Input
                          value={celebsData.ctaLabel}
                          onChange={(e) => setCelebsData((prev) => ({ ...prev, ctaLabel: e.target.value }))}
                          placeholder="See all appearances"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">CTA Href</label>
                        <Input
                          value={celebsData.ctaHref}
                          onChange={(e) => setCelebsData((prev) => ({ ...prev, ctaHref: e.target.value }))}
                          placeholder="/gallery"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="celeb-list" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Celebrities</CardTitle>
                      <CardDescription>Cards shown in the celebrity spotlight section.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {celebsData.celebrities.map((celeb, idx) => (
                      <div key={idx} className="grid md:grid-cols-3 gap-3 items-end border border-border/60 rounded-xl p-3">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Name</label>
                          <Input
                            value={celeb.name}
                            onChange={(e) =>
                              setCelebsData((prev) => {
                                const next = [...prev.celebrities];
                                next[idx] = { ...next[idx], name: e.target.value };
                                return { ...prev, celebrities: next };
                              })
                            }
                            placeholder="Name"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Title/Role</label>
                          <Input
                            value={celeb.title}
                            onChange={(e) =>
                              setCelebsData((prev) => {
                                const next = [...prev.celebrities];
                                next[idx] = { ...next[idx], title: e.target.value };
                                return { ...prev, celebrities: next };
                              })
                            }
                            placeholder="Film Actor"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Badge</label>
                          <Input
                            value={celeb.badge}
                            onChange={(e) =>
                              setCelebsData((prev) => {
                                const next = [...prev.celebrities];
                                next[idx] = { ...next[idx], badge: e.target.value };
                                return { ...prev, celebrities: next };
                              })
                            }
                            placeholder="Keynote Guest"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs text-muted-foreground mb-1 block">Quote</label>
                          <Input
                            value={celeb.quote}
                            onChange={(e) =>
                              setCelebsData((prev) => {
                                const next = [...prev.celebrities];
                                next[idx] = { ...next[idx], quote: e.target.value };
                                return { ...prev, celebrities: next };
                              })
                            }
                            placeholder="Quote"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Image URL</label>
                          <Input
                            value={celeb.image}
                            onChange={(e) =>
                              setCelebsData((prev) => {
                                const next = [...prev.celebrities];
                                next[idx] = { ...next[idx], image: e.target.value };
                                return { ...prev, celebrities: next };
                              })
                            }
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">CTA Href</label>
                          <Input
                            value={celeb.href}
                            onChange={(e) =>
                              setCelebsData((prev) => {
                                const next = [...prev.celebrities];
                                next[idx] = { ...next[idx], href: e.target.value };
                                return { ...prev, celebrities: next };
                              })
                            }
                            placeholder="/gallery"
                          />
                        </div>
                        <div className="flex justify-end md:col-span-3">
                          <Button variant="ghost" size="icon" onClick={() => removeCeleb(idx)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {!celebsData.celebrities.length && (
                      <p className="text-sm text-muted-foreground">No celebrities yet.</p>
                    )}
                    <div className="flex justify-end">
                      <Button variant="outline" onClick={addCeleb}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add celebrity
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="celeb-preview" className="mt-4">
                <Card className="bg-card/70 border-border/60">
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>Static preview of the celebrity spotlight.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <div className="font-semibold">{celebsData.eyebrow}</div>
                      <div className="text-xl font-display">{celebsData.title}</div>
                      <div className="text-muted-foreground">{celebsData.description}</div>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {celebsData.celebrities.map((celeb, idx) => (
                        <div key={idx} className="rounded-xl border border-border/60 bg-card/80 overflow-hidden">
                          <img src={celeb.image} alt={celeb.name} className="w-full h-32 object-cover" />
                          <div className="p-3 space-y-1">
                            <div className="font-semibold text-sm">{celeb.name}</div>
                            <div className="text-xs text-muted-foreground">{celeb.title}</div>
                            <div className="text-xs text-primary">{celeb.badge}</div>
                            <div className="text-xs text-muted-foreground line-clamp-2">“{celeb.quote}”</div>
                          </div>
                        </div>
                      ))}
                      {!celebsData.celebrities.length && (
                        <p className="text-sm text-muted-foreground col-span-full">
                          No celebrities to preview.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="celeb-actions" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>Restore defaults or publish changes for celebrity spotlight.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap justify-end gap-3">
                    <Button variant="outline" onClick={restoreCelebs} disabled={saving || loading}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restore defaults
                    </Button>
                    <Button onClick={saveCelebs} disabled={saving || loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "Saving..." : "Save celebrities"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="pt-10 space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-display font-semibold">Seller Signals Editor</h2>
              <p className="text-muted-foreground text-sm">
                Manage the “Testimony of sellers” section content.
              </p>
            </div>
            <Tabs defaultValue="sellers-content" className="w-full">
              <TabsList className="grid grid-cols-4 md:grid-cols-4">
                <TabsTrigger value="sellers-content">Content</TabsTrigger>
                <TabsTrigger value="sellers-list">Sellers</TabsTrigger>
                <TabsTrigger value="sellers-preview">Preview</TabsTrigger>
                <TabsTrigger value="sellers-actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="sellers-content" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Content</CardTitle>
                    <CardDescription>Eyebrow, title, and description for the sellers section.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Eyebrow</label>
                      <Input
                        value={sellersData.eyebrow}
                        onChange={(e) => setSellersData((prev) => ({ ...prev, eyebrow: e.target.value }))}
                        placeholder="Seller Voices"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                      <Input
                        value={sellersData.title}
                        onChange={(e) => setSellersData((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Proof from the sellers’ side"
                      />
                    </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                    <Input
                      value={sellersData.description}
                      onChange={(e) => setSellersData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Momentum snapshots..."
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">CTA Label</label>
                      <Input
                        value={sellersData.ctaLabel}
                        onChange={(e) => setSellersData((prev) => ({ ...prev, ctaLabel: e.target.value }))}
                        placeholder="See all seller wins"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">CTA Href</label>
                      <Input
                        value={sellersData.ctaHref}
                        onChange={(e) => setSellersData((prev) => ({ ...prev, ctaHref: e.target.value }))}
                        placeholder="/gallery"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

              <TabsContent value="sellers-list" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Sellers</CardTitle>
                      <CardDescription>Cards shown in the seller signals section.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {sellersData.sellers.map((seller, idx) => (
                      <div key={seller.id || idx} className="grid md:grid-cols-3 gap-3 items-end border border-border/60 rounded-xl p-3">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Name</label>
                          <Input
                            value={seller.name}
                            onChange={(e) =>
                              setSellersData((prev) => {
                                const next = [...prev.sellers];
                                next[idx] = { ...next[idx], name: e.target.value };
                                return { ...prev, sellers: next };
                              })
                            }
                            placeholder="Name"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Role</label>
                          <Input
                            value={seller.role}
                            onChange={(e) =>
                              setSellersData((prev) => {
                                const next = [...prev.sellers];
                                next[idx] = { ...next[idx], role: e.target.value };
                                return { ...prev, sellers: next };
                              })
                            }
                            placeholder="Founder"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Company</label>
                          <Input
                            value={seller.company}
                            onChange={(e) =>
                              setSellersData((prev) => {
                                const next = [...prev.sellers];
                                next[idx] = { ...next[idx], company: e.target.value };
                                return { ...prev, sellers: next };
                              })
                            }
                            placeholder="Studio Meridian"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs text-muted-foreground mb-1 block">Quote</label>
                          <Input
                            value={seller.quote}
                            onChange={(e) =>
                              setSellersData((prev) => {
                                const next = [...prev.sellers];
                                next[idx] = { ...next[idx], quote: e.target.value };
                                return { ...prev, sellers: next };
                              })
                            }
                            placeholder="Testimonial"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Outcome</label>
                          <Input
                            value={seller.outcome}
                            onChange={(e) =>
                              setSellersData((prev) => {
                                const next = [...prev.sellers];
                                next[idx] = { ...next[idx], outcome: e.target.value };
                                return { ...prev, sellers: next };
                              })
                            }
                            placeholder="+42% repeat visits"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Image URL</label>
                          <Input
                            value={seller.image}
                            onChange={(e) =>
                              setSellersData((prev) => {
                                const next = [...prev.sellers];
                                next[idx] = { ...next[idx], image: e.target.value };
                                return { ...prev, sellers: next };
                              })
                            }
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">CTA / Link</label>
                          <Input
                            value={seller.href || ""}
                            onChange={(e) =>
                              setSellersData((prev) => {
                                const next = [...prev.sellers];
                                next[idx] = { ...next[idx], href: e.target.value };
                                return { ...prev, sellers: next };
                              })
                            }
                            placeholder="/stories/seller-1"
                          />
                        </div>
                        <div className="flex justify-end md:col-span-3">
                          <Button variant="ghost" size="icon" onClick={() => removeSeller(idx)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {!sellersData.sellers.length && (
                      <p className="text-sm text-muted-foreground">No sellers yet.</p>
                    )}
                    <div className="flex justify-end">
                      <Button variant="outline" onClick={addSeller}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add seller
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sellers-preview" className="mt-4">
                <Card className="bg-card/70 border-border/60">
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>Static preview of the seller signals.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <div className="font-semibold">{sellersData.eyebrow}</div>
                      <div className="text-xl font-display">{sellersData.title}</div>
                      <div className="text-muted-foreground">{sellersData.description}</div>
                      {(sellersData.ctaLabel || sellersData.ctaHref) && (
                        <div className="text-primary text-xs mt-1">
                          {sellersData.ctaLabel} → {sellersData.ctaHref}
                        </div>
                      )}
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {sellersData.sellers.map((seller) => (
                        <div key={seller.id} className="rounded-xl border border-border/60 bg-card/80 p-4 space-y-2">
                          <img src={seller.image} alt={seller.name} className="w-full h-28 object-cover rounded-lg" />
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-sm">{seller.name}</div>
                              <div className="text-xs text-muted-foreground">{seller.role}</div>
                            </div>
                            <Badge variant="secondary">{seller.company}</Badge>
                          </div>
                          <div className="text-xs text-primary">{seller.outcome}</div>
                          <div className="text-xs text-muted-foreground line-clamp-2">“{seller.quote}”</div>
                        </div>
                      ))}
                      {!sellersData.sellers.length && (
                        <p className="text-sm text-muted-foreground col-span-full">
                          No sellers to preview.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sellers-actions" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>Restore defaults or publish changes for seller signals.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap justify-end gap-3">
                    <Button variant="outline" onClick={restoreSellers} disabled={saving || loading}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restore defaults
                    </Button>
                    <Button onClick={saveSellers} disabled={saving || loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "Saving..." : "Save sellers"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="pt-10 space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-display font-semibold">Buyer Voices Editor</h2>
              <p className="text-muted-foreground text-sm">
                Manage the “Testimony of buyers” section content.
              </p>
            </div>
            <Tabs defaultValue="buyers-content" className="w-full">
              <TabsList className="grid grid-cols-4 md:grid-cols-4">
                <TabsTrigger value="buyers-content">Content</TabsTrigger>
                <TabsTrigger value="buyers-list">Buyers</TabsTrigger>
                <TabsTrigger value="buyers-preview">Preview</TabsTrigger>
                <TabsTrigger value="buyers-actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="buyers-content" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Content</CardTitle>
                    <CardDescription>Eyebrow, title, description, and CTA for the buyers section.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Eyebrow</label>
                      <Input
                        value={buyersData.eyebrow}
                        onChange={(e) => setBuyersData((prev) => ({ ...prev, eyebrow: e.target.value }))}
                        placeholder="Buyer Voices"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                      <Input
                        value={buyersData.title}
                        onChange={(e) => setBuyersData((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Why buyers keep coming back"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                      <Input
                        value={buyersData.description}
                        onChange={(e) => setBuyersData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Decision-makers and superfans..."
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">CTA Label</label>
                        <Input
                          value={buyersData.ctaLabel}
                          onChange={(e) => setBuyersData((prev) => ({ ...prev, ctaLabel: e.target.value }))}
                          placeholder="See all buyer stories"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">CTA Href</label>
                        <Input
                          value={buyersData.ctaHref}
                          onChange={(e) => setBuyersData((prev) => ({ ...prev, ctaHref: e.target.value }))}
                          placeholder="/buyers"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="buyers-list" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Buyers</CardTitle>
                      <CardDescription>Cards shown in the buyer voices section.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {buyersData.buyers.map((buyer, idx) => (
                      <div key={buyer.id || idx} className="grid md:grid-cols-3 gap-3 items-end border border-border/60 rounded-xl p-3">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Name</label>
                          <Input
                            value={buyer.name}
                            onChange={(e) =>
                              setBuyersData((prev) => {
                                const next = [...prev.buyers];
                                next[idx] = { ...next[idx], name: e.target.value };
                                return { ...prev, buyers: next };
                              })
                            }
                            placeholder="Name"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">City</label>
                          <Input
                            value={buyer.city}
                            onChange={(e) =>
                              setBuyersData((prev) => {
                                const next = [...prev.buyers];
                                next[idx] = { ...next[idx], city: e.target.value };
                                return { ...prev, buyers: next };
                              })
                            }
                            placeholder="Mumbai"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Segment</label>
                          <Input
                            value={buyer.segment}
                            onChange={(e) =>
                              setBuyersData((prev) => {
                                const next = [...prev.buyers];
                                next[idx] = { ...next[idx], segment: e.target.value };
                                return { ...prev, buyers: next };
                              })
                            }
                            placeholder="Lifestyle buyer"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs text-muted-foreground mb-1 block">Quote</label>
                          <Input
                            value={buyer.quote}
                            onChange={(e) =>
                              setBuyersData((prev) => {
                                const next = [...prev.buyers];
                                next[idx] = { ...next[idx], quote: e.target.value };
                                return { ...prev, buyers: next };
                              })
                            }
                            placeholder="Testimonial"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Spend</label>
                          <Input
                            value={buyer.spend}
                            onChange={(e) =>
                              setBuyersData((prev) => {
                                const next = [...prev.buyers];
                                next[idx] = { ...next[idx], spend: e.target.value };
                                return { ...prev, buyers: next };
                              })
                            }
                            placeholder="Avg. cart: ₹18K"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Visits</label>
                          <Input
                            value={buyer.visits}
                            onChange={(e) =>
                              setBuyersData((prev) => {
                                const next = [...prev.buyers];
                                next[idx] = { ...next[idx], visits: e.target.value };
                                return { ...prev, buyers: next };
                              })
                            }
                            placeholder="4th year"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Image URL</label>
                          <Input
                            value={buyer.image}
                            onChange={(e) =>
                              setBuyersData((prev) => {
                                const next = [...prev.buyers];
                                next[idx] = { ...next[idx], image: e.target.value };
                                return { ...prev, buyers: next };
                              })
                            }
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">CTA / Link</label>
                          <Input
                            value={buyer.href || ""}
                            onChange={(e) =>
                              setBuyersData((prev) => {
                                const next = [...prev.buyers];
                                next[idx] = { ...next[idx], href: e.target.value };
                                return { ...prev, buyers: next };
                              })
                            }
                            placeholder="/buyers/aanya-singh"
                          />
                        </div>
                        <div className="flex justify-end md:col-span-3">
                          <Button variant="ghost" size="icon" onClick={() => removeBuyer(idx)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {!buyersData.buyers.length && (
                      <p className="text-sm text-muted-foreground">No buyers yet.</p>
                    )}
                    <div className="flex justify-end">
                      <Button variant="outline" onClick={addBuyer}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add buyer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="buyers-preview" className="mt-4">
                <Card className="bg-card/70 border-border/60">
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>Static preview of the buyer voices.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <div className="font-semibold">{buyersData.eyebrow}</div>
                      <div className="text-xl font-display">{buyersData.title}</div>
                      <div className="text-muted-foreground">{buyersData.description}</div>
                      {(buyersData.ctaLabel || buyersData.ctaHref) && (
                        <div className="text-primary text-xs mt-1">
                          {buyersData.ctaLabel} → {buyersData.ctaHref}
                        </div>
                      )}
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {buyersData.buyers.map((buyer) => (
                        <div key={buyer.id} className="rounded-xl border border-border/60 bg-card/80 p-4 space-y-2">
                          <img src={buyer.image} alt={buyer.name} className="w-full h-28 object-cover rounded-lg" />
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-sm">{buyer.name}</div>
                              <div className="text-xs text-muted-foreground">{buyer.city}</div>
                            </div>
                            <Badge variant="secondary">{buyer.segment}</Badge>
                          </div>
                          <div className="text-xs text-primary">{buyer.spend}</div>
                          <div className="text-xs text-muted-foreground line-clamp-2">“{buyer.quote}”</div>
                        </div>
                      ))}
                      {!buyersData.buyers.length && (
                        <p className="text-sm text-muted-foreground col-span-full">
                          No buyers to preview.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="buyers-actions" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>Restore defaults or publish changes for buyer voices.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap justify-end gap-3">
                    <Button variant="outline" onClick={restoreBuyers} disabled={saving || loading}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restore defaults
                    </Button>
                    <Button onClick={saveBuyers} disabled={saving || loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "Saving..." : "Save buyers"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="pt-10 space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-display font-semibold">Timeline Editor</h2>
              <p className="text-muted-foreground text-sm">
                Manage the “30 Years History / Journey Timeline (Legacy in Motion)” section content.
              </p>
            </div>
            <Tabs defaultValue="timeline-content" className="w-full">
              <TabsList className="grid grid-cols-4 md:grid-cols-4">
                <TabsTrigger value="timeline-content">Content</TabsTrigger>
                <TabsTrigger value="timeline-list">Milestones</TabsTrigger>
                <TabsTrigger value="timeline-preview">Preview</TabsTrigger>
                <TabsTrigger value="timeline-actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="timeline-content" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Content</CardTitle>
                    <CardDescription>Eyebrow, title, and description for the timeline intro block.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Eyebrow</label>
                      <Input
                        value={timelineData.eyebrow}
                        onChange={(e) => setTimelineData((prev) => ({ ...prev, eyebrow: e.target.value }))}
                        placeholder="30 Years • Legacy in Motion"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                      <Input
                        value={timelineData.title}
                        onChange={(e) => setTimelineData((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="ICE Exhibitions Journey Timeline"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                      <Input
                        value={timelineData.description}
                        onChange={(e) => setTimelineData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="From the first city arch to a 10-city hybrid circuit..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline-list" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Milestones</CardTitle>
                      <CardDescription>Entries shown in the sticky scroll timeline.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {timelineData.milestones.map((item, idx) => (
                      <div key={idx} className="grid md:grid-cols-3 gap-3 items-end border border-border/60 rounded-xl p-3">
                        <div className="md:col-span-2">
                          <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                          <Input
                            value={item.title}
                            onChange={(e) =>
                              setTimelineData((prev) => {
                                const next = [...prev.milestones];
                                next[idx] = { ...next[idx], title: e.target.value };
                                return { ...prev, milestones: next };
                              })
                            }
                            placeholder="1994 — The First Arch"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Image URL</label>
                          <Input
                            value={item.image || ""}
                            onChange={(e) =>
                              setTimelineData((prev) => {
                                const next = [...prev.milestones];
                                next[idx] = { ...next[idx], image: e.target.value };
                                return { ...prev, milestones: next };
                              })
                            }
                            placeholder="https://..."
                          />
                        </div>
                        <div className="md:col-span-3">
                          <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                          <Input
                            value={item.description}
                            onChange={(e) =>
                              setTimelineData((prev) => {
                                const next = [...prev.milestones];
                                next[idx] = { ...next[idx], description: e.target.value };
                                return { ...prev, milestones: next };
                              })
                            }
                            placeholder="Milestone description"
                          />
                        </div>
                        <div className="flex justify-end md:col-span-3">
                          <Button variant="ghost" size="icon" onClick={() => removeMilestone(idx)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {!timelineData.milestones.length && (
                      <p className="text-sm text-muted-foreground">No milestones yet.</p>
                    )}
                    <div className="flex justify-end">
                      <Button variant="outline" onClick={addMilestone}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add milestone
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline-preview" className="mt-4">
                <Card className="bg-card/70 border-border/60">
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>Static preview of the timeline intro and milestones.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <div className="font-semibold">{timelineData.eyebrow}</div>
                      <div className="text-xl font-display">{timelineData.title}</div>
                      <div className="text-muted-foreground">{timelineData.description}</div>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {timelineData.milestones.map((item, idx) => (
                        <div key={idx} className="rounded-xl border border-border/60 bg-card/80 overflow-hidden">
                          {item.image && (
                            <img src={item.image} alt={item.title} className="w-full h-28 object-cover" />
                          )}
                          <div className="p-3 space-y-1">
                            <div className="font-semibold text-sm">{item.title}</div>
                            <div className="text-xs text-muted-foreground line-clamp-2">{item.description}</div>
                          </div>
                        </div>
                      ))}
                      {!timelineData.milestones.length && (
                        <p className="text-sm text-muted-foreground col-span-full">
                          No milestones to preview.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline-actions" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>Restore defaults or publish changes for the timeline.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap justify-end gap-3">
                    <Button variant="outline" onClick={restoreTimeline} disabled={saving || loading}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restore defaults
                    </Button>
                    <Button onClick={saveTimeline} disabled={saving || loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "Saving..." : "Save timeline"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="pt-10 space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-display font-semibold">Entrance Arches Editor</h2>
              <p className="text-muted-foreground text-sm">
                Manage the “Mega Entrance Arches (10 cities, 30 years)” section content.
              </p>
            </div>
            <Tabs defaultValue="arches-content" className="w-full">
              <TabsList className="grid grid-cols-4 md:grid-cols-4">
                <TabsTrigger value="arches-content">Content</TabsTrigger>
                <TabsTrigger value="arches-list">Arches</TabsTrigger>
                <TabsTrigger value="arches-preview">Preview</TabsTrigger>
                <TabsTrigger value="arches-actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="arches-content" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Content</CardTitle>
                    <CardDescription>Eyebrow, title, and description for the entrance arches section.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Eyebrow</label>
                      <Input
                        value={archesData.eyebrow}
                        onChange={(e) => setArchesData((prev) => ({ ...prev, eyebrow: e.target.value }))}
                        placeholder="Review the moment"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                      <Input
                        value={archesData.title}
                        onChange={(e) => setArchesData((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Mega Entrance Arches across 10 cities"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                      <Input
                        value={archesData.description}
                        onChange={(e) => setArchesData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Three decades of arches engineered for arrivals..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="arches-list" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Arches</CardTitle>
                      <CardDescription>Cards shown in the mega entrance arches section.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {archesData.arches.map((arch, idx) => (
                      <div key={idx} className="grid md:grid-cols-3 gap-3 items-end border border-border/60 rounded-xl p-3">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">City</label>
                          <Input
                            value={arch.city}
                            onChange={(e) =>
                              setArchesData((prev) => {
                                const next = [...prev.arches];
                                next[idx] = { ...next[idx], city: e.target.value };
                                return { ...prev, arches: next };
                              })
                            }
                            placeholder="Mumbai"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Year</label>
                          <Input
                            value={arch.year}
                            onChange={(e) =>
                              setArchesData((prev) => {
                                const next = [...prev.arches];
                                next[idx] = { ...next[idx], year: e.target.value };
                                return { ...prev, arches: next };
                              })
                            }
                            placeholder="1994"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Image URL</label>
                          <Input
                            value={arch.image}
                            onChange={(e) =>
                              setArchesData((prev) => {
                                const next = [...prev.arches];
                                next[idx] = { ...next[idx], image: e.target.value };
                                return { ...prev, arches: next };
                              })
                            }
                            placeholder="https://..."
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs text-muted-foreground mb-1 block">Highlight</label>
                          <Input
                            value={arch.highlight}
                            onChange={(e) =>
                              setArchesData((prev) => {
                                const next = [...prev.arches];
                                next[idx] = { ...next[idx], highlight: e.target.value };
                                return { ...prev, arches: next };
                              })
                            }
                            placeholder="The very first arch..."
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">CTA / Link</label>
                          <Input
                            value={arch.href || ""}
                            onChange={(e) =>
                              setArchesData((prev) => {
                                const next = [...prev.arches];
                                next[idx] = { ...next[idx], href: e.target.value };
                                return { ...prev, arches: next };
                              })
                            }
                            placeholder="/gallery/mumbai-arch"
                          />
                        </div>
                        <div className="flex justify-end md:col-span-3">
                          <Button variant="ghost" size="icon" onClick={() => removeArch(idx)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {!archesData.arches.length && (
                      <p className="text-sm text-muted-foreground">No arches yet.</p>
                    )}
                    <div className="flex justify-end">
                      <Button variant="outline" onClick={addArch}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add arch
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="arches-preview" className="mt-4">
                <Card className="bg-card/70 border-border/60">
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>Static preview of the entrance arches.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <div className="font-semibold">{archesData.eyebrow}</div>
                      <div className="text-xl font-display">{archesData.title}</div>
                      <div className="text-muted-foreground">{archesData.description}</div>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {archesData.arches.map((arch, idx) => (
                        <div key={idx} className="rounded-xl border border-border/60 bg-card/80 overflow-hidden">
                          <img src={arch.image} alt={arch.city} className="w-full h-28 object-cover" />
                          <div className="p-3 space-y-1">
                            <div className="flex items-center justify-between text-sm font-semibold">
                              <span>{arch.city}</span>
                              <span className="text-xs text-primary">{arch.year}</span>
                            </div>
                            <div className="text-xs text-muted-foreground line-clamp-2">{arch.highlight}</div>
                            {arch.href && <div className="text-[11px] text-primary">{arch.href}</div>}
                          </div>
                        </div>
                      ))}
                      {!archesData.arches.length && (
                        <p className="text-sm text-muted-foreground col-span-full">
                          No arches to preview.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="arches-actions" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>Restore defaults or publish changes for entrance arches.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap justify-end gap-3">
                    <Button variant="outline" onClick={restoreArches} disabled={saving || loading}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restore defaults
                    </Button>
                    <Button onClick={saveArches} disabled={saving || loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "Saving..." : "Save arches"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="pt-10 space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-display font-semibold">Stalls Mosaic Editor</h2>
              <p className="text-muted-foreground text-sm">
                Manage the “10,000+ brands & seller stalls” section content.
              </p>
            </div>
            <Tabs defaultValue="stalls-content" className="w-full">
              <TabsList className="grid grid-cols-4 md:grid-cols-4">
                <TabsTrigger value="stalls-content">Content</TabsTrigger>
                <TabsTrigger value="stalls-images">Images</TabsTrigger>
                <TabsTrigger value="stalls-preview">Preview</TabsTrigger>
                <TabsTrigger value="stalls-actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="stalls-content" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Content</CardTitle>
                    <CardDescription>Eyebrow, title, description, stats, and CTA for the stalls mosaic.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Eyebrow</label>
                      <Input
                        value={stallsData.eyebrow}
                        onChange={(e) => setStallsData((prev) => ({ ...prev, eyebrow: e.target.value }))}
                        placeholder="Review the moment"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                      <Input
                        value={stallsData.title}
                        onChange={(e) => setStallsData((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="10,000+ brands & seller stalls"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                      <Input
                        value={stallsData.description}
                        onChange={(e) => setStallsData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="A visual atlas of the booths and showcases..."
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">CTA Label</label>
                        <Input
                          value={stallsData.ctaLabel}
                          onChange={(e) => setStallsData((prev) => ({ ...prev, ctaLabel: e.target.value }))}
                          placeholder="See the full archive"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">CTA Href</label>
                        <Input
                          value={stallsData.ctaHref}
                          onChange={(e) => setStallsData((prev) => ({ ...prev, ctaHref: e.target.value }))}
                          placeholder="/gallery"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground block">Stats</label>
                      {(stallsData.stats || []).map((stat, idx) => (
                        <div key={idx} className="grid md:grid-cols-3 gap-3 items-end">
                          <Input
                            value={stat.value}
                            onChange={(e) =>
                              setStallsData((prev) => {
                                const next = [...(prev.stats || [])];
                                next[idx] = { ...next[idx], value: e.target.value };
                                return { ...prev, stats: next };
                              })
                            }
                            placeholder="10,000+"
                          />
                          <Input
                            value={stat.label}
                            onChange={(e) =>
                              setStallsData((prev) => {
                                const next = [...(prev.stats || [])];
                                next[idx] = { ...next[idx], label: e.target.value };
                                return { ...prev, stats: next };
                              })
                            }
                            placeholder="brands & sellers"
                          />
                          <Input
                            value={stat.icon || ""}
                            onChange={(e) =>
                              setStallsData((prev) => {
                                const next = [...(prev.stats || [])];
                                next[idx] = { ...next[idx], icon: e.target.value as any };
                                return { ...prev, stats: next };
                              })
                            }
                            placeholder="grid or users"
                          />
                        </div>
                      ))}
                      {(!stallsData.stats || !stallsData.stats.length) && (
                        <p className="text-sm text-muted-foreground">No stats yet.</p>
                      )}
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          onClick={() =>
                            setStallsData((prev) => ({
                              ...prev,
                              stats: [...(prev.stats || []), { value: "", label: "", icon: "grid" }],
                            }))
                          }
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add stat
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() =>
                            setStallsData((prev) => ({
                              ...prev,
                              stats: prev.stats && prev.stats.length > 0 ? prev.stats.slice(0, -1) : [],
                            }))
                          }
                        >
                          Remove last
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stalls-images" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Images</CardTitle>
                      <CardDescription>Images shown in the stalls parallax mosaic.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {stallsData.images.map((img, idx) => (
                      <div key={idx} className="grid md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                        <Input
                          value={typeof img === "string" ? img : img.src}
                          onChange={(e) =>
                            setStallsData((prev) => {
                              const next = [...prev.images] as any[];
                              const current = typeof next[idx] === "string" ? { src: next[idx] as string } : next[idx];
                              next[idx] = { ...current, src: e.target.value };
                              return { ...prev, images: next };
                            })
                          }
                          placeholder="https://..."
                        />
                        <Input
                          value={typeof img === "string" ? "" : img.href || ""}
                          onChange={(e) =>
                            setStallsData((prev) => {
                              const next = [...prev.images] as any[];
                              const current = typeof next[idx] === "string" ? { src: next[idx] as string } : next[idx];
                              next[idx] = { ...current, href: e.target.value };
                              return { ...prev, images: next };
                            })
                          }
                          placeholder="/gallery/stall-1"
                        />
                        <Button variant="ghost" size="icon" onClick={() => removeStallImage(idx)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {!stallsData.images.length && (
                      <p className="text-sm text-muted-foreground">No images yet.</p>
                    )}
                    <div className="flex justify-end">
                      <Button variant="outline" onClick={addStallImage}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add image
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stalls-preview" className="mt-4">
                <Card className="bg-card/70 border-border/60">
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>Static preview of the stalls mosaic.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <div className="font-semibold">{stallsData.eyebrow}</div>
                      <div className="text-xl font-display">{stallsData.title}</div>
                      <div className="text-muted-foreground">{stallsData.description}</div>
                      {(stallsData.ctaLabel || stallsData.ctaHref) && (
                        <div className="text-primary text-xs mt-1">
                          {stallsData.ctaLabel} → {stallsData.ctaHref}
                        </div>
                      )}
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {stallsData.images.map((img, idx) => {
                        const image = typeof img === "string" ? { src: img, href: "" } : img;
                        return (
                          <div key={idx} className="rounded-xl border border-border/60 bg-card/80 overflow-hidden">
                            <img src={image.src} alt={`Stall ${idx + 1}`} className="w-full h-28 object-cover" />
                            <div className="p-2 text-[11px] text-primary">{image.href}</div>
                          </div>
                        );
                      })}
                      {!stallsData.images.length && (
                        <p className="text-sm text-muted-foreground col-span-full">
                          No images to preview.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stalls-actions" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>Restore defaults or publish changes for stalls mosaic.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap justify-end gap-3">
                    <Button variant="outline" onClick={restoreStalls} disabled={saving || loading}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restore defaults
                    </Button>
                    <Button onClick={saveStalls} disabled={saving || loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "Saving..." : "Save stalls"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="pt-10 space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-display font-semibold">Buyer Mosaic Editor</h2>
              <p className="text-muted-foreground text-sm">
                Manage the “20 million loyal buyers” stalls mosaic instance.
              </p>
            </div>
            <Tabs defaultValue="buyer-mosaic-content" className="w-full">
              <TabsList className="grid grid-cols-4 md:grid-cols-4">
                <TabsTrigger value="buyer-mosaic-content">Content</TabsTrigger>
                <TabsTrigger value="buyer-mosaic-images">Images</TabsTrigger>
                <TabsTrigger value="buyer-mosaic-preview">Preview</TabsTrigger>
                <TabsTrigger value="buyer-mosaic-actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="buyer-mosaic-content" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Content</CardTitle>
                    <CardDescription>Eyebrow, title, description, stats, and CTA for the buyer mosaic.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Eyebrow</label>
                      <Input
                        value={buyerMosaicData.eyebrow}
                        onChange={(e) => setBuyerMosaicData((prev) => ({ ...prev, eyebrow: e.target.value }))}
                        placeholder="Review the moment"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                      <Input
                        value={buyerMosaicData.title}
                        onChange={(e) => setBuyerMosaicData((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="20 million loyal buyers"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                      <Input
                        value={buyerMosaicData.description}
                        onChange={(e) => setBuyerMosaicData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Faces and crowds from three decades of ICE..."
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">CTA Label</label>
                        <Input
                          value={buyerMosaicData.ctaLabel}
                          onChange={(e) => setBuyerMosaicData((prev) => ({ ...prev, ctaLabel: e.target.value }))}
                          placeholder="Browse buyer moments"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">CTA Href</label>
                        <Input
                          value={buyerMosaicData.ctaHref}
                          onChange={(e) => setBuyerMosaicData((prev) => ({ ...prev, ctaHref: e.target.value }))}
                          placeholder="/gallery"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground block">Stats</label>
                      {(buyerMosaicData.stats || []).map((stat, idx) => (
                        <div key={idx} className="grid md:grid-cols-3 gap-3 items-end">
                          <Input
                            value={stat.value}
                            onChange={(e) =>
                              setBuyerMosaicData((prev) => {
                                const next = [...(prev.stats || [])];
                                next[idx] = { ...next[idx], value: e.target.value };
                                return { ...prev, stats: next };
                              })
                            }
                            placeholder="20M+"
                          />
                          <Input
                            value={stat.label}
                            onChange={(e) =>
                              setBuyerMosaicData((prev) => {
                                const next = [...(prev.stats || [])];
                                next[idx] = { ...next[idx], label: e.target.value };
                                return { ...prev, stats: next };
                              })
                            }
                            placeholder="buyers over 30 years"
                          />
                          <Input
                            value={stat.icon || ""}
                            onChange={(e) =>
                              setBuyerMosaicData((prev) => {
                                const next = [...(prev.stats || [])];
                                next[idx] = { ...next[idx], icon: e.target.value as any };
                                return { ...prev, stats: next };
                              })
                            }
                            placeholder="grid or users"
                          />
                        </div>
                      ))}
                      {(!buyerMosaicData.stats || !buyerMosaicData.stats.length) && (
                        <p className="text-sm text-muted-foreground">No stats yet.</p>
                      )}
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          onClick={() =>
                            setBuyerMosaicData((prev) => ({
                              ...prev,
                              stats: [...(prev.stats || []), { value: "", label: "", icon: "users" }],
                            }))
                          }
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add stat
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() =>
                            setBuyerMosaicData((prev) => ({
                              ...prev,
                              stats: prev.stats && prev.stats.length > 0 ? prev.stats.slice(0, -1) : [],
                            }))
                          }
                        >
                          Remove last
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="buyer-mosaic-images" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Images</CardTitle>
                      <CardDescription>Images shown in the buyer parallax mosaic.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {buyerMosaicData.images.map((img, idx) => (
                      <div key={idx} className="grid md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                        <Input
                          value={typeof img === "string" ? img : img.src}
                          onChange={(e) =>
                            setBuyerMosaicData((prev) => {
                              const next = [...prev.images] as any[];
                              const current = typeof next[idx] === "string" ? { src: next[idx] as string } : next[idx];
                              next[idx] = { ...current, src: e.target.value };
                              return { ...prev, images: next };
                            })
                          }
                          placeholder="https://..."
                        />
                        <Input
                          value={typeof img === "string" ? "" : img.href || ""}
                          onChange={(e) =>
                            setBuyerMosaicData((prev) => {
                              const next = [...prev.images] as any[];
                              const current = typeof next[idx] === "string" ? { src: next[idx] as string } : next[idx];
                              next[idx] = { ...current, href: e.target.value };
                              return { ...prev, images: next };
                            })
                          }
                          placeholder="/gallery#buyer-1"
                        />
                        <Button variant="ghost" size="icon" onClick={() => removeBuyerImage(idx)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {!buyerMosaicData.images.length && (
                      <p className="text-sm text-muted-foreground">No images yet.</p>
                    )}
                    <div className="flex justify-end">
                      <Button variant="outline" onClick={addBuyerImage}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add image
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="buyer-mosaic-preview" className="mt-4">
                <Card className="bg-card/70 border-border/60">
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>Static preview of the buyer mosaic.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <div className="font-semibold">{buyerMosaicData.eyebrow}</div>
                      <div className="text-xl font-display">{buyerMosaicData.title}</div>
                      <div className="text-muted-foreground">{buyerMosaicData.description}</div>
                      {(buyerMosaicData.ctaLabel || buyerMosaicData.ctaHref) && (
                        <div className="text-primary text-xs mt-1">
                          {buyerMosaicData.ctaLabel} → {buyerMosaicData.ctaHref}
                        </div>
                      )}
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {buyerMosaicData.images.map((img, idx) => {
                        const image = typeof img === "string" ? { src: img, href: "" } : img;
                        return (
                          <div key={idx} className="rounded-xl border border-border/60 bg-card/80 overflow-hidden">
                            <img src={image.src} alt={`Buyer mosaic ${idx + 1}`} className="w-full h-28 object-cover" />
                            <div className="p-2 text-[11px] text-primary">{image.href}</div>
                          </div>
                        );
                      })}
                      {!buyerMosaicData.images.length && (
                        <p className="text-sm text-muted-foreground col-span-full">
                          No images to preview.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="buyer-mosaic-actions" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>Restore defaults or publish changes for buyer mosaic.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap justify-end gap-3">
                    <Button variant="outline" onClick={restoreBuyerMosaic} disabled={saving || loading}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restore defaults
                    </Button>
                    <Button onClick={saveBuyerMosaic} disabled={saving || loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "Saving..." : "Save buyer mosaic"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="pt-10 space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-display font-semibold">VVIP Spotlight Editor</h2>
              <p className="text-muted-foreground text-sm">
                Manage the “VVIPs at ICE Exhibitions” section content.
              </p>
            </div>
            <Tabs defaultValue="vvip-content" className="w-full">
              <TabsList className="grid grid-cols-4 md:grid-cols-4">
                <TabsTrigger value="vvip-content">Content</TabsTrigger>
                <TabsTrigger value="vvip-list">Guests</TabsTrigger>
                <TabsTrigger value="vvip-preview">Preview</TabsTrigger>
                <TabsTrigger value="vvip-actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="vvip-content" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Content</CardTitle>
                    <CardDescription>Eyebrow, title, description, and CTA for the VVIP spotlight.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Eyebrow</label>
                      <Input
                        value={vvipData.eyebrow}
                        onChange={(e) => setVvipData((prev) => ({ ...prev, eyebrow: e.target.value }))}
                        placeholder="VVIPs"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                      <Input
                        value={vvipData.title}
                        onChange={(e) => setVvipData((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Leaders who shaped the ICE stage"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                      <Input
                        value={vvipData.description}
                        onChange={(e) => setVvipData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Keynote guests, cultural envoys..."
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">CTA Label</label>
                        <Input
                          value={vvipData.ctaLabel}
                          onChange={(e) => setVvipData((prev) => ({ ...prev, ctaLabel: e.target.value }))}
                          placeholder="See all VVIPs"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">CTA Href</label>
                        <Input
                          value={vvipData.ctaHref}
                          onChange={(e) => setVvipData((prev) => ({ ...prev, ctaHref: e.target.value }))}
                          placeholder="/gallery"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vvip-list" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Guests</CardTitle>
                      <CardDescription>Cards shown in the VVIP spotlight section.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {vvipData.guests.map((guest, idx) => (
                      <div key={idx} className="grid md:grid-cols-3 gap-3 items-end border border-border/60 rounded-xl p-3">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Name</label>
                          <Input
                            value={guest.name}
                            onChange={(e) =>
                              setVvipData((prev) => {
                                const next = [...prev.guests];
                                next[idx] = { ...next[idx], name: e.target.value };
                                return { ...prev, guests: next };
                              })
                            }
                            placeholder="Name"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                          <Input
                            value={guest.title}
                            onChange={(e) =>
                              setVvipData((prev) => {
                                const next = [...prev.guests];
                                next[idx] = { ...next[idx], title: e.target.value };
                                return { ...prev, guests: next };
                              })
                            }
                            placeholder="Fortune 50 CEO"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Role</label>
                          <Input
                            value={guest.role}
                            onChange={(e) =>
                              setVvipData((prev) => {
                                const next = [...prev.guests];
                                next[idx] = { ...next[idx], role: e.target.value };
                                return { ...prev, guests: next };
                              })
                            }
                            placeholder="Keynote"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs text-muted-foreground mb-1 block">Highlight</label>
                          <Input
                            value={guest.highlight}
                            onChange={(e) =>
                              setVvipData((prev) => {
                                const next = [...prev.guests];
                                next[idx] = { ...next[idx], highlight: e.target.value };
                                return { ...prev, guests: next };
                              })
                            }
                            placeholder="Announced a global R&D hub partnership..."
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Image URL</label>
                          <Input
                            value={guest.image}
                            onChange={(e) =>
                              setVvipData((prev) => {
                                const next = [...prev.guests];
                                next[idx] = { ...next[idx], image: e.target.value };
                                return { ...prev, guests: next };
                              })
                            }
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">CTA / Link</label>
                          <Input
                            value={guest.href || ""}
                            onChange={(e) =>
                              setVvipData((prev) => {
                                const next = [...prev.guests];
                                next[idx] = { ...next[idx], href: e.target.value };
                                return { ...prev, guests: next };
                              })
                            }
                            placeholder="/vvips/anika-sharma"
                          />
                        </div>
                        <div className="flex justify-end md:col-span-3">
                          <Button variant="ghost" size="icon" onClick={() => removeVvip(idx)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {!vvipData.guests.length && (
                      <p className="text-sm text-muted-foreground">No guests yet.</p>
                    )}
                    <div className="flex justify-end">
                      <Button variant="outline" onClick={addVvip}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add guest
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vvip-preview" className="mt-4">
                <Card className="bg-card/70 border-border/60">
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>Static preview of the VVIP spotlight.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <div className="font-semibold">{vvipData.eyebrow}</div>
                      <div className="text-xl font-display">{vvipData.title}</div>
                      <div className="text-muted-foreground">{vvipData.description}</div>
                      {(vvipData.ctaLabel || vvipData.ctaHref) && (
                        <div className="text-primary text-xs mt-1">
                          {vvipData.ctaLabel} → {vvipData.ctaHref}
                        </div>
                      )}
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {vvipData.guests.map((guest, idx) => (
                        <div key={idx} className="rounded-xl border border-border/60 bg-card/80 overflow-hidden">
                          <img src={guest.image} alt={guest.name} className="w-full h-28 object-cover" />
                          <div className="p-3 space-y-1">
                            <div className="font-semibold text-sm">{guest.name}</div>
                            <div className="text-xs text-muted-foreground">{guest.role}</div>
                            <div className="text-xs text-primary">{guest.title}</div>
                            <div className="text-xs text-muted-foreground line-clamp-2">{guest.highlight}</div>
                            {guest.href && <div className="text-[11px] text-primary">{guest.href}</div>}
                          </div>
                        </div>
                      ))}
                      {!vvipData.guests.length && (
                        <p className="text-sm text-muted-foreground col-span-full">
                          No guests to preview.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vvip-actions" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>Restore defaults or publish changes for VVIPs.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap justify-end gap-3">
                    <Button variant="outline" onClick={restoreVvips} disabled={saving || loading}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restore defaults
                    </Button>
                    <Button onClick={saveVvips} disabled={saving || loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "Saving..." : "Save VVIPs"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="pt-10 space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-display font-semibold">Founders Spotlight Editor</h2>
              <p className="text-muted-foreground text-sm">
                Manage the “Founders of ICE 1.0 & ICE 2.0” section content.
              </p>
            </div>
            <Tabs defaultValue="founders-content" className="w-full">
              <TabsList className="grid grid-cols-4 md:grid-cols-4">
                <TabsTrigger value="founders-content">Content</TabsTrigger>
                <TabsTrigger value="founders-list">Founders</TabsTrigger>
                <TabsTrigger value="founders-preview">Preview</TabsTrigger>
                <TabsTrigger value="founders-actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="founders-content" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Content</CardTitle>
                    <CardDescription>Eyebrow, title, description, and CTA for the founders spotlight.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Eyebrow</label>
                      <Input
                        value={foundersData.eyebrow}
                        onChange={(e) => setFoundersData((prev) => ({ ...prev, eyebrow: e.target.value }))}
                        placeholder="Review the moment"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                      <Input
                        value={foundersData.title}
                        onChange={(e) => setFoundersData((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Founders of ICE 1.0 & ICE 2.0"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                      <Input
                        value={foundersData.description}
                        onChange={(e) => setFoundersData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="From offline arches to hybrid broadcasts..."
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">CTA Label</label>
                        <Input
                          value={foundersData.ctaLabel}
                          onChange={(e) => setFoundersData((prev) => ({ ...prev, ctaLabel: e.target.value }))}
                          placeholder="See all founders"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">CTA Href</label>
                        <Input
                          value={foundersData.ctaHref}
                          onChange={(e) => setFoundersData((prev) => ({ ...prev, ctaHref: e.target.value }))}
                          placeholder="/founders"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="founders-list" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Founders</CardTitle>
                      <CardDescription>Cards shown in the founders spotlight section.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {foundersData.founders.map((founder, idx) => (
                      <div key={idx} className="grid md:grid-cols-3 gap-3 items-end border border-border/60 rounded-xl p-3">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Name</label>
                          <Input
                            value={founder.name}
                            onChange={(e) =>
                              setFoundersData((prev) => {
                                const next = [...prev.founders];
                                next[idx] = { ...next[idx], name: e.target.value };
                                return { ...prev, founders: next };
                              })
                            }
                            placeholder="Name"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                          <Input
                            value={founder.title}
                            onChange={(e) =>
                              setFoundersData((prev) => {
                                const next = [...prev.founders];
                                next[idx] = { ...next[idx], title: e.target.value };
                                return { ...prev, founders: next };
                              })
                            }
                            placeholder="Co-Founder & Showrunner"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Era</label>
                          <Input
                            value={founder.era}
                            onChange={(e) =>
                              setFoundersData((prev) => {
                                const next = [...prev.founders];
                                next[idx] = { ...next[idx], era: e.target.value as any };
                                return { ...prev, founders: next };
                              })
                            }
                            placeholder="ICE 1.0"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs text-muted-foreground mb-1 block">Focus</label>
                          <Input
                            value={founder.focus}
                            onChange={(e) =>
                              setFoundersData((prev) => {
                                const next = [...prev.founders];
                                next[idx] = { ...next[idx], focus: e.target.value };
                                return { ...prev, founders: next };
                              })
                            }
                            placeholder="Offline expos, staging, and brand experience"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Image URL</label>
                          <Input
                            value={founder.image}
                            onChange={(e) =>
                              setFoundersData((prev) => {
                                const next = [...prev.founders];
                                next[idx] = { ...next[idx], image: e.target.value };
                                return { ...prev, founders: next };
                              })
                            }
                            placeholder="https://..."
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs text-muted-foreground mb-1 block">Highlight</label>
                          <Input
                            value={founder.highlight}
                            onChange={(e) =>
                              setFoundersData((prev) => {
                                const next = [...prev.founders];
                                next[idx] = { ...next[idx], highlight: e.target.value };
                                return { ...prev, founders: next };
                              })
                            }
                            placeholder="Architected the inaugural expo arches..."
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">CTA / Link</label>
                          <Input
                            value={founder.href || ""}
                            onChange={(e) =>
                              setFoundersData((prev) => {
                                const next = [...prev.founders];
                                next[idx] = { ...next[idx], href: e.target.value };
                                return { ...prev, founders: next };
                              })
                            }
                            placeholder="/founders/aishwarya"
                          />
                        </div>
                        <div className="flex justify-end md:col-span-3">
                          <Button variant="ghost" size="icon" onClick={() => removeFounder(idx)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {!foundersData.founders.length && (
                      <p className="text-sm text-muted-foreground">No founders yet.</p>
                    )}
                    <div className="flex justify-end">
                      <Button variant="outline" onClick={addFounder}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add founder
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="founders-preview" className="mt-4">
                <Card className="bg-card/70 border-border/60">
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>Static preview of the founders spotlight.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <div className="font-semibold">{foundersData.eyebrow}</div>
                      <div className="text-xl font-display">{foundersData.title}</div>
                      <div className="text-muted-foreground">{foundersData.description}</div>
                      {(foundersData.ctaLabel || foundersData.ctaHref) && (
                        <div className="text-primary text-xs mt-1">
                          {foundersData.ctaLabel} → {foundersData.ctaHref}
                        </div>
                      )}
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {foundersData.founders.map((founder, idx) => (
                        <div key={idx} className="rounded-xl border border-border/60 bg-card/80 overflow-hidden">
                          <img src={founder.image} alt={founder.name} className="w-full h-28 object-cover" />
                          <div className="p-3 space-y-1">
                            <div className="font-semibold text-sm">{founder.name}</div>
                            <div className="text-xs text-muted-foreground">{founder.title}</div>
                            <div className="text-xs text-primary">{founder.era}</div>
                            <div className="text-[11px] text-muted-foreground line-clamp-2">{founder.focus}</div>
                            {founder.href && <div className="text-[11px] text-primary">{founder.href}</div>}
                          </div>
                        </div>
                      ))}
                      {!foundersData.founders.length && (
                        <p className="text-sm text-muted-foreground col-span-full">
                          No founders to preview.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="founders-actions" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>Restore defaults or publish changes for founders.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap justify-end gap-3">
                    <Button variant="outline" onClick={restoreFounders} disabled={saving || loading}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restore defaults
                    </Button>
                    <Button onClick={saveFounders} disabled={saving || loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "Saving..." : "Save founders"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="pt-10 space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-display font-semibold">Co-Founders Editor</h2>
              <p className="text-muted-foreground text-sm">
                Manage the “Co-founding team of ICE 2.0 (IGE & IGN)” section content.
              </p>
            </div>
            <Tabs defaultValue="cofounders-content" className="w-full">
              <TabsList className="grid grid-cols-4 md:grid-cols-4">
                <TabsTrigger value="cofounders-content">Content</TabsTrigger>
                <TabsTrigger value="cofounders-list">Co-founders</TabsTrigger>
                <TabsTrigger value="cofounders-preview">Preview</TabsTrigger>
                <TabsTrigger value="cofounders-actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="cofounders-content" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Content</CardTitle>
                    <CardDescription>Eyebrow, title, description, and CTA for the co-founders section.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Eyebrow</label>
                      <Input
                        value={cofoundersData.eyebrow}
                        onChange={(e) => setCofoundersData((prev) => ({ ...prev, eyebrow: e.target.value }))}
                        placeholder="Review the moment"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                      <Input
                        value={cofoundersData.title}
                        onChange={(e) => setCofoundersData((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Co-founding team of ICE 2.0 (IGE & IGN)"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                      <Input
                        value={cofoundersData.description}
                        onChange={(e) => setCofoundersData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Builders behind the hybrid platform..."
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">CTA Label</label>
                        <Input
                          value={cofoundersData.ctaLabel}
                          onChange={(e) => setCofoundersData((prev) => ({ ...prev, ctaLabel: e.target.value }))}
                          placeholder="See all co-founders"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">CTA Href</label>
                        <Input
                          value={cofoundersData.ctaHref}
                          onChange={(e) => setCofoundersData((prev) => ({ ...prev, ctaHref: e.target.value }))}
                          placeholder="/cofounders"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cofounders-list" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Co-founders</CardTitle>
                      <CardDescription>Cards shown in the co-founders section.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cofoundersData.cofounders.map((person, idx) => (
                      <div key={idx} className="grid md:grid-cols-3 gap-3 items-end border border-border/60 rounded-xl p-3">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Name</label>
                          <Input
                            value={person.name}
                            onChange={(e) =>
                              setCofoundersData((prev) => {
                                const next = [...prev.cofounders];
                                next[idx] = { ...next[idx], name: e.target.value };
                                return { ...prev, cofounders: next };
                              })
                            }
                            placeholder="Name"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Track</label>
                          <Input
                            value={person.track}
                            onChange={(e) =>
                              setCofoundersData((prev) => {
                                const next = [...prev.cofounders];
                                next[idx] = { ...next[idx], track: e.target.value as any };
                                return { ...prev, cofounders: next };
                              })
                            }
                            placeholder="IGE / IGN / IGE & IGN"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                          <Input
                            value={person.title}
                            onChange={(e) =>
                              setCofoundersData((prev) => {
                                const next = [...prev.cofounders];
                                next[idx] = { ...next[idx], title: e.target.value };
                                return { ...prev, cofounders: next };
                              })
                            }
                            placeholder="Co-Founder, ICE 2.0"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs text-muted-foreground mb-1 block">Focus</label>
                          <Input
                            value={person.focus}
                            onChange={(e) =>
                              setCofoundersData((prev) => {
                                const next = [...prev.cofounders];
                                next[idx] = { ...next[idx], focus: e.target.value };
                                return { ...prev, cofounders: next };
                              })
                            }
                            placeholder="Product + Program"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Image URL</label>
                          <Input
                            value={person.image}
                            onChange={(e) =>
                              setCofoundersData((prev) => {
                                const next = [...prev.cofounders];
                                next[idx] = { ...next[idx], image: e.target.value };
                                return { ...prev, cofounders: next };
                              })
                            }
                            placeholder="https://..."
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs text-muted-foreground mb-1 block">Highlight</label>
                          <Input
                            value={person.highlight}
                            onChange={(e) =>
                              setCofoundersData((prev) => {
                                const next = [...prev.cofounders];
                                next[idx] = { ...next[idx], highlight: e.target.value };
                                return { ...prev, cofounders: next };
                              })
                            }
                            placeholder="Bridges on-ground playbooks..."
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">CTA / Link</label>
                          <Input
                            value={person.href || ""}
                            onChange={(e) =>
                              setCofoundersData((prev) => {
                                const next = [...prev.cofounders];
                                next[idx] = { ...next[idx], href: e.target.value };
                                return { ...prev, cofounders: next };
                              })
                            }
                            placeholder="/cofounders/priyanshi-jha"
                          />
                        </div>
                        <div className="flex justify-end md:col-span-3">
                          <Button variant="ghost" size="icon" onClick={() => removeCofounder(idx)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {!cofoundersData.cofounders.length && (
                      <p className="text-sm text-muted-foreground">No co-founders yet.</p>
                    )}
                    <div className="flex justify-end">
                      <Button variant="outline" onClick={addCofounder}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add co-founder
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cofounders-preview" className="mt-4">
                <Card className="bg-card/70 border-border/60">
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>Static preview of the co-founders section.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <div className="font-semibold">{cofoundersData.eyebrow}</div>
                      <div className="text-xl font-display">{cofoundersData.title}</div>
                      <div className="text-muted-foreground">{cofoundersData.description}</div>
                      {(cofoundersData.ctaLabel || cofoundersData.ctaHref) && (
                        <div className="text-primary text-xs mt-1">
                          {cofoundersData.ctaLabel} → {cofoundersData.ctaHref}
                        </div>
                      )}
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {cofoundersData.cofounders.map((person, idx) => (
                        <div key={idx} className="rounded-xl border border-border/60 bg-card/80 overflow-hidden">
                          <img src={person.image} alt={person.name} className="w-full h-28 object-cover" />
                          <div className="p-3 space-y-1">
                            <div className="font-semibold text-sm">{person.name}</div>
                            <div className="text-xs text-muted-foreground">{person.title}</div>
                            <div className="text-xs text-primary">{person.track}</div>
                            <div className="text-[11px] text-muted-foreground line-clamp-2">{person.focus}</div>
                            {person.href && <div className="text-[11px] text-primary">{person.href}</div>}
                          </div>
                        </div>
                      ))}
                      {!cofoundersData.cofounders.length && (
                        <p className="text-sm text-muted-foreground col-span-full">
                          No co-founders to preview.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cofounders-actions" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>Restore defaults or publish changes for co-founders.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap justify-end gap-3">
                    <Button variant="outline" onClick={restoreCofounders} disabled={saving || loading}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restore defaults
                    </Button>
                    <Button onClick={saveCofounders} disabled={saving || loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "Saving..." : "Save co-founders"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="pt-10 space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-display font-semibold">Counting Section Editor</h2>
              <p className="text-muted-foreground text-sm">
                Manage the “20M+ buyers | 10,000+ brands | 10 cities | 30 years” stats strip.
              </p>
            </div>
            <Tabs defaultValue="counts-list" className="w-full">
              <TabsList className="grid grid-cols-3 md:grid-cols-3">
                <TabsTrigger value="counts-list">Stats</TabsTrigger>
                <TabsTrigger value="counts-preview">Preview</TabsTrigger>
                <TabsTrigger value="counts-actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="counts-list" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Stats</CardTitle>
                    <CardDescription>Numbers shown in the counting section.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {countsData.stats.map((stat, idx) => (
                      <div key={idx} className="grid md:grid-cols-3 gap-3 items-end">
                        <Input
                          type="number"
                          value={stat.value}
                          onChange={(e) =>
                            setCountsData((prev) => {
                              const next = [...prev.stats];
                              next[idx] = { ...next[idx], value: Number(e.target.value) };
                              return { stats: next };
                            })
                          }
                          placeholder="20"
                        />
                        <Input
                          value={stat.suffix || ""}
                          onChange={(e) =>
                            setCountsData((prev) => {
                              const next = [...prev.stats];
                              next[idx] = { ...next[idx], suffix: e.target.value };
                              return { stats: next };
                            })
                          }
                          placeholder="M+"
                        />
                        <Input
                          value={stat.label}
                          onChange={(e) =>
                            setCountsData((prev) => {
                              const next = [...prev.stats];
                              next[idx] = { ...next[idx], label: e.target.value };
                              return { stats: next };
                            })
                          }
                          placeholder="buyers"
                        />
                        <div className="md:col-span-3 flex justify-end">
                          <Button variant="ghost" size="icon" onClick={() => removeCount(idx)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {!countsData.stats.length && (
                      <p className="text-sm text-muted-foreground">No stats yet.</p>
                    )}
                    <div className="flex justify-end">
                      <Button variant="outline" onClick={addCount}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add stat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="counts-preview" className="mt-4">
                <Card className="bg-card/70 border-border/60">
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>Static preview of the counting strip.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {countsData.stats.map((stat, idx) => (
                        <div key={idx} className="rounded-xl border border-border/60 bg-card/80 p-3 text-center">
                          <div className="text-xl font-display font-semibold">
                            {stat.value}
                            {stat.suffix}
                          </div>
                          <div className="text-xs text-muted-foreground">{stat.label}</div>
                        </div>
                      ))}
                      {!countsData.stats.length && (
                        <p className="text-sm text-muted-foreground col-span-full text-center">
                          No stats to preview.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="counts-actions" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>Restore defaults or publish changes for the counting section.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap justify-end gap-3">
                    <Button variant="outline" onClick={restoreCounts} disabled={saving || loading}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restore defaults
                    </Button>
                    <Button onClick={saveCounts} disabled={saving || loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "Saving..." : "Save counts"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="pt-10 space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-display font-semibold">Dual CTA Editor</h2>
              <p className="text-muted-foreground text-sm">
                Manage the sellers & buyers dual CTA section.
              </p>
            </div>
            <Tabs defaultValue="dualcta-sellers" className="w-full">
              <TabsList className="grid grid-cols-4 md:grid-cols-4">
                <TabsTrigger value="dualcta-sellers">Sellers CTA</TabsTrigger>
                <TabsTrigger value="dualcta-buyers">Buyers CTA</TabsTrigger>
                <TabsTrigger value="dualcta-preview">Preview</TabsTrigger>
                <TabsTrigger value="dualcta-actions">Actions</TabsTrigger>
              </TabsList>

              {(["sellers", "buyers"] as const).map((key) => (
                <TabsContent key={key} value={`dualcta-${key}`} className="mt-4">
                  <Card className="bg-card/80 border-border/70">
                    <CardHeader>
                      <CardTitle>{key === "sellers" ? "Sellers CTA" : "Buyers CTA"}</CardTitle>
                      <CardDescription>Eyebrow, title, description, and links.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Eyebrow</label>
                        <Input
                          value={dualCtaData[key].eyebrow || ""}
                          onChange={(e) =>
                            setDualCtaData((prev) => ({
                              ...prev,
                              [key]: { ...prev[key], eyebrow: e.target.value },
                            }))
                          }
                          placeholder="CTA • Sellers"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                        <Input
                          value={dualCtaData[key].title}
                          onChange={(e) =>
                            setDualCtaData((prev) => ({
                              ...prev,
                              [key]: { ...prev[key], title: e.target.value },
                            }))
                          }
                          placeholder={key === "sellers" ? "Showcase your brand at ICE Exhibitions" : "Be first to the next ICE edition"}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                        <Input
                          value={dualCtaData[key].description || ""}
                          onChange={(e) =>
                            setDualCtaData((prev) => ({
                              ...prev,
                              [key]: { ...prev[key], description: e.target.value },
                            }))
                          }
                          placeholder="Short supporting copy"
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Primary label</label>
                          <Input
                            value={dualCtaData[key].primary.label}
                            onChange={(e) =>
                              setDualCtaData((prev) => ({
                                ...prev,
                                [key]: { ...prev[key], primary: { ...prev[key].primary, label: e.target.value } },
                              }))
                            }
                            placeholder="Plan my showcase"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Primary href</label>
                          <Input
                            value={dualCtaData[key].primary.href}
                            onChange={(e) =>
                              setDualCtaData((prev) => ({
                                ...prev,
                                [key]: { ...prev[key], primary: { ...prev[key].primary, href: e.target.value } },
                              }))
                            }
                            placeholder="/partner"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Secondary label</label>
                          <Input
                            value={dualCtaData[key].secondary?.label || ""}
                            onChange={(e) =>
                              setDualCtaData((prev) => ({
                                ...prev,
                                [key]: {
                                  ...prev[key],
                                  secondary: { ...(prev[key].secondary || { label: "", href: "" }), label: e.target.value },
                                },
                              }))
                            }
                            placeholder="Talk to production"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Secondary href</label>
                          <Input
                            value={dualCtaData[key].secondary?.href || ""}
                            onChange={(e) =>
                              setDualCtaData((prev) => ({
                                ...prev,
                                [key]: {
                                  ...prev[key],
                                  secondary: { ...(prev[key].secondary || { label: "", href: "" }), href: e.target.value },
                                },
                              }))
                            }
                            placeholder="/contact"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}

              <TabsContent value="dualcta-preview" className="mt-4">
                <Card className="bg-card/70 border-border/60">
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>Static preview of the dual CTA cards.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      {(["sellers", "buyers"] as const).map((key) => (
                        <div key={key} className="rounded-xl border border-border/60 bg-card/80 p-4 space-y-2">
                          <div className="text-xs text-muted-foreground uppercase tracking-wide">
                            {dualCtaData[key].eyebrow}
                          </div>
                          <div className="font-semibold text-lg">{dualCtaData[key].title}</div>
                          <div className="text-sm text-muted-foreground">{dualCtaData[key].description}</div>
                          <div className="text-xs text-primary">
                            {dualCtaData[key].primary.label} → {dualCtaData[key].primary.href}
                          </div>
                          {dualCtaData[key].secondary?.label && (
                            <div className="text-xs text-primary/80">
                              {dualCtaData[key].secondary.label} → {dualCtaData[key].secondary.href}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="dualcta-actions" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>Restore defaults or publish changes for dual CTAs.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap justify-end gap-3">
                    <Button variant="outline" onClick={restoreDualCta} disabled={saving || loading}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restore defaults
                    </Button>
                    <Button onClick={saveDualCta} disabled={saving || loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "Saving..." : "Save dual CTAs"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="pt-10 space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-display font-semibold">Footer Editor</h2>
              <p className="text-muted-foreground text-sm">
                Manage footer CTA, contact info, links, and socials.
              </p>
            </div>
            <Tabs defaultValue="footer-cta" className="w-full">
              <TabsList className="grid grid-cols-4 md:grid-cols-4">
                <TabsTrigger value="footer-cta">CTA</TabsTrigger>
                <TabsTrigger value="footer-links">Links</TabsTrigger>
                <TabsTrigger value="footer-contact">Contact</TabsTrigger>
                <TabsTrigger value="footer-actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="footer-cta" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>CTA</CardTitle>
                    <CardDescription>Headline, description, and primary CTAs.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                      <Input
                        value={footerData.ctaTitle}
                        onChange={(e) => setFooterData((prev) => ({ ...prev, ctaTitle: e.target.value }))}
                        placeholder="Ready to create the next unforgettable expo moment?"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                      <Input
                        value={footerData.ctaDescription}
                        onChange={(e) => setFooterData((prev) => ({ ...prev, ctaDescription: e.target.value }))}
                        placeholder="Choose your path—co-create as a partner..."
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Partner href</label>
                        <Input
                          value={footerData.partnerHref}
                          onChange={(e) => setFooterData((prev) => ({ ...prev, partnerHref: e.target.value }))}
                          placeholder="/partner"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Sponsor href</label>
                        <Input
                          value={footerData.sponsorHref}
                          onChange={(e) => setFooterData((prev) => ({ ...prev, sponsorHref: e.target.value }))}
                          placeholder="/sponsor"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="footer-links" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Links</CardTitle>
                    <CardDescription>Explore, partners, and legal link columns.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(["exploreLinks", "partnersLinks", "legalLinks"] as const).map((key) => (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold capitalize">{key.replace("Links", "")}</h4>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setFooterData((prev) => ({
                                ...prev,
                                [key]: [...(prev[key] || []), { name: "", href: "" }],
                              }))
                            }
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                          </Button>
                        </div>
                        {(footerData[key] || []).map((link, idx) => (
                          <div key={idx} className="grid md:grid-cols-[1fr_1fr_auto] gap-2 items-end">
                            <Input
                              value={link.name}
                              onChange={(e) =>
                                setFooterData((prev) => {
                                  const next = [...prev[key]];
                                  next[idx] = { ...next[idx], name: e.target.value };
                                  return { ...prev, [key]: next };
                                })
                              }
                              placeholder="Label"
                            />
                            <Input
                              value={link.href}
                              onChange={(e) =>
                                setFooterData((prev) => {
                                  const next = [...prev[key]];
                                  next[idx] = { ...next[idx], href: e.target.value };
                                  return { ...prev, [key]: next };
                                })
                              }
                              placeholder="/path"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setFooterData((prev) => ({
                                  ...prev,
                                  [key]: prev[key].filter((_, i) => i !== idx),
                                }))
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        {!(footerData[key] || []).length && (
                          <p className="text-xs text-muted-foreground">No links yet.</p>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="footer-contact" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Contact & Socials</CardTitle>
                    <CardDescription>Contact info and social links.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid md:grid-cols-3 gap-3">
                      <Input
                        value={footerData.contact.location}
                        onChange={(e) => setFooterData((prev) => ({ ...prev, contact: { ...prev.contact, location: e.target.value } }))}
                        placeholder="Bangalore, India"
                      />
                      <Input
                        value={footerData.contact.email}
                        onChange={(e) => setFooterData((prev) => ({ ...prev, contact: { ...prev.contact, email: e.target.value } }))}
                        placeholder="hello@iceglobal.com"
                      />
                      <Input
                        value={footerData.contact.phone}
                        onChange={(e) => setFooterData((prev) => ({ ...prev, contact: { ...prev.contact, phone: e.target.value } }))}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold">Socials</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setFooterData((prev) => ({
                              ...prev,
                              socials: [...(prev.socials || []), { label: "", href: "" }],
                            }))
                          }
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      {(footerData.socials || []).map((social, idx) => (
                        <div key={idx} className="grid md:grid-cols-[1fr_1fr_auto] gap-2 items-end">
                          <Input
                            value={social.label}
                            onChange={(e) =>
                              setFooterData((prev) => {
                                const next = [...prev.socials];
                                next[idx] = { ...next[idx], label: e.target.value };
                                return { ...prev, socials: next };
                              })
                            }
                            placeholder="LinkedIn"
                          />
                          <Input
                            value={social.href}
                            onChange={(e) =>
                              setFooterData((prev) => {
                                const next = [...prev.socials];
                                next[idx] = { ...next[idx], href: e.target.value };
                                return { ...prev, socials: next };
                              })
                            }
                            placeholder="https://linkedin.com/company/..."
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setFooterData((prev) => ({
                                ...prev,
                                socials: prev.socials.filter((_, i) => i !== idx),
                              }))
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {!footerData.socials.length && (
                        <p className="text-xs text-muted-foreground">No socials yet.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="footer-actions" className="mt-4">
                <Card className="bg-card/80 border-border/70">
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>Restore defaults or publish footer changes.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap justify-end gap-3">
                    <Button variant="outline" onClick={restoreFooter} disabled={saving || loading}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restore defaults
                    </Button>
                    <Button onClick={saveFooter} disabled={saving || loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "Saving..." : "Save footer"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboard;

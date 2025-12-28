import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingNavbar } from "@/components/ui/floating-navbar";
import { BackgroundBeams } from "@/components/ui/background-effects";
import Footer from "@/components/Footer";
import { navItems } from "@/data/expo-data";
import { galleryItems, galleryCategories, galleryYears } from "@/data/gallery-items";
import { cn } from "@/lib/utils";
import { Search, Filter, X, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 24;

// Lazy loaded image component
const LazyImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={cn("relative bg-card", className)}>
      {isInView && (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 animate-pulse bg-muted" />
          )}
          <img
            src={src}
            alt={alt}
            onLoad={() => setIsLoaded(true)}
            className={cn(
              "w-full h-auto object-cover transition-all duration-500",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        </>
      )}
      {!isInView && (
        <div className="w-full aspect-[4/3] bg-muted animate-pulse" />
      )}
    </div>
  );
};

const Gallery = () => {
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  const years = galleryYears;
  const categories = galleryCategories;
  const MIN_INFINITE_ITEMS = 200;

  // Filter images
  const filteredImages = useMemo(() => {
    return galleryItems.filter((item) => {
      const matchesYear = selectedYear === "All Years" || item.year === selectedYear;
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesYear && matchesCategory && matchesSearch;
    });
  }, [selectedYear, selectedCategory, searchQuery]);

  const infinitePool = useMemo(() => {
    if (filteredImages.length === 0) return [];
    if (filteredImages.length >= MIN_INFINITE_ITEMS) return filteredImages;

    const result: (typeof filteredImages[number] & { originalId?: string })[] = [];
    let multiplier = 0;
    while (result.length < MIN_INFINITE_ITEMS) {
      filteredImages.forEach((item, idx) => {
        if (result.length >= MIN_INFINITE_ITEMS) return;
        result.push({
          ...item,
          originalId: item.id,
          id: `${item.id}-loop-${multiplier}-${idx}`,
        });
      });
      multiplier += 1;
    }
    return result;
  }, [filteredImages]);

  // Get displayed images
  const displayedImages = useMemo(() => {
    return infinitePool.slice(0, displayCount);
  }, [infinitePool, displayCount]);

  const hasMore = displayCount < infinitePool.length;

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [selectedYear, selectedCategory, searchQuery]);

  // Load more function
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    // Simulate network delay for smoother UX
    setTimeout(() => {
      setDisplayCount((prev) => Math.min(prev + ITEMS_PER_PAGE, infinitePool.length));
      setIsLoading(false);
    }, 300);
  }, [isLoading, hasMore, infinitePool.length]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  return (
    <main className="min-h-screen bg-background">
      {/* Navbar */}
      <FloatingNavbar navItems={navItems} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20">
        <BackgroundBeams className="z-0" />
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold font-display text-foreground mb-6">
              Legacy <span className="text-gradient">Gallery</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Browse curated moments from our past expos. Filter by year, category, 
              or search for specific brands.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-20 z-30 py-4 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by title or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>

            {/* Results Count */}
            <div className="hidden md:block text-sm text-muted-foreground">
              Showing {displayedImages.length} of {infinitePool.length} images
            </div>

            {/* Filter Chips - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {/* Year Filter */}
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="appearance-none px-4 py-2.5 pr-10 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:border-primary cursor-pointer"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              {/* Category Chips */}
              <div className="flex gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Filter Button */}
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters ({filteredImages.length})
            </Button>
          </div>

          {/* Mobile Filters Dropdown */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-4 space-y-4 overflow-hidden"
              >
                <div className="flex flex-wrap gap-2">
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm transition-all",
                        selectedYear === year
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border text-muted-foreground"
                      )}
                    >
                      {year}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm transition-all",
                        selectedCategory === category
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border text-muted-foreground"
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {filteredImages.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No images found matching your criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedYear("All Years");
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                {displayedImages.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.02, 0.5) }}
                    className="break-inside-avoid group"
                  >
                    <Link to={`/gallery/${item.originalId ?? item.id}`} className="relative block overflow-hidden rounded-xl">
                      <LazyImage
                        src={item.image}
                        alt={item.title}
                        className="transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="font-display font-semibold text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.brand} • {item.year}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Infinite Scroll Trigger */}
              <div ref={loadMoreRef} className="mt-12 text-center">
                {isLoading && (
                  <div className="flex items-center justify-center gap-3 py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="text-muted-foreground">Loading more images...</span>
                  </div>
                )}

                {/* Endless feel by looping the dataset; no end message */}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
};

export default Gallery;

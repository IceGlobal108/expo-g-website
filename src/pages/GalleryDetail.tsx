import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { FloatingNavbar } from "@/components/ui/floating-navbar";
import { BackgroundBeams } from "@/components/ui/background-effects";
import Footer from "@/components/Footer";
import { navItems } from "@/data/expo-data";
import { galleryItems, GalleryComment } from "@/data/gallery-items";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Heart, MessageCircle, Share2, ArrowLeft, ExternalLink } from "lucide-react";
import NotFound from "./NotFound";

const getCommentStorageKey = (id: string) => `gallery-comments-${id}`;
const sectionSlug = (text: string, fallback: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || fallback;

const GalleryDetail = () => {
  const { id } = useParams();
  const item = useMemo(() => galleryItems.find((entry) => entry.id === id), [id]);
  const { toast } = useToast();

  const [comments, setComments] = useState<GalleryComment[]>([]);
  const [likes, setLikes] = useState(item?.likes ?? 0);
  const [isLiked, setIsLiked] = useState(false);
  const [form, setForm] = useState({ author: "", message: "" });
  const commentsRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1.08, 1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.85]);

  useEffect(() => {
    if (!item) return;
    const stored = localStorage.getItem(getCommentStorageKey(item.id));
    setComments(stored ? JSON.parse(stored) : item.comments);
    setLikes(item.likes);
    setIsLiked(false);
  }, [item]);

  useEffect(() => {
    if (!item) return;
    localStorage.setItem(getCommentStorageKey(item.id), JSON.stringify(comments));
  }, [comments, item]);

  if (!item) {
    return <NotFound />;
  }

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    setLikes((prev) => (isLiked ? Math.max(prev - 1, 0) : prev + 1));
  };

  const handleShare = async (hash?: string) => {
    const shareUrl = hash ? `${window.location.href.split("#")[0]}#${hash}` : window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title: item.title, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({ title: "Link copied to clipboard" });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Unable to share right now", variant: "destructive" });
    }
  };

  const handleCommentSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.author.trim() || !form.message.trim()) {
      toast({ title: "Add your name and comment to post.", variant: "destructive" });
      return;
    }

    const newComment: GalleryComment = {
      id: crypto.randomUUID(),
      author: form.author.trim(),
      message: form.message.trim(),
      date: new Date().toISOString(),
    };

    setComments((prev) => [newComment, ...prev]);
    setForm({ author: "", message: "" });
    toast({ title: "Comment added" });
  };

  const scrollToComments = () => {
    if (commentsRef.current) {
      commentsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <FloatingNavbar navItems={navItems} />

      <section className="relative pt-28 pb-12 md:pt-36 md:pb-16 overflow-hidden">
        <BackgroundBeams className="z-0" />
        <div className="container-custom relative z-10">
          <Link to="/gallery" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to gallery
          </Link>

          <div className="mt-8 grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative overflow-hidden rounded-3xl bg-card border border-border shadow-2xl shadow-primary/10"
            >
              <motion.img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
                style={{ scale: heroScale, opacity: heroOpacity }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.15),transparent_45%),radial-gradient(circle_at_80%_80%,hsl(var(--secondary)/0.15),transparent_45%)]" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary">{item.year}</Badge>
                <Badge>{item.category}</Badge>
                <span className="text-sm text-muted-foreground">by {item.brand}</span>
              </div>

              <div>
                <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight">{item.title}</h1>
                <p className="text-lg text-muted-foreground mt-3">{item.excerpt}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant={isLiked ? "default" : "outline"} onClick={handleLike} className="flex items-center gap-2">
                  <Heart className={`w-4 h-4 ${isLiked ? "fill-primary text-primary-foreground" : ""}`} />
                  {likes} {likes === 1 ? "Like" : "Likes"}
                </Button>
                <Button variant="outline" onClick={() => handleShare()} className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                <Button variant="ghost" onClick={scrollToComments} className="text-muted-foreground hover:text-primary flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  {comments.length} Comments
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom grid lg:grid-cols-3 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-2 space-y-10">
            {item.article.map((section, idx) => {
              const anchor = `story-${sectionSlug(section.heading, String(idx))}`;
              return (
                <motion.article
                  key={section.heading}
                  id={anchor}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: idx * 0.06 }}
                  viewport={{ once: true, margin: "-40px" }}
                  className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-6 md:p-8 shadow-xl shadow-primary/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,hsl(var(--primary)/0.2),transparent_40%),radial-gradient(circle_at_80%_80%,hsl(var(--secondary)/0.18),transparent_40%)]" />
                  <div className="relative flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold tracking-[0.2em] uppercase">
                        Story {idx + 1}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleShare(anchor)}>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm" onClick={scrollToComments}>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Comment
                        </Button>
                      </div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-semibold">{section.heading}</h2>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{section.body}</p>
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <Badge variant="secondary">{item.year}</Badge>
                      <Badge>{item.category}</Badge>
                      <Badge variant="outline" className="text-xs">
                        #{item.brand}
                      </Badge>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <div className="glass rounded-2xl p-6 space-y-4 border border-border/70">
            <h3 className="text-xl font-display font-semibold">About this capture</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center justify-between">
                <span>Year</span>
                <span className="text-foreground font-medium">{item.year}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Category</span>
                <span className="text-foreground font-medium">{item.category}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Brand</span>
                <span className="text-foreground font-medium">{item.brand}</span>
              </li>
            </ul>
            <div className="pt-4 border-t border-border/60">
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                View more moments
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="comments" ref={commentsRef} className="section-padding bg-card/40 border-t border-border/60">
        <div className="container-custom grid lg:grid-cols-3 gap-10 lg:gap-14">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-display font-semibold">Comments</h3>
              <Badge variant="secondary">{comments.length}</Badge>
            </div>

            <form onSubmit={handleCommentSubmit} className="glass rounded-xl p-5 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">Name</label>
                  <Input
                    value={form.author}
                    onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">Comment</label>
                  <Textarea
                    value={form.message}
                    onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                    placeholder="Share your thoughts..."
                    rows={3}
                  />
                </div>
              </div>
              <Button type="submit">Post Comment</Button>
            </form>

            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-xl border border-border/70 p-4 bg-card/60">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-foreground">{comment.author}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{comment.message}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-muted-foreground">Be the first to start the conversation.</p>
              )}
            </div>
          </div>

          <div className="glass rounded-xl p-6 space-y-4 border border-border/70">
            <h4 className="text-lg font-display font-semibold">Spread the word</h4>
            <p className="text-sm text-muted-foreground">
              Share this moment with your team or friends. Every repost helps the community grow.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share Link
              </Button>
              <Button variant={isLiked ? "default" : "secondary"} onClick={handleLike}>
                <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-primary text-primary-foreground" : ""}`} />
                {likes}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default GalleryDetail;

import { getDb } from "../src/db/mongo";

const defaultStalls = {
  key: "default",
  eyebrow: "Review the moment",
  title: "10,000+ brands & seller stalls",
  description: "A visual atlas of the booths and showcases that defined ICE Exhibitions over 30 years.",
  ctaLabel: "See the full archive",
  ctaHref: "/gallery",
  images: [
    { src: "https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?w=900&h=700&fit=crop", href: "/gallery/stall-1" },
    { src: "https://images.unsplash.com/photo-1473951574080-01fe45ec8643?w=900&h=700&fit=crop", href: "/gallery/stall-2" },
    { src: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=900&h=700&fit=crop", href: "/gallery/stall-3" },
    { src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&h=700&fit=crop", href: "/gallery/stall-4" },
    { src: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=900&h=700&fit=crop", href: "/gallery/stall-5" },
    { src: "https://images.unsplash.com/photo-1475543403517-58a5ffcd1cf5?w=900&h=700&fit=crop", href: "/gallery/stall-6" },
  ],
  stats: [
    { value: "10,000+", label: "brands & sellers", icon: "grid" },
    { value: "20M+", label: "buyers witnessed", icon: "users" },
  ],
};

const run = async () => {
  try {
    const db = await getDb();
    const col = db.collection("stalls");
    await col.updateOne({ key: "default" }, { $set: defaultStalls }, { upsert: true });
    console.log("Stalls seed applied.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

run();

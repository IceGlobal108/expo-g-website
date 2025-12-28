import { getDb } from "../src/db/mongo";

const defaultBuyerMosaic = {
  key: "default",
  eyebrow: "Review the moment",
  title: "20 million loyal buyers",
  description: "Faces and crowds from three decades of ICE—loyal buyers returning for the launches, workshops, and night sets they love.",
  ctaLabel: "Browse buyer moments",
  ctaHref: "/gallery",
  images: [
    { src: "https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?w=900&h=700&fit=crop", href: "/gallery#buyer-1" },
    { src: "https://images.unsplash.com/photo-1473951574080-01fe45ec8643?w=900&h=700&fit=crop", href: "/gallery#buyer-2" },
    { src: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=900&h=700&fit=crop", href: "/gallery#buyer-3" },
    { src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&h=700&fit=crop", href: "/gallery#buyer-4" },
    { src: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=900&h=700&fit=crop", href: "/gallery#buyer-5" },
    { src: "https://images.unsplash.com/photo-1475543403517-58a5ffcd1cf5?w=900&h=700&fit=crop", href: "/gallery#buyer-6" },
  ],
  stats: [
    { value: "20M+", label: "buyers over 30 years", icon: "users" },
    { value: "10 cities", label: "across India", icon: "grid" },
  ],
};

const run = async () => {
  try {
    const db = await getDb();
    const col = db.collection("buyer_mosaic");
    await col.updateOne({ key: "default" }, { $set: defaultBuyerMosaic }, { upsert: true });
    console.log("Buyer mosaic seed applied.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

run();

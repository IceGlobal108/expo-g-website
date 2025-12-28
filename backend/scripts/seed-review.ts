import { getDb } from "../src/db/mongo";

const defaultReview = {
  key: "default",
  eyebrow: "What is ICE Exhibitions",
  title: "Infographics & Photos",
  description:
    "A quick visual walkthrough of the ICE Exhibitions universe—immersive entrances, grand stages, VR zones, and the community moments that define the brand.",
  ctaLabel: "Explore Full Gallery",
  ctaHref: "/gallery",
  images: [
    {
      src: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=800&auto=format&fit=crop&q=80",
      href: "/gallery",
    },
    {
      src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&auto=format&fit=crop&q=80",
      href: "/gallery",
    },
    {
      src: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&auto=format&fit=crop&q=80",
      href: "/gallery",
    },
    {
      src: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=800&auto=format&fit=crop&q=80",
      href: "/gallery",
    },
    {
      src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&auto=format&fit=crop&q=80",
      href: "/gallery",
    },
  ],
};

const run = async () => {
  try {
    const db = await getDb();
    const col = db.collection("review");
    await col.updateOne({ key: "default" }, { $set: defaultReview }, { upsert: true });
    console.log("Review seed applied.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

run();

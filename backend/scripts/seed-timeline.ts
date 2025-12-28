import { getDb } from "../src/db/mongo";

const defaultTimeline = {
  key: "default",
  eyebrow: "Legacy in Motion",
  title: "30 Years History / Journey Timeline",
  description: "Milestones from the first city arch to a 10-city hybrid circuit.",
  milestones: [
    {
      title: "1994 — The First Arch",
      description:
        "ICE Exhibitions opens with a single city showcase and a landmark entrance arch that becomes the template for the next three decades.",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop",
    },
    {
      title: "2004 — Multi-city Momentum",
      description:
        "We expand to five cities, standardizing production playbooks for stages, lounges, and media pods to keep quality consistent everywhere.",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&h=800&fit=crop",
    },
    {
      title: "2014 — Digital Layer",
      description:
        "Hybrid kiosks and interactive displays debut; visitors navigate with digital wayfinding and on-site app drops.",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop",
    },
    {
      title: "2019 — Immersive Entrances",
      description:
        "Kinetic light tunnels and responsive arches set a new benchmark for arrival moments across all venues.",
      image: "https://images.unsplash.com/photo-1529429617124-aee1f1650a5c?w=1200&h=800&fit=crop",
    },
    {
      title: "2022 — Hybrid at Scale",
      description:
        "Full hybrid broadcasts, press-ready assets, and CRM-linked lead capture become default; international brands join the circuit.",
      image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=1200&h=800&fit=crop",
    },
    {
      title: "2024 — Legacy in Motion",
      description:
        "10 cities, 10,000+ brands, 20M+ buyers later—ICE runs like a festival and performs like an enterprise-grade launch pad.",
      image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=800&fit=crop",
    },
  ],
};

const run = async () => {
  try {
    const db = await getDb();
    const col = db.collection("timeline");
    await col.updateOne({ key: "default" }, { $set: defaultTimeline }, { upsert: true });
    console.log("Timeline seed applied.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

run();

import { getDb } from "../src/db/mongo";

const about = {
  key: "default",
  data: {
    hero: {
      badge: "About ICE",
      title: "Production-grade expos with festival energy",
      body: "We engineer the arrivals, stages, booths, and broadcasts that make brands feel cinematic and buyers feel invited—online and on-ground.",
      primaryCta: { label: "Talk to production", href: "/contact" },
      secondaryCta: { label: "Review the moments", href: "/gallery" },
    },
    platforms: [
      {
        eyebrow: "ICE 1.0",
        title: "Offline expo platform",
        body: "A decade of physical showcases across India—arches, pavilions, lounges, and stages built to festival standards.",
        cta: { label: "See legacy moments", href: "/gallery" },
      },
      {
        eyebrow: "ICE 2.0 · IGE & IGN",
        title: "Hybrid + digital platform",
        body: "Broadcast-grade streams, press-ready content, and data-backed attendee journeys that extend every launch.",
        cta: { label: "Plan a hybrid drop", href: "/contact" },
      },
    ],
    pillars: [
      { title: "Stagecraft", body: "Cinematic main stages, responsive lighting, and immersive entrances that set the tone the moment guests arrive." },
      { title: "Hybrid by design", body: "ICE 2.0 bridges on-ground experiences with live streams, media pods, and digital routes that keep audiences connected." },
      { title: "Measurable impact", body: "Dwell-time, sentiment, and lead capture measured in real time so every experience maps to outcomes." },
    ],
    timeline: {
      badge: "Legacy in motion",
      title: "Our 30-year timeline",
      body: "The milestones that took ICE from a single-city showcase to a hybrid platform spanning 10 cities.",
    },
    partners: {
      title: "Partners that shape the expo",
      body: "Headline sponsors and indie makers co-create with us to set the tone for every edition.",
      cta: { label: "View a partner story", href: "/brands/techvision-labs" },
    },
    work: {
      badge: "Work with us",
      title: "Let’s design your next launch",
      body: "Bring your product, keynote, or pavilion story. We’ll stage it, film it, and measure it.",
      bullets: [
        "Production: staging, AV, lighting, XR, responsive entrances",
        "Experience design: wayfinding, lounges, interactive installs",
        "Content ops: live streaming, media pods, press kits",
        "Measurement: dwell time, sentiment, and lead capture in real time",
      ],
      primaryCta: { label: "Start a project", href: "/contact" },
      secondaryCta: { label: "See past highlights", href: "/gallery" },
    },
  },
};

const run = async () => {
  try {
    const db = await getDb();
    const col = db.collection("about_page");
    await col.updateOne({ key: "default" }, { $set: about }, { upsert: true });
    console.log("About seed applied.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

run();

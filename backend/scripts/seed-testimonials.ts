import { getDb } from "../src/db/mongo";

const testimonialsSeed = {
  key: "default",
  hero: {
    badge: "Voices from ICE",
    title: "Testimonials",
    intro:
      "What our partners, founders, and attendees say about INDIA GLOBAL EXPO. Animated stories from the floor to the main stage.",
    ctaLabel: "Send feedback",
    ctaHref: "/feedback",
    ctaBadge: "Share yours",
    ctaTitle: "Were you at the expo?",
    ctaBody: "Tell us what you loved, what you’d improve, and what you want to see next year. Your feedback shapes the next edition.",
  },
  testimonials: [
    {
      id: "tm-ignite",
      name: "Aarav Mehta",
      role: "Head of Events",
      company: "Ignite Mobility",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=640&auto=format&fit=crop&q=80",
      rating: 5,
      quote: "ICE staged our EV launch like a cinematic premiere—crowd control, lighting, and media pods were flawless.",
    },
    {
      id: "tm-harbor",
      name: "Meera Kulkarni",
      role: "CMO",
      company: "Harbor Fintech",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=640&auto=format&fit=crop&q=80&sat=-35",
      rating: 5,
      quote: "The hybrid broadcast kept investors engaged while on-ground leads doubled. ICE measured everything.",
    },
    {
      id: "tm-craft",
      name: "Rohan Deshpande",
      role: "Founder",
      company: "Crafted Living",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=640&auto=format&fit=crop&q=80",
      rating: 4,
      quote: "From entrance arches to micro-stages, every touchpoint felt bespoke and on-brand.",
    },
    {
      id: "tm-symphony",
      name: "Isha Sharma",
      role: "Director, Brand",
      company: "Symphony Audio",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=640&auto=format&fit=crop&q=80",
      rating: 5,
      quote: "ICE’s content ops team delivered press kits in hours. Our keynote trended across channels.",
    },
    {
      id: "tm-zeno",
      name: "Kabir Bhat",
      role: "VP Marketing",
      company: "Zeno Health",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=640&auto=format&fit=crop&q=80&sat=-10",
      rating: 5,
      quote: "Wayfinding, lounges, and XR demos kept buyers on the floor longer than any prior expo.",
    },
    {
      id: "tm-northstar",
      name: "Priya Nair",
      role: "Co-founder",
      company: "Northstar Labs",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=640&auto=format&fit=crop&q=80&h=640",
      rating: 5,
      quote: "They treated our prototype like a headline act—lighting design and AV made the demo unforgettable.",
    },
    {
      id: "tm-aurora",
      name: "Vikram Rao",
      role: "Head of Partnerships",
      company: "Aurora Networks",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=640&auto=format&fit=crop&q=80&sat=-5",
      rating: 4,
      quote: "Lead capture and sentiment reports were ready next morning. Execution was tight and data-rich.",
    },
    {
      id: "tm-atelier",
      name: "Natasha Singh",
      role: "Experience Lead",
      company: "Atelier Collective",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=640&auto=format&fit=crop&q=80&h=600",
      rating: 5,
      quote: "ICE blended craft and scale—entrances wowed, micro-interactions delighted, and the team felt seamless.",
    },
  ],
};

const run = async () => {
  try {
    const db = await getDb();
  const col = db.collection("testimonials");
  await col.updateOne({ key: "default" }, { $set: testimonialsSeed }, { upsert: true });
  const listCol = db.collection("testimonials_list");
  await listCol.deleteMany({});
  await listCol.insertMany(testimonialsSeed.testimonials);
  console.log("Testimonials seed applied.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

run();

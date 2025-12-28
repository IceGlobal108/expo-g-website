import { getDb } from "../src/db/mongo";

type GallerySection = { heading: string; body: string };
type GalleryComment = { id: string; author: string; message: string; date: string };

type GalleryItem = {
  id: string;
  title: string;
  year: string;
  category: string;
  brand: string;
  image: string;
  excerpt: string;
  article: GallerySection[];
  likes: number;
  comments: GalleryComment[];
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

const makeComment = (id: string, author: string, message: string, date: string): GalleryComment => ({
  id,
  author,
  message,
  date,
});

const gallerySeed: GalleryItem[] = [
  {
    id: "main-stage-2024",
    title: "Main Stage 2024",
    year: "2024",
    category: "Stage",
    brand: "ICEGLOBAL",
    image: "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=1200&auto=format&fit=crop&q=80",
    excerpt: "Cinematic keynote with synchronized lasers, drones, and a live orchestra.",
    article: [
      { heading: "Immersive Production", body: "270-degree projection, volumetric lighting, and rehearsed cues created a film-like narrative arc." },
      { heading: "Audience Energy", body: "12,000+ attendees with crowd-led light effects that reacted to cheers in real time." },
    ],
    likes: 428,
    comments: [makeComment("c1", "Aarav", "Lighting design was next-level.", "2024-03-14")],
    tags: ["keynote", "stage", "production"],
  },
  {
    id: "vr-experience-zone",
    title: "VR Experience Zone",
    year: "2024",
    category: "VR Zone",
    brand: "MetaVR Labs",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80",
    excerpt: "Collaborative VR pods with haptics and spatial audio lounges.",
    article: [
      { heading: "Spatial Storytelling", body: "Themed pods (education, health, entertainment) with haptics and positional audio drove longer dwell times." },
      { heading: "Community-Led Demos", body: "Indie studios shared lanes with headline brands, balancing hype with grassroots innovation." },
    ],
    likes: 312,
    comments: [makeComment("c3", "Riya", "Haptics on the health pod were convincing.", "2024-02-02")],
    tags: ["vr", "immersive", "innovation"],
  },
  {
    id: "aerial-view-2023",
    title: "Aerial View 2023",
    year: "2023",
    category: "Crowds",
    brand: "ICEGLOBAL",
    image: "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=1200&auto=format&fit=crop&q=80",
    excerpt: "Sunset drone sweep capturing the multi-level campus footprint.",
    article: [
      { heading: "Crowd Flow", body: "Wider arterials and micro-hubs dropped queue times 18% while boosting booth visits." },
      { heading: "Energy At Dusk", body: "Golden hour lighting plus LED fascia made the venue feel like a city festival." },
    ],
    likes: 221,
    comments: [makeComment("c4", "Dev", "This shot sold our board on 2024.", "2023-09-18")],
    tags: ["crowd", "operations", "design"],
  },
  {
    id: "grand-entrance",
    title: "Grand Entrance",
    year: "2022",
    category: "Installations",
    brand: "FutureBrand",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop&q=80",
    excerpt: "Kinetic light tunnel reacting to movement and audio cues.",
    article: [
      { heading: "Adaptive Greeting", body: "Motion sensors drove gradient ripples across 3,000 LED nodes." },
      { heading: "Brand Moments", body: "Partners triggered branded sequences, turning arrivals into shareable content." },
    ],
    likes: 198,
    comments: [makeComment("c5", "Nikhil", "Great first impression.", "2022-07-04")],
    tags: ["installation", "lighting", "entry"],
  },
  {
    id: "innovation-booth",
    title: "Innovation Booth",
    year: "2023",
    category: "Booths",
    brand: "TechVision Labs",
    image: "https://images.unsplash.com/photo-1500534314211-4fcbbde5f3c0?w=1200&auto=format&fit=crop&q=80",
    excerpt: "Modular booth rotating products every two hours to keep traffic steady.",
    article: [
      { heading: "Modular Build", body: "Magnetic walls and rail systems let the team reconfigure the booth fast." },
      { heading: "Live Analytics", body: "Heatmaps guided layout tweaks that improved engagement by 22%." },
    ],
    likes: 167,
    comments: [makeComment("c6", "Ananya", "Rotating showcase rewarded repeat visits.", "2023-11-10")],
    tags: ["booth", "design", "engagement"],
  },
  {
    id: "night-arena",
    title: "Night Arena",
    year: "2021",
    category: "Stage",
    brand: "GlobalTech",
    image: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=1200&auto=format&fit=crop&q=80",
    excerpt: "Late-night talks and performances that turned the arena into a lounge.",
    article: [
      { heading: "Hybrid Format", body: "On-site lounges plus remote streaming balanced intimacy with reach." },
      { heading: "Ambient Design", body: "Soundscapes kept the vibe warm without overpowering conversation." },
    ],
    likes: 142,
    comments: [makeComment("c7", "Meera", "Felt like a festival after dark.", "2021-12-12")],
    tags: ["night", "stage", "hybrid"],
  },
  {
    id: "makers-lane",
    title: "Makers Lane",
    year: "2022",
    category: "Workshops",
    brand: "ICE Lab",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
    excerpt: "Hands-on prototyping alley for builders and students.",
    article: [
      { heading: "Tooling On Demand", body: "Laser cutters, 3D printers, and soldering bays staffed by mentors." },
      { heading: "Mini Sprints", body: "4-hour build challenges with demo slots on the community stage." },
    ],
    likes: 118,
    comments: [makeComment("c8", "Kabir", "Best place to get feedback fast.", "2022-08-21")],
    tags: ["workshop", "maker", "education"],
  },
  {
    id: "media-hub",
    title: "Media Hub",
    year: "2023",
    category: "Operations",
    brand: "ICE Studio",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop&q=80",
    excerpt: "Press-ready studio with instant lower-thirds and clip exports.",
    article: [
      { heading: "Live Edit", body: "Producers cut reels in real time for social and broadcast." },
      { heading: "Brand Ready", body: "Templated lower-thirds reduced edit cycles to minutes." },
    ],
    likes: 95,
    comments: [makeComment("c9", "Tanya", "Editors loved the prebuilt graphics.", "2023-10-02")],
    tags: ["media", "ops", "content"],
  },
  {
    id: "immersive-dome",
    title: "Immersive Dome",
    year: "2020",
    category: "Installations",
    brand: "FutureBrand",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&auto=format&fit=crop&q=80",
    excerpt: "360° projection dome with responsive audio and scent cues.",
    article: [
      { heading: "Sensorial Layers", body: "Projection, spatial audio, and controlled scent diffusers synchronized to story beats." },
      { heading: "Queue Design", body: "Staggered entry and pre-show vignettes kept throughput smooth." },
    ],
    likes: 131,
    comments: [makeComment("c10", "Leena", "Felt like stepping into a movie.", "2020-11-18")],
    tags: ["immersive", "dome", "multisensory"],
  },
  {
    id: "city-arches",
    title: "City Arches",
    year: "2024",
    category: "Installations",
    brand: "ICEGLOBAL",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&auto=format&fit=crop&q=80",
    excerpt: "Signature arches themed to each host city with kinetic light paths.",
    article: [
      { heading: "Localized Design", body: "Color palettes and motifs borrowed from each city’s skyline and culture." },
      { heading: "Wayfinding", body: "LED ribbons doubled as navigation cues guiding guests to pavilions." },
    ],
    likes: 187,
    comments: [makeComment("c11", "Ritu", "Loved spotting the city cues.", "2024-01-05")],
    tags: ["arches", "entry", "lighting"],
  },
  {
    id: "brand-alley",
    title: "Brand Alley",
    year: "2023",
    category: "Booths",
    brand: "ICE Sponsors",
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&auto=format&fit=crop&q=80",
    excerpt: "Side-by-side headline booths with unified lighting language.",
    article: [
      { heading: "Shared Infrastructure", body: "Power, rigging, and media pods standardized to cut setup time." },
      { heading: "Cohesive Look", body: "A consistent light scheme tied different brands into one visual story." },
    ],
    likes: 153,
    comments: [makeComment("c12", "Zoya", "Felt premium without looking identical.", "2023-06-14")],
    tags: ["booths", "lighting", "sponsors"],
  },
  {
    id: "innovation-runway",
    title: "Innovation Runway",
    year: "2022",
    category: "Stage",
    brand: "ICE Lab",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&auto=format&fit=crop&q=80",
    excerpt: "Fast-paced demo runway with 10 teams showing in 20 minutes.",
    article: [
      { heading: "Tight Format", body: "Two-minute slots with synced visuals kept energy high." },
      { heading: "Feedback Loop", body: "Live polls ranked audience favorites and fed judges’ questions." },
    ],
    likes: 204,
    comments: [makeComment("c13", "Mihir", "Loved the tempo—no filler.", "2022-05-09")],
    tags: ["demo", "stage", "startups"],
  },
  {
    id: "executive-lounge",
    title: "Executive Lounge",
    year: "2023",
    category: "Hospitality",
    brand: "Premium Partners",
    image: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=1200&auto=format&fit=crop&q=80",
    excerpt: "Invite-only lounge for buyers and sponsors with concierge routing.",
    article: [
      { heading: "Concierge", body: "White-glove hosts coordinated meetings and floor routes." },
      { heading: "Comfort-first", body: "Acoustic zones, soft lighting, and private pods reduced fatigue." },
    ],
    likes: 88,
    comments: [makeComment("c14", "Arjun", "Great place to reset between meetings.", "2023-03-27")],
    tags: ["vip", "lounge", "buyers"],
  },
  {
    id: "future-lab",
    title: "Future Lab",
    year: "2024",
    category: "Innovation",
    brand: "ICE Lab",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=1200&auto=format&fit=crop&q=80",
    excerpt: "Speculative tech corner with AR prototypes and robotics.",
    article: [
      { heading: "Hands-on", body: "Guided interactions with AR tools and companion robots." },
      { heading: "Signals", body: "Visitor feedback captured to inform next year’s playbook." },
    ],
    likes: 177,
    comments: [makeComment("c15", "Saloni", "AR desk was my favorite stop.", "2024-02-18")],
    tags: ["innovation", "ar", "robotics"],
  },
  {
    id: "legacy-wall",
    title: "Legacy Wall",
    year: "2021",
    category: "Installations",
    brand: "ICEGLOBAL",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&auto=format&fit=crop&q=80",
    excerpt: "Interactive timeline wall covering three decades of ICE milestones.",
    article: [
      { heading: "Touch & Motion", body: "Visitors scrubbed through milestones with light trails following their hands." },
      { heading: "Data Layer", body: "Linked stats for each year surfaced buyer and brand counts." },
    ],
    likes: 134,
    comments: [makeComment("c16", "Suresh", "Loved the history in one glance.", "2021-09-02")],
    tags: ["timeline", "interactive", "legacy"],
  },
  {
    id: "soundstage",
    title: "Soundstage",
    year: "2022",
    category: "Stage",
    brand: "ICE Studio",
    image: "https://images.unsplash.com/photo-1500534314211-4fcbbde5f3c0?w=1200&auto=format&fit=crop&q=80",
    excerpt: "Live podcast and interview stage with modular backdrops.",
    article: [
      { heading: "Rapid Turn", body: "Magnetic backdrops and lighting presets cut changeover to 5 minutes." },
      { heading: "Audience Capture", body: "On-site clips published instantly to social feeds." },
    ],
    likes: 109,
    comments: [makeComment("c17", "Imran", "Smooth transitions between sessions.", "2022-04-11")],
    tags: ["podcast", "media", "stage"],
  },
  {
    id: "city-market",
    title: "City Market",
    year: "2023",
    category: "Booths",
    brand: "Local Makers",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80",
    excerpt: "Local artisan alley with rotating pop-ups and tasting bars.",
    article: [
      { heading: "Rotation Plan", body: "Vendors swapped every four hours to keep discovery high." },
      { heading: "Senses", body: "Lighting, scent, and ambient music tuned per vendor theme." },
    ],
    likes: 141,
    comments: [makeComment("c18", "Pooja", "Came back twice for the food lane.", "2023-07-22")],
    tags: ["local", "market", "pop-up"],
  },
  {
    id: "tech-bridge",
    title: "Tech Bridge",
    year: "2024",
    category: "Installations",
    brand: "GlobalTech",
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&auto=format&fit=crop&q=80",
    excerpt: "LED bridge connecting halls with reactive footsteps and sound.",
    article: [
      { heading: "Reactive Path", body: "Pressure sensors lit panels under each step with soft tones." },
      { heading: "Traffic Flow", body: "Bridge placement improved circulation between main and annex halls." },
    ],
    likes: 163,
    comments: [makeComment("c19", "Rohan", "Turned a walkway into an experience.", "2024-03-03")],
    tags: ["installation", "lighting", "wayfinding"],
  },
  {
    id: "vip-summit",
    title: "VIP Summit",
    year: "2023",
    category: "Hospitality",
    brand: "Premium Partners",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=1200&auto=format&fit=crop&q=80",
    excerpt: "Closed-door summit for buyers, sponsors, and government partners.",
    article: [
      { heading: "Secure Stage", body: "Off-record sessions with layered access control and NDAs handled in-app." },
      { heading: "Executive Ops", body: "White-glove transport and escort routing ensured zero downtime." },
    ],
    likes: 102,
    comments: [makeComment("c20", "Varun", "Flawless logistics for high-stakes meetings.", "2023-02-14")],
    tags: ["vip", "summit", "buyers"],
  },
];

const run = async () => {
  try {
    const db = await getDb();
    const col = db.collection<GalleryItem>("gallery");
    await col.deleteMany({});
    const now = new Date();
    await col.insertMany(gallerySeed.map((item) => ({ ...item, createdAt: now, updatedAt: now })));
    console.log(`Seeded gallery with ${gallerySeed.length} items.`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

run();

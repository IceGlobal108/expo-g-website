import { getDb } from "../src/db/mongo";

type Highlight = { title: string; body: string };
type Metric = { label: string; value: string };

type Buyer = {
  id: string;
  name: string;
  city: string;
  segment: string;
  quote: string;
  spend: string;
  visits: string;
  image: string;
  href?: string;
  detail?: {
    headline?: string;
    summary?: string;
    heroImage?: string;
    highlights?: Highlight[];
    metrics?: Metric[];
    pullQuote?: string;
    ctaLabel?: string;
    ctaHref?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

const buyers: Buyer[] = [
  {
    id: "buyer-1",
    name: "Aanya Singh",
    city: "Mumbai",
    segment: "Lifestyle",
    quote: "I plan routes on their app and still end up staying longer—too many good stalls and after-hours sets.",
    spend: "₹18K basket",
    visits: "4th year",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&h=800&fit=crop",
    href: "/buyers/aanya-singh",
    detail: {
      headline: "Curated lanes, longer stays",
      summary: "Mapped routes with the app, but the late sets kept me onsite till close.",
      heroImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        { title: "Planned routes", body: "Used curated lanes to hit every drop without backtracking." },
        { title: "After-hours sets", body: "Stayed for music programming that extended dwell time." },
      ],
      metrics: [
        { label: "Basket", value: "₹18K" },
        { label: "Hours onsite", value: "8+" },
      ],
      ctaLabel: "Plan a buyer lane",
      ctaHref: "/contact",
    },
  },
  {
    id: "buyer-2",
    name: "Rahul Mehta",
    city: "Delhi",
    segment: "Electronics",
    quote: "Workshops and deals in one place. I closed vendor contracts and picked up gear the same day.",
    spend: "₹22K at expo",
    visits: "3rd year",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
    href: "/buyers/rahul-mehta",
    detail: {
      headline: "Workshops to checkout",
      summary: "Hands-on workshops fed straight into expo-only deals.",
      heroImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        { title: "Hands-on sessions", body: "Booked workshops and sealed orders in one loop." },
        { title: "On-site finance", body: "Finance desks next to booths reduced friction." },
      ],
      metrics: [
        { label: "Orders placed", value: "6" },
        { label: "Meetings", value: "9" },
      ],
    },
  },
  {
    id: "buyer-3",
    name: "Simran Kaur",
    city: "Bengaluru",
    segment: "Home & Decor",
    quote: "Love the curated lanes—less wandering, more discovering. The lounge keeps me around till late.",
    spend: "₹15K basket",
    visits: "5th year",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop",
    href: "/buyers/simran-kaur",
    detail: {
      headline: "Home lanes that convert",
      summary: "Curated decor lanes and lounge kept discovery effortless.",
      heroImage: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        { title: "Curated path", body: "Followed lane signage to hit every decor drop." },
        { title: "Lounge dwell", body: "Quiet lounge made late-night decisions easy." },
      ],
      metrics: [
        { label: "Basket", value: "₹15K" },
        { label: "Vendors closed", value: "4" },
      ],
    },
  },
  {
    id: "buyer-4",
    name: "Arjun Pillai",
    city: "Chennai",
    segment: "Automotive",
    quote: "Test drives, finance desks, and product drops in one circuit. Zero downtime between sessions.",
    spend: "₹35K committed",
    visits: "2nd year",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop",
    href: "/buyers/arjun-pillai",
    detail: {
      headline: "Auto lane with zero downtime",
      summary: "Drive lane, finance desk, and reveal stage within steps.",
      heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        { title: "Drive lane", body: "Scheduled back-to-back test drives with SMS nudges." },
        { title: "Finance desk", body: "Prepped paperwork near the lane to sign same-day." },
      ],
      metrics: [
        { label: "Pilots", value: "3" },
        { label: "Drives", value: "11" },
      ],
    },
  },
  {
    id: "buyer-5",
    name: "Ira Mukherjee",
    city: "Kolkata",
    segment: "Fashion",
    quote: "Timed drops and mirror AR let me try looks fast—no waiting in long lines.",
    spend: "₹12K basket",
    visits: "1st year",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop",
    detail: {
      headline: "Fashion drops on cadence",
      summary: "AR mirrors and timed reveals sped up decisions.",
      heroImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        { title: "AR try-ons", body: "Mirror AR reduced queue for fitting rooms." },
        { title: "Drop cadence", body: "Every hour a new capsule to keep crowd fresh." },
      ],
      metrics: [
        { label: "Fits tried", value: "14" },
        { label: "Time saved", value: "35 min" },
      ],
    },
  },
  {
    id: "buyer-6",
    name: "Karan Deshpande",
    city: "Pune",
    segment: "Tech Pro",
    quote: "Developer pods with office hours were the highlight. I booked consults instantly.",
    spend: "₹28K hardware",
    visits: "3rd year",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop",
    detail: {
      headline: "Dev pods that convert",
      summary: "Office hours and product trials in one lane.",
      heroImage: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        { title: "Office hours", body: "Booked 1:1 consults right after demos." },
        { title: "Trial rigs", body: "Hands-on rigs preloaded with sample projects." },
      ],
      metrics: [
        { label: "Consults", value: "7" },
        { label: "Orders", value: "3" },
      ],
    },
  },
  {
    id: "buyer-7",
    name: "Divya Rao",
    city: "Hyderabad",
    segment: "Beauty",
    quote: "Skin analysis kiosk recommended stalls; samples were bagged automatically.",
    spend: "₹9K basket",
    visits: "2nd year",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop",
    detail: {
      headline: "Beauty lane with smart picks",
      summary: "Skin kiosk routed me to the right booths and prepped samples.",
      heroImage: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        { title: "Skin kiosk", body: "Quick scan produced a recommended route." },
        { title: "Sample bagging", body: "Staff bagged samples per route to save time." },
      ],
      metrics: [
        { label: "Samples", value: "18" },
        { label: "Time saved", value: "20 min" },
      ],
    },
  },
  {
    id: "buyer-8",
    name: "Rohini Bhatt",
    city: "Ahmedabad",
    segment: "Home Tech",
    quote: "Smart home alley let me simulate my house; decisions were instant.",
    spend: "₹24K basket",
    visits: "2nd year",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop",
    detail: {
      headline: "Smart home alley",
      summary: "Room-scale setup mirrored my apartment for quick buys.",
      heroImage: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        { title: "Room presets", body: "Preset rooms matched typical Indian apartments." },
        { title: "Bundle offers", body: "Bundles configured based on chosen presets." },
      ],
      metrics: [
        { label: "Bundles", value: "3" },
        { label: "Setup time", value: "15 min" },
      ],
    },
  },
  {
    id: "buyer-9",
    name: "Sidharth Nair",
    city: "Kochi",
    segment: "Food & Gourmet",
    quote: "Tasting lanes with nutrition overlays made choices easy.",
    spend: "₹11K basket",
    visits: "1st year",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&h=800&fit=crop",
    detail: {
      headline: "Tasting lane with insights",
      summary: "Nutrition overlays and chef-led tastings sped sampling.",
      heroImage: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        { title: "Nutrition overlay", body: "Tablet overlays explained macros per sample." },
        { title: "Chef cadence", body: "Chef-led tastings every 30 minutes." },
      ],
      metrics: [
        { label: "Samples tried", value: "12" },
        { label: "Basket", value: "₹11K" },
      ],
    },
  },
  {
    id: "buyer-10",
    name: "Leena Shah",
    city: "Surat",
    segment: "Textiles",
    quote: "Fabric archive plus instant sourcing desk—closed suppliers the same day.",
    spend: "₹19K orders",
    visits: "3rd year",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop",
    detail: {
      headline: "Textile archive lane",
      summary: "Touch-and-feel archive linked to sourcing desk nearby.",
      heroImage: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        { title: "Archive", body: "Swatch library tagged to supplier desks." },
        { title: "Instant sourcing", body: "Sourcing desk created draft POs on the spot." },
      ],
      metrics: [
        { label: "Suppliers", value: "5" },
        { label: "Orders", value: "₹19K" },
      ],
    },
  },
  {
    id: "buyer-11",
    name: "Pranav Kulkarni",
    city: "Pune",
    segment: "Sports",
    quote: "Demo tunnels let me test gear with coaches giving tips.",
    spend: "₹14K basket",
    visits: "2nd year",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&h=800&fit=crop",
    detail: {
      headline: "Sports demo tunnel",
      summary: "Guided drills plus gear checkout via QR.",
      heroImage: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        { title: "Coach-led drills", body: "Coaches ran quick drills inside demo tunnel." },
        { title: "QR checkout", body: "QR codes on gear triggered cart links." },
      ],
      metrics: [
        { label: "Gear tested", value: "9" },
        { label: "Basket", value: "₹14K" },
      ],
    },
  },
  {
    id: "buyer-12",
    name: "Tara Kapoor",
    city: "Jaipur",
    segment: "Handicrafts",
    quote: "Maker alley showed process videos; I bought directly from artisans.",
    spend: "₹10K basket",
    visits: "1st year",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop",
    detail: {
      headline: "Maker alley",
      summary: "Process videos and live demos built trust instantly.",
      heroImage: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        { title: "Process reveal", body: "Short loops of craft process played above stalls." },
        { title: "Direct buy", body: "Direct payment links to artisans reduced friction." },
      ],
      metrics: [
        { label: "Artisans backed", value: "7" },
        { label: "Basket", value: "₹10K" },
      ],
    },
  },
  {
    id: "buyer-13",
    name: "Veer Gupta",
    city: "Lucknow",
    segment: "Furniture",
    quote: "AR sizing solved my fit issues; lounge staff prepped quotes.",
    spend: "₹32K basket",
    visits: "2nd year",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop",
    detail: {
      headline: "Furniture sizing solved",
      summary: "AR sizing and lounge quotes shrunk the decision cycle.",
      heroImage: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        { title: "AR fit", body: "AR sizing compared pieces to my room dimensions." },
        { title: "Quote lounge", body: "Lounge staff drafted quotes while I browsed." },
      ],
      metrics: [
        { label: "Quotes", value: "3" },
        { label: "Basket", value: "₹32K" },
      ],
    },
  },
  {
    id: "buyer-14",
    name: "Ananya Bose",
    city: "Kolkata",
    segment: "Books & Media",
    quote: "Author meets and quiet pods made it feel premium.",
    spend: "₹6K basket",
    visits: "1st year",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop",
    detail: {
      headline: "Premium book lane",
      summary: "Quiet pods and author meets lifted perceived value.",
      heroImage: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        { title: "Quiet pods", body: "Sound-dampened nooks to sample audiobooks." },
        { title: "Author meets", body: "Scheduled signings kept crowds organized." },
      ],
      metrics: [
        { label: "Signed copies", value: "5" },
        { label: "Basket", value: "₹6K" },
      ],
    },
  },
  {
    id: "buyer-15",
    name: "Harsh Vyas",
    city: "Mumbai",
    segment: "Gaming",
    quote: "Tournament zone plus merch made it a full-day plan.",
    spend: "₹13K basket",
    visits: "3rd year",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&h=800&fit=crop",
    detail: {
      headline: "Gaming day plan",
      summary: "Tournaments, merch, and snack lane kept me on-site.",
      heroImage: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        { title: "Tournament zone", body: "Hourly brackets with live casting." },
        { title: "Merch lane", body: "Limited drops tied to bracket winners." },
      ],
      metrics: [
        { label: "Matches played", value: "9" },
        { label: "Basket", value: "₹13K" },
      ],
    },
  },
  {
    id: "buyer-16",
    name: "Ritika Sharma",
    city: "Delhi",
    segment: "Wellness",
    quote: "Wellness studios with guided sessions made it feel like a retreat.",
    spend: "₹8K basket",
    visits: "2nd year",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop",
    detail: {
      headline: "Wellness retreat lane",
      summary: "Guided micro-sessions and calm zones lengthened dwell.",
      heroImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        { title: "Micro-sessions", body: "10-minute guided sessions scheduled hourly." },
        { title: "Calm zones", body: "Soft lighting and aromatherapy reduced fatigue." },
      ],
      metrics: [
        { label: "Sessions", value: "4" },
        { label: "Basket", value: "₹8K" },
      ],
    },
  },
  {
    id: "buyer-17",
    name: "Sameer Ali",
    city: "Bengaluru",
    segment: "Cloud/IT",
    quote: "Infra pods let me compare vendors quickly; docs handed on QR.",
    spend: "₹26K contracts",
    visits: "4th year",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop",
    detail: {
      headline: "Infra pods for quick decisions",
      summary: "Side-by-side demos with instant doc handoff.",
      heroImage: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        { title: "Side-by-side", body: "Pods arranged to compare vendors in one aisle." },
        { title: "QR handoff", body: "Docs and pricing shared via QR after demos." },
      ],
      metrics: [
        { label: "Vendors compared", value: "5" },
        { label: "Contracts", value: "₹26K" },
      ],
    },
  },
  {
    id: "buyer-18",
    name: "Neha Sood",
    city: "Chandigarh",
    segment: "Kids",
    quote: "Family-first layout with stroller lanes—stress free and quick.",
    spend: "₹7K basket",
    visits: "1st year",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop",
    detail: {
      headline: "Family-first layout",
      summary: "Stroller lanes and kids zones made it smooth.",
      heroImage: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        { title: "Stroller lanes", body: "Extra-wide aisles and rest bays." },
        { title: "Kids zones", body: "Activity pods so parents could shop nearby." },
      ],
      metrics: [
        { label: "Breaks needed", value: "Few" },
        { label: "Basket", value: "₹7K" },
      ],
    },
  },
  {
    id: "buyer-19",
    name: "Omkar Patil",
    city: "Nagpur",
    segment: "Agri-tech",
    quote: "Live farm simulations showed ROI; I booked pilots on site.",
    spend: "₹18K pilot",
    visits: "1st year",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop",
    detail: {
      headline: "Agri ROI on display",
      summary: "Mini farm plots with live telemetry convinced me fast.",
      heroImage: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        { title: "Live telemetry", body: "Yield and cost visuals updated live." },
        { title: "Pilot desk", body: "Pilot drafts signed on-site with agronomists." },
      ],
      metrics: [
        { label: "Pilots", value: "2" },
        { label: "ROI shown", value: "Real-time" },
      ],
    },
  },
  {
    id: "buyer-20",
    name: "Sara D'Souza",
    city: "Goa",
    segment: "Travel",
    quote: "Experience pods sold me itineraries; live deals went fast.",
    spend: "₹16K bookings",
    visits: "2nd year",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop",
    detail: {
      headline: "Travel pods with live deals",
      summary: "Immersive pods showed itineraries; deals were time-boxed.",
      heroImage: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        { title: "Immersive pods", body: "VR pods previewed itineraries in 3 minutes." },
        { title: "Timed deals", body: "Deals refreshed every hour to keep urgency." },
      ],
      metrics: [
        { label: "Bookings", value: "₹16K" },
        { label: "Demos", value: "10" },
      ],
    },
  },
];

const run = async () => {
  try {
    const db = await getDb();
    const col = db.collection<Buyer>("buyers_list");
    await col.deleteMany({});
    const now = new Date();
    await col.insertMany(buyers.map((b) => ({ ...b, createdAt: now, updatedAt: now })));
    console.log(`Seeded ${buyers.length} buyers.`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

run();

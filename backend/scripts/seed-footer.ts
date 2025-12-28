import { getDb } from "../src/db/mongo";

const defaultFooter = {
  key: "default",
  ctaTitle: "Ready to create the next unforgettable expo moment?",
  ctaDescription: "Choose your path—co-create as a partner or own the spotlight as a sponsor. We’ll craft an experience that people replay and share.",
  partnerHref: "/partner",
  sponsorHref: "/sponsor",
  exploreLinks: [
    { name: "Gallery", href: "/gallery" },
    { name: "About Us", href: "/about" },
    { name: "Past Events", href: "/gallery" },
    { name: "Testimonials", href: "/testimonials" },
  ],
  partnersLinks: [
    { name: "Become a Partner", href: "/partner" },
    { name: "Sponsor an Event", href: "/sponsor" },
    { name: "Brand Guidelines", href: "/brand-guidelines" },
    { name: "Media Kit", href: "/contact" },
  ],
  legalLinks: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
  contact: { location: "Bangalore, India", email: "hello@ICEGLOBAL.com", phone: "+91 98765 43210" },
  socials: [
    { label: "Instagram", href: "https://instagram.com/iceglobal" },
    { label: "Twitter", href: "https://twitter.com/iceglobal" },
    { label: "LinkedIn", href: "https://linkedin.com/company/iceglobal" },
  ],
};

const run = async () => {
  try {
    const db = await getDb();
    const col = db.collection("footer");
    await col.updateOne({ key: "default" }, { $set: defaultFooter }, { upsert: true });
    console.log("Footer seed applied.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

run();

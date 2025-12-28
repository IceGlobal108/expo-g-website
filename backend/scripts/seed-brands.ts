import { getDb } from "../src/db/mongo";

const defaultBrands = {
  key: "default",
  eyebrow: "Trustworthy Leaders",
  title: "Brands that trust ICE Exhibitions",
  description: "Logos and stories from partners who have built standout moments on our platform.",
  brands: [
    {
      slug: "techvision-labs",
      name: "TechVision Labs",
      logo: "TV",
      relationship: "3-Year Partner",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&auto=format&fit=crop&q=80",
    },
    {
      slug: "innovatecorp",
      name: "InnovateCorp",
      logo: "IC",
      relationship: "Headline Sponsor",
      category: "Innovation",
      image: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=800&auto=format&fit=crop&q=80",
    },
    {
      slug: "futurebrand",
      name: "FutureBrand",
      logo: "FB",
      relationship: "5-Year Partner",
      category: "Branding",
      image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&auto=format&fit=crop&q=80",
    },
    {
      slug: "globaltech",
      name: "GlobalTech",
      logo: "GT",
      relationship: "Premium Partner",
      category: "Enterprise",
      image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&auto=format&fit=crop&q=80",
    },
  ],
};

const run = async () => {
  try {
    const db = await getDb();
    const col = db.collection("brands_highlights");
    await col.updateOne({ key: "default" }, { $set: defaultBrands }, { upsert: true });
    console.log("Brands highlights seed applied.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

run();

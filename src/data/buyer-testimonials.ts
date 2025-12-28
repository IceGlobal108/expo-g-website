export type BuyerTestimonial = {
  id: string;
  name: string;
  city: string;
  segment: string;
  quote: string;
  spend: string;
  visits: string;
  image: string;
  href?: string;
};

export const buyerTestimonials: BuyerTestimonial[] = [
  {
    id: "buyer-1",
    name: "Aanya Singh",
    city: "Mumbai",
    segment: "Lifestyle buyer",
    quote: "I plan routes on their app and still end up staying longer—too many good stalls and after-hours sets.",
    spend: "Avg. cart: ₹18K",
    visits: "4th year",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&h=800&fit=crop",
    href: "/buyers/aanya-singh",
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
  },
];

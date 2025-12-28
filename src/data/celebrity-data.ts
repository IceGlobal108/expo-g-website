export type Celebrity = {
  name: string;
  title: string;
  quote?: string;
  image: string;
  badge?: string;
  href?: string;
};

export const celebritySpotlights: Celebrity[] = [
  {
    name: "Aarav Kapoor",
    title: "Film Actor",
    quote: "ICE Exhibitions made the stage feel like a cinematic premiere.",
    image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=600&h=800&fit=crop",
    badge: "Keynote Guest",
    href: "/gallery",
  },
  {
    name: "Ishita Rao",
    title: "Singer & Performer",
    quote: "The energy of the crowd here is unmatched.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop",
    badge: "Headliner",
    href: "/gallery",
  },
  {
    name: "Vihaan Mehta",
    title: "Tech Influencer",
    quote: "Every zone is built for shareable moments.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=800&fit=crop",
    badge: "Guest Host",
    href: "/gallery",
  },
  {
    name: "Zara Ali",
    title: "Entrepreneur",
    quote: "A perfect blend of business and festival vibes.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop",
    badge: "Investor Panel",
    href: "/gallery",
  },
  {
    name: "Kabir Singh",
    title: "Sports Personality",
    quote: "The production quality is world-class.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop",
    badge: "Special Appearance",
    href: "/gallery",
  },
  {
    name: "Meera Nair",
    title: "TV Host",
    quote: "Stories here practically film themselves.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop",
    badge: "Red Carpet",
    href: "/gallery",
  },
];

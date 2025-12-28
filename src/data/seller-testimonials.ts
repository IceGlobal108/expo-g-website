export type SellerTestimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  outcome: string;
  image: string;
  href?: string;
};

export const sellerTestimonials: SellerTestimonial[] = [
  {
    id: "seller-1",
    name: "Priya Menon",
    role: "Founder",
    company: "Studio Meridian",
    quote: "We sold out inventory by day two—footfall stayed consistent because the booth schedule was choreographed for us.",
    outcome: "+42% repeat visits vs. last expo",
    image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=600&h=800&fit=crop",
    href: "/stories/seller-1",
  },
  {
    id: "seller-2",
    name: "Rajat Verma",
    role: "Director of Sales",
    company: "NovaCraft",
    quote: "Lead capture, live demos, and media hits happened in one lane. ICE made us feel like a headline act, not a booth number.",
    outcome: "210 meetings booked on-site",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop",
    href: "/stories/seller-2",
  },
  {
    id: "seller-3",
    name: "Nisha Kapoor",
    role: "COO",
    company: "Arka Living",
    quote: "They coached our team on storytelling and timing. Every two-hour drop felt like a mini-launch.",
    outcome: "3.1x lift in qualified leads",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop",
    href: "/stories/seller-3",
  },
  {
    id: "seller-4",
    name: "Aditya Rao",
    role: "Head of Growth",
    company: "Lumio",
    quote: "The night programming kept decision-makers around. We closed deals at the lounge, not the booth.",
    outcome: "5 enterprise pilots signed",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop",
    href: "/stories/seller-4",
  },
];

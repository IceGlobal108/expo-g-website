// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import { FloatingNavbar } from "@/components/ui/floating-navbar";
// import { BackgroundBeams } from "@/components/ui/background-effects";
// import { StatsStrip } from "@/components/ui/stats-strip";
// import { StickyScrollReveal } from "@/components/ui/sticky-scroll-reveal";
// import Footer from "@/components/Footer";
// import { navItems, stats, brandHighlights, timelineContent } from "@/data/expo-data";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";

// type CTA = { label: string; href: string };
// type Platform = { eyebrow: string; title: string; body: string; cta: CTA };
// type Pillar = { title: string; body: string };
// type AboutContent = {
//   hero: { badge: string; title: string; body: string; primaryCta: CTA; secondaryCta: CTA };
//   platforms: Platform[];
//   pillars: Pillar[];
//   timeline: { badge: string; title: string; body: string };
//   partners: { title: string; body: string; cta: CTA };
//   work: { badge: string; title: string; body: string; bullets: string[]; primaryCta: CTA; secondaryCta: CTA };
// };

// const fallbackAbout: AboutContent = {
//   hero: {
//     badge: "About ICE",
//     title: "Production-grade expos with festival energy",
//     body:
//       "We engineer the arrivals, stages, booths, and broadcasts that make brands feel cinematic and buyers feel invited—online and on-ground.",
//     primaryCta: { label: "Talk to production", href: "/contact" },
//     secondaryCta: { label: "Review the moments", href: "/gallery" },
//   },
//   platforms: [
//     {
//       eyebrow: "ICE 1.0",
//       title: "Offline expo platform",
//       body: "A decade of physical showcases across India—arches, pavilions, lounges, and stages built to festival standards.",
//       cta: { label: "See legacy moments", href: "/gallery" },
//     },
//     {
//       eyebrow: "ICE 2.0 · IGE & IGN",
//       title: "Hybrid + digital platform",
//       body: "Broadcast-grade streams, press-ready content, and data-backed attendee journeys that extend every launch.",
//       cta: { label: "Plan a hybrid drop", href: "/contact" },
//     },
//   ],
//   pillars: [
//     { title: "Stagecraft", body: "Cinematic main stages, responsive lighting, and immersive entrances that set the tone the moment guests arrive." },
//     { title: "Hybrid by design", body: "ICE 2.0 bridges on-ground experiences with live streams, media pods, and digital routes that keep audiences connected." },
//     { title: "Measurable impact", body: "Dwell-time, sentiment, and lead capture measured in real time so every experience maps to outcomes." },
//   ],
//   timeline: {
//     badge: "Legacy in motion",
//     title: "Our 30-year timeline",
//     body: "The milestones that took ICE from a single-city showcase to a hybrid platform spanning 10 cities.",
//   },
//   partners: {
//     title: "Partners that shape the expo",
//     body: "Headline sponsors and indie makers co-create with us to set the tone for every edition.",
//     cta: { label: "View a partner story", href: "/brands/techvision-labs" },
//   },
//   work: {
//     badge: "Work with us",
//     title: "Let’s design your next launch",
//     body: "Bring your product, keynote, or pavilion story. We’ll stage it, film it, and measure it.",
//     bullets: [
//       "Production: staging, AV, lighting, XR, responsive entrances",
//       "Experience design: wayfinding, lounges, interactive installs",
//       "Content ops: live streaming, media pods, press kits",
//       "Measurement: dwell time, sentiment, and lead capture in real time",
//     ],
//     primaryCta: { label: "Start a project", href: "/contact" },
//     secondaryCta: { label: "See past highlights", href: "/gallery" },
//   },
// };

// const About = () => {
//   const [about, setAbout] = useState<AboutContent>(fallbackAbout);
//   const base = import.meta.env.VITE_API_BASE_URL || "";

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await fetch(`${base}/about`);
//         if (!res.ok) throw new Error();
//         const data = await res.json();
//         setAbout(data);
//       } catch {
//         setAbout(fallbackAbout);
//       }
//     };
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <main className="min-h-screen bg-background text-foreground">
//       <FloatingNavbar navItems={navItems} />

//       <section className="relative overflow-hidden pt-28 md:pt-36 pb-16 md:pb-20">
//         <BackgroundBeams className="z-0" />
//         <div className="container-custom relative z-10 grid lg:grid-cols-2 gap-10 items-end">
//           <div className="space-y-6">
//             <Badge variant="secondary" className="text-xs uppercase tracking-[0.25em]">
//               {about.hero.badge}
//             </Badge>
//             <div className="space-y-4">
//               <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">{about.hero.title}</h1>
//               <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">{about.hero.body}</p>
//             </div>
//             <div className="flex flex-wrap gap-3">
//               <Button asChild variant="hero">
//                 <Link to={about.hero.primaryCta.href}>{about.hero.primaryCta.label}</Link>
//               </Button>
//               <Button asChild variant="outline">
//                 <Link to={about.hero.secondaryCta.href}>{about.hero.secondaryCta.label}</Link>
//               </Button>
//             </div>
//           </div>
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, margin: "-50px" }}
//             transition={{ duration: 0.6 }}
//             className="relative h-full"
//           >
//             <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-primary/10 backdrop-blur-xl space-y-4">
//               {about.platforms.map((card) => (
//                 <div key={card.title} className="rounded-2xl border border-border/60 bg-card/80 p-5 space-y-2">
//                   <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]">
//                     {card.eyebrow}
//                   </div>
//                   <h3 className="text-xl font-display font-semibold">{card.title}</h3>
//                   <p className="text-sm text-muted-foreground">{card.body}</p>
//                   <Link to={card.cta.href || "/"} className="text-primary text-sm font-semibold hover:text-primary/80">
//                     {card.cta.label || "Learn more"}
//                   </Link>
//                 </div>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       <StatsStrip stats={stats} className="bg-card/40 border-y border-border/70" />

//       <section className="section-padding">
//         <div className="container-custom grid lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-1 space-y-4">
//             <h2 className="text-3xl md:text-4xl font-display font-bold">What we build</h2>
//             <p className="text-muted-foreground">
//               Every edition blends production, technology, and operations into a single playbook that travels with us.
//             </p>
//           </div>
//           <div className="lg:col-span-2 grid md:grid-cols-3 gap-4">
//             {about.pillars.map((pillar, idx) => (
//               <motion.div
//                 key={pillar.title}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: idx * 0.05, duration: 0.5 }}
//                 className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-5"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
//                 <div className="relative space-y-2">
//                   <h3 className="text-xl font-display font-semibold">{pillar.title}</h3>
//                   <p className="text-muted-foreground text-sm">{pillar.body}</p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className="section-padding">
//         <div className="container-custom space-y-6 text-center">
//           <Badge variant="secondary" className="mx-auto">
//             {about.timeline.badge}
//           </Badge>
//           <h2 className="text-3xl md:text-4xl font-display font-bold">{about.timeline.title}</h2>
//           <p className="text-muted-foreground max-w-3xl mx-auto">{about.timeline.body}</p>
//         </div>
//         <StickyScrollReveal content={timelineContent} />
//       </section>

//       <section className="section-padding bg-card/40 border-y border-border/60">
//         <div className="container-custom space-y-8">
//           <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
//             <div>
//               <h2 className="text-3xl md:text-4xl font-display font-bold">{about.partners.title}</h2>
//               <p className="text-muted-foreground max-w-2xl">{about.partners.body}</p>
//             </div>
//             <Button asChild variant="outline">
//               <Link to={about.partners.cta.href || "/brands"}>{about.partners.cta.label || "View a partner story"}</Link>
//             </Button>
//           </div>
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {brandHighlights.map((brand) => (
//               <motion.div
//                 key={brand.slug}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.4 }}
//                 className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-4"
//               >
//                 <img
//                   src={brand.image}
//                   alt={brand.name}
//                   className="w-full h-36 object-cover rounded-xl mb-3 border border-border/60"
//                 />
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-muted-foreground">{brand.relationship}</p>
//                     <p className="font-display font-semibold">{brand.name}</p>
//                   </div>
//                   <Badge variant="secondary">{brand.category}</Badge>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className="section-padding">
//         <div className="container-custom grid md:grid-cols-2 gap-8 items-center">
//           <div className="space-y-3">
//             <Badge variant="secondary">{about.work.badge}</Badge>
//             <h3 className="text-3xl md:text-4xl font-display font-bold">{about.work.title}</h3>
//             <p className="text-muted-foreground">{about.work.body}</p>
//             <div className="flex gap-3">
//               <Button asChild variant="hero">
//                 <Link to={about.work.primaryCta.href}>{about.work.primaryCta.label}</Link>
//               </Button>
//               <Button asChild variant="outline">
//                 <Link to={about.work.secondaryCta.href}>{about.work.secondaryCta.label}</Link>
//               </Button>
//             </div>
//           </div>
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5 }}
//             className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-xl shadow-primary/10"
//           >
//             <ul className="space-y-3 text-sm text-muted-foreground">
//               {about.work.bullets.map((b, idx) => (
//                 <li key={idx}>• {b}</li>
//               ))}
//             </ul>
//           </motion.div>
//         </div>
//       </section>

//       <Footer />
//     </main>
//   );
// };

// export default About;



import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FloatingNavbar } from "@/components/ui/floating-navbar";
import Footer from "@/components/Footer";
import { StatsStrip } from "@/components/ui/stats-strip";
import { navItems, stats } from "@/data/expo-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const team = [
  {
    name: "Amit Sharma",
    title: "Founder & CEO",
    image: "/team/amit.jpg",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Rohit Verma",
    title: "Head of Production",
    image: "/team/rohit.jpg",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Neha Kapoor",
    title: "Experience Director",
    image: "/team/neha.jpg",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Vikram Singh",
    title: "Operations Director",
    image: "/team/vikram.jpg",
    linkedin: "https://linkedin.com"
  }
];

const testimonials = [
  {
    name: "Raj Malhotra",
    title: "Marketing Director",
    company: "TechVision Labs",
    logo: "/logos/techvision.png",
    quote:
      "ICE Global delivered one of the most successful product launch events we have ever hosted."
  },
  {
    name: "Sarah Patel",
    title: "Brand Lead",
    company: "Nova Electronics",
    logo: "/logos/nova.png",
    quote:
      "Their ability to combine physical event production with digital reach is unmatched."
  }
];

const timeline = [
  { year: "2001", text: "ICE Global founded in Mumbai" },
  { year: "2008", text: "Expanded to 5 cities across India" },
  { year: "2015", text: "Delivered 250+ brand events" },
  { year: "2020", text: "Launched hybrid digital event platform" },
  { year: "2024", text: "500+ events delivered across 20 cities" }
];

const About = () => {

  const [data,setData] = useState<any>(null)
  const base = import.meta.env.VITE_API_BASE_URL || ""

  useEffect(()=>{
    const load = async()=>{
      try{
        const res = await fetch(`${base}/about`)
        const json = await res.json()
        setData(json)
      }catch{
        setData(null)
      }
    }
    load()
  },[])

  return (

  <main className="min-h-screen bg-background text-foreground">

    <FloatingNavbar navItems={navItems}/>

{/* HERO */}

<section className="pt-32 pb-16 container-custom">

<Badge className="mb-4">About ICE Global</Badge>

<h1 className="text-5xl font-bold mb-6">
Since 2001 we have delivered 500+ events across 20 cities.
</h1>

<p className="text-muted-foreground max-w-2xl">
ICE Global is a production and experience design company that builds
large-scale exhibitions, product launches, and hybrid brand events
for Fortune 500 companies and emerging technology brands.
</p>

<div className="mt-6 flex gap-3">

<Button asChild>
<Link to="/contact">Start a project</Link>
</Button>

<Button asChild variant="outline">
<Link to="/gallery">View gallery</Link>
</Button>

</div>

</section>

<StatsStrip stats={stats} />

{/* OUR STORY */}

<section className="section-padding">

<div className="container-custom max-w-4xl">

<h2 className="text-3xl font-bold mb-4">Our Story</h2>

<p className="text-muted-foreground">
ICE Global began in 2001 as a small production team creating
brand activations in Mumbai. Over the last two decades,
the company has expanded into a full-service expo platform
delivering events across India with integrated stage production,
booth design, digital streaming, and analytics.
</p>

</div>

</section>

{/* TIMELINE */}

<section className="section-padding bg-card/40">

<div className="container-custom">

<h2 className="text-3xl font-bold mb-10 text-center">
Company Milestones
</h2>

<div className="grid md:grid-cols-5 gap-6">

{timeline.map(item=>(
<div key={item.year} className="text-center">

<div className="text-xl font-bold text-primary">
{item.year}
</div>

<p className="text-sm text-muted-foreground">
{item.text}
</p>

</div>
))}

</div>

</div>

</section>

{/* TEAM */}

<section className="section-padding">

<div className="container-custom">

<h2 className="text-3xl font-bold mb-10 text-center">
Our Team
</h2>

<div className="grid grid-cols-2 md:grid-cols-4 gap-8">

{team.map(member=>(
<div key={member.name} className="text-center">

<img
src={member.image}
className="w-[120px] h-[120px] object-cover rounded-full mx-auto mb-4"
/>

<h3 className="font-semibold">{member.name}</h3>

<p className="text-sm text-muted-foreground">
{member.title}
</p>

<a
href={member.linkedin}
target="_blank"
className="text-primary text-sm"
>
LinkedIn
</a>

</div>
))}

</div>

</div>

</section>

{/* CLIENT TESTIMONIALS */}

<section className="section-padding bg-card/40">

<div className="container-custom">

<h2 className="text-3xl font-bold mb-10 text-center">
Client Testimonials
</h2>

<div className="grid md:grid-cols-2 gap-8">

{testimonials.map(t=>(
<div key={t.name} className="border rounded-xl p-6">

<p className="text-muted-foreground mb-4">
"{t.quote}"
</p>

<div className="flex items-center gap-4">

<img
src={t.logo}
className="w-12 h-12 object-contain"
/>

<div>

<div className="font-semibold">
{t.name}
</div>

<div className="text-sm text-muted-foreground">
{t.title} · {t.company}
</div>

</div>

</div>

</div>
))}

</div>

</div>

</section>

{/* RECOGNITION */}

<section className="section-padding">

<div className="container-custom text-center">

<h2 className="text-3xl font-bold mb-8">
Recognition
</h2>

<div className="flex flex-wrap justify-center gap-10">

<img src="/awards/award1.png" className="h-10"/>
<img src="/awards/award2.png" className="h-10"/>
<img src="/awards/award3.png" className="h-10"/>

</div>

</div>

</section>

{/* PROCESS */}

<section className="section-padding bg-card/40">

<div className="container-custom">

<h2 className="text-3xl font-bold mb-10 text-center">
Our Process
</h2>

<div className="grid md:grid-cols-4 gap-6 text-center">

<div>
<h3 className="font-semibold mb-2">Discovery</h3>
<p className="text-sm text-muted-foreground">
Understanding brand goals and audience.
</p>
</div>

<div>
<h3 className="font-semibold mb-2">Experience Design</h3>
<p className="text-sm text-muted-foreground">
Creating stage layouts and interactive zones.
</p>
</div>

<div>
<h3 className="font-semibold mb-2">Production</h3>
<p className="text-sm text-muted-foreground">
Building stages, booths, and installations.
</p>
</div>

<div>
<h3 className="font-semibold mb-2">Measurement</h3>
<p className="text-sm text-muted-foreground">
Tracking engagement, leads, and sentiment.
</p>
</div>

</div>

</div>

</section>

<Footer/>

</main>

  )
}

export default About
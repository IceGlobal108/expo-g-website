# New Home Page Sections

Overview of `src/pages/NewHome.tsx` with what each section shows and the content source.

1) Hero  
   - Components: `FloatingNavbar`, `HeroParallax`, `BackgroundBeams`.  
   - Content: `navItems`, `heroProducts` (expo visuals for parallax hero).

2) What is ICE Exhibitions (Infographics & Photos)  
   - Component: `ReviewMomentsSection`.  
   - Content: `galleryImages` mosaic, CTA to `/gallery`.

3) Brands logo / Trustworthy Leaders  
   - Component: `BrandHighlightsSection`.  
   - Content: `brandHighlights` cards (logos, relationships, categories).

4) Celebrity photos  
   - Component: `CelebritySpotlightSection`.  
   - Content: `celebritySpotlights` (images, roles, quotes, badges).

5) Testimony of sellers  
   - Component: `SellerSignalsSection`.  
   - Content: `sellerTestimonials` (quotes, outcomes, motion tilt cards).

6) Testimony of buyers  
   - Component: `BuyerVoicesSection`.  
   - Content: `buyerTestimonials` (city/segment/spend badges, quotes).

7) 30 Years History / Journey Timeline (Legacy in Motion)  
   - Components: intro block + `StickyScrollReveal`.  
   - Content: `timelineContent` milestones from 1994–2024 with images.

8) Mega Entrance Arches (10 cities, 30 years)  
   - Component: `EntranceArchesSection`.  
   - Content: `entranceArches` cards (city, year, highlight, imagery).

9) 10,000+ brands & seller stalls (Review the moment)  
   - Component: `StallsMosaicSection`.  
   - Content: `galleryImages` parallax grid, stats chips for brands/sellers/buyers, CTA to `/gallery`.

10) 20 million loyal buyers (Review the moment)  
    - Component: `StallsMosaicSection` (second instance).  
    - Content: `galleryImages` parallax grid, stats chips for buyer scale/cities, CTA to `/gallery`.

11) VVIPs at ICE Exhibitions  
    - Component: `VvipSpotlightSection`.  
    - Content: `vvipGuests` (roles, highlights, images).

12) Founders of ICE 1.0 & ICE 2.0  
    - Component: `FoundersSpotlightSection`.  
    - Content: `founders` (Aishwarya, Vijay, Niyathi, Vishnu; era badges, focus, highlights).

13) Co-founding team of ICE 2.0 (IGE & IGN)  
    - Component: `CoFoundersSection`.  
    - Content: `coFounders` (Priyanshi Jha, Sanjay Shah, Rohit Kumar, Ritu Anand; track badges, focus, highlights).

14) Counting section (20M+ buyers | 10,000+ brands | 10 cities | 30 years)  
    - Component: `CountingSection` (wraps `StatsStrip`).  
    - Content: inline stats array.

15) Dual CTAs (Sellers & Buyers)  
    - Component: `DualCtaSection`.  
    - Content: seller CTA -> `/partner` + `/contact`; buyer CTA -> `/sponsor` + `/gallery`.

16) Footer  
    - Component: `Footer`.  
    - Content: Single CTA to partner/sponsor, footer link columns (explore/partners/legal), contact info, social icons.

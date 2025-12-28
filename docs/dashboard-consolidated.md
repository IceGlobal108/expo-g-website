# Dashboard: Consolidated Requirements (MongoDB-backed APIs)

## Purpose
Single admin UI to manage all site content and interactions across Home, Gallery, Gallery Detail, Brand Detail, About, and Contact. Supports content editing, moderation, leads, and publishing controls.

## Roles & Auth
- Roles: `admin`, `editor`, `moderator`, `support`.
  - Admin: full access + settings.
  - Editor: content CRUD (home/about/gallery/brands/stats/nav/footer/pillars/ctas).
  - Moderator: comments moderation.
  - Support: leads/contact inbox.
- Auth: JWT or session cookies with refresh; CSRF protection for cookie sessions; rate limits on admin APIs.
- Audit: store `updatedBy`, `updatedAt` on all content docs; `moderatedBy` on comments; `notes.author` on leads.

## Content Domains & Collections (summary)
- Home/About: `content_blocks`, `timeline_events`, `partners`/`brands` (featured flags), `testimonials`, `stats`, `pillars`, `gallery_highlights`, `nav_links`, `footer_links`.
- Gallery: `gallery_items`, `gallery_sections`, `gallery_comments`, `gallery_likes`, `gallery_previews` (optional curated).
- Brands: `brands`, `brand_highlights`, `brand_metrics`, `brand_ctas` (optional).
- Contact: `contact_cards`, `contacts` (leads).

## Dashboard Navigation
1) Overview
2) Home
3) About
4) Gallery
5) Gallery Comments (Moderation)
6) Brands
7) Stats
8) Navigation & Footer
9) Contact Leads
10) Settings (roles, notifications, webhooks, feature flags)

## Overview Page
- KPIs: visible gallery items, pending comments, new leads, top liked items, featured partners count.
- Recent activity feed (content updates, moderation actions, new leads).
- Quick links to edit key sections (hero, timeline, gallery).

## Home Management
- Hero editor (title/subtitle/body/CTA/media) with preview.
- Timeline manager: list, drag-to-reorder, toggle visibility, edit year/title/description/image.
- Partners: toggle featured for home, reorder.
- Testimonials: CRUD, visibility, order.
- Stats: CRUD, order, visibility.
- Gallery highlights: curated items for preview; order, visibility.
- Nav/footer links: reorder/toggle; footer CTA/copy.

## About Management
- Hero/intro and CTA blocks.
- Pillars/values: CRUD + reorder + visibility.
- Stats selection for About (toggle/order).
- Featured partners for About.
- Optional timeline snippet selection.
- Footer CTA block.

## Gallery Management
- Gallery items table: search/filter (year/category/brand/visibility), inline visibility toggle, order (optional).
- Item editor: title, year, category, brand, excerpt, tags, image, visible, meta fields.
- Sections editor per item: list with drag-to-reorder; heading/body/image; visibility.
- Gallery previews (for home/strips): select items, custom image/title optional, order, visibility.

## Comments Moderation
- Tabs: pending/approved/rejected.
- Filters: by gallery item, date, text search.
- Actions: approve/reject, spam flag, delete.
- Show author/message/date/ip (if stored).
- Bulk approve/reject.

## Brands Management
- Brands list: search/filter by category/relationship/visibility.
- Brand editor: name/slug/relationship/category/summary/hero/og/meta; visible toggle; featured flags.
- Highlights/chapters: reorder + CRUD.
- Metrics: CRUD + order.
- CTAs: optional CRUD.

## Stats Management
- Shared stats CRUD (label/value/suffix/order/visibility).
- Select where stats show (home/about).

## Navigation & Footer
- Nav links: order/edit/visibility.
- Footer links: grouped lists; CRUD + order + visibility.
- Footer CTA/copy blocks.

## Contact Leads
- Inbox: list leads with filters (status/label/date/search).
- Detail view: name/email/company/message, status, labels, notes timeline, assignment.
- Actions: update status, assign to user, add labels, add notes, close/delete.
- Export CSV option.
- Contact content: contact cards CRUD + order; hero/intro/CTA editors.
- Notification settings (email/slack) for new leads (stored in secure config).

## Settings
- Users & roles management.
- API keys/webhooks (notifications).
- Feature flags (e.g., captcha on contact/comments, auto-approve comments).
- Rate limits configuration (exposed to admin only if desired).

## Publishing & Versioning
- Show updatedBy/updatedAt per record.
- Optional draft/publish flags on content_blocks and items (preview mode via token).
- Bulk publish actions for sections (timeline, partners, gallery previews).

## Validation & Guardrails
- Length caps per field (titles, excerpts, bodies).
- Allowed lists for category/brand/relationships; enforce via dropdowns.
- Unique constraints: slugs for gallery/brands; nav/footer ordering uniqueness.
- Image upload validations (size/type); store media in object storage with CDN.

## Caching & Invalidation
- Use in-memory/Redis cache for public aggregate endpoints (`/api/home`, `/api/about`, `/api/gallery`, `/api/brands/:slug`, `/api/gallery/:id`).
- Invalidate/bust cache on related writes.
- Serve ETag/Last-Modified; CDN for public GETs.

## Error Handling
- Consistent error shape: `{ error: { code, message, field? } }`.
- 400 validation, 401/403 auth, 404 missing, 429 rate limit, 500 server.
- Show user-friendly toasts/messages in dashboard; log details server-side.

## Frontend (Dashboard) Tech Notes
- Use the existing design system (shadcn UI) and React Query.
- Implement optimistic updates for reorders; fallback to refetch on failure.
- File uploads via signed URLs; show progress.
- Accessible forms; inline validation errors.


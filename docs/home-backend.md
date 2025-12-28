# Home Page: Backend & Dashboard Specification (MongoDB)

## Scope
Manage all homepage content (hero, journey/timeline, partners, gallery preview sources, testimonials, stats, footer/nav). Provide APIs for the frontend and an admin dashboard for updates.

## Data Model (MongoDB)
- `content_blocks`
  - `_id` (ObjectId), `key` (string, unique), `title`, `subtitle`, `body`, `cta` ({ label, href, variant }), `media` ({ imageUrl, alt, videoUrl }), `updatedAt`, `updatedBy`.
  - Use for hero, section headers, footer copy.
- `timeline_events`
  - `_id`, `year` (string), `title`, `description`, `imageUrl`, `order` (number), `visible` (bool), `updatedAt`, `updatedBy`.
- `partners`
  - `_id`, `name`, `slug`, `relationship`, `category`, `logo`, `imageUrl`, `featured` (bool), `order`, `updatedAt`, `updatedBy`.
- `testimonials`
  - `_id`, `name`, `role`, `company`, `rating` (1–5), `imageUrl`, `visible`, `order`, `updatedAt`, `updatedBy`.
- `stats`
  - `_id`, `label`, `value` (number/string), `suffix`, `order`, `visible`, `updatedAt`, `updatedBy`.
- `gallery_highlights`
  - `_id`, `title`, `imageUrl`, `href`, `order`, `visible`, `updatedAt`, `updatedBy` (optional if preview grid needs curated items).
- `nav_links`
  - `_id`, `label`, `href`, `order`, `visible`, `updatedAt`, `updatedBy`.
- `footer_links`
  - `_id`, `group` (e.g., explore/partners/legal), `label`, `href`, `order`, `visible`, `updatedAt`, `updatedBy`.

## API (REST, JSON)
Public (no auth, cached):
- `GET /api/home`
  - Returns aggregated payload:
    - `hero` (from `content_blocks` key: `home_hero`)
    - `journey` (timeline_events sorted by `order`, visible)
    - `partners` (featured partners)
    - `testimonials` (visible)
    - `stats` (visible)
    - `galleryHighlights` (visible)
    - `nav` (visible nav_links)
    - `footer` (visible footer_links + `content_blocks` keys `footer_cta`, `footer_copy`)
  - Cache: CDN + `Cache-Control: s-maxage=300, stale-while-revalidate=600`.
- `GET /api/timeline` (optional standalone) → timeline_events.
- `GET /api/partners` (optional standalone) → featured partners for home.

Admin (auth required, role: editor/admin):
- `PUT /api/admin/home/hero` (body: content_block fields)
- `PUT /api/admin/home/footer-cta`
- `PUT /api/admin/nav` (reorder/update links)
- CRUD for:
  - `/api/admin/timeline` (GET list, POST create, PUT/PATCH `/:id`, DELETE)
  - `/api/admin/partners` (with `featured` flag)
  - `/api/admin/testimonials`
  - `/api/admin/stats`
  - `/api/admin/gallery-highlights`
  - `/api/admin/footer-links`
- Bulk reorder endpoints (PATCH with ordered IDs array) for timeline, partners, testimonials, stats, nav, footer groups.

## Dashboard UI
Sections:
1) **Overview**
   - Quick stats: count of visible timeline events, featured partners, testimonials, stats entries.
   - Preview card showing current hero content.
2) **Hero Editor**
   - Fields: title, subtitle, body, CTA label/href/variant, media upload/URL.
   - Live preview pane.
3) **Journey / Timeline**
   - List with drag-to-reorder; inline toggle for visible.
   - Form: year, title, description, image upload/url.
4) **Partners (Home Feature)**
   - Table: name, relationship, category, featured toggle, order.
   - Form for add/edit with image upload/logo mark.
5) **Testimonials**
   - Table + modal: name, role, company, rating, image, visible toggle, order.
6) **Stats**
   - Simple grid editor: label, value, suffix, visible toggle, order.
7) **Gallery Highlights**
   - Curated items for the home preview: title, image, href (to gallery/detail), visible toggle, order.
8) **Navigation & Footer**
   - Nav links reorder/toggle; footer grouped links CRUD.
   - Footer CTA/copy editor (content_block keys).
9) **Publishing & Versioning**
   - Show last updated timestamp/user per section.
   - Optional “draft/publish” status per block with preview token support.

## Content Management Notes
- Normalize all texts in `content_blocks` where possible; avoid hardcoding on frontend.
- Support draft/published flags if staging is needed; otherwise, guard with `visible`.
- Provide preview mode via `?preview=token` to fetch drafts.
- Media: upload to storage (S3-like) and store URL; generate responsive variants.

## Validation & Rules
- Length limits: titles ≤ 120 chars; subtitles ≤ 240; body ≤ 800 for hero.
- Timeline years: string to allow ranges (e.g., "2024", "2015–2018").
- Orders must be unique per collection; enforce via server-side reindex on reorder.
- Visible items only returned in public endpoints.

## Caching & Performance
- Aggregate home payload to reduce frontend calls.
- In-memory cache/Redis for `/api/home` with bust on updates.
- ETag/Last-Modified headers; CDN caching for public endpoints.

## Auth & Roles
- Admin/editor JWT or session; role checks on admin routes.
- Audit: store `updatedBy`, `updatedAt` on all documents.

## Error Handling
- 400 for validation errors; 401/403 for auth; 404 for missing docs; 500 for server errors.
- Return structured errors `{ error: { code, message, field? } }`.

## Frontend Integration
- Replace static imports in `src/data/expo-data.ts`/`Index.tsx` with React Query fetch to `/api/home`.
- Keep skeletons/loading states for hero, timeline, partners, testimonials, stats.
- Add stale-while-revalidate on client (React Query `staleTime`/`cacheTime`) aligned with API cache.


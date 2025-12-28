# Backend & Dashboard Plan

## Frontend Snapshot (what’s live now)
- Stack: Vite + React + TypeScript + Tailwind + shadcn + framer-motion.
- Routes: `/` (hero, journey/timeline, partners, gallery preview, testimonials, stats), `/gallery` (filters + masonry grid), `/gallery/:id` (story/article, likes/comments in localStorage), `/brands/:slug` (brand story), `/about`, `/contact`, and 404.
- Data: All gallery items, brand stories, timeline, stats are static JSON (`src/data`). Likes/comments are ephemeral (localStorage). Contact form just alerts; no backend calls. Images are local assets.

## Backend Objectives
1) Persist content and interactions (gallery, brands, timeline, stats, comments, likes).  
2) Provide API for frontend + dashboard with auth and rate limiting.  
3) Handle media (upload, optimization, CDN).  
4) Capture contact form submissions and notify ops.  
5) Expose metrics for dashboard.

## Proposed Data Model (SQL-friendly)
- `gallery_items`: id (uuid/slug), title, year, category, brand, image_url, excerpt, body (rich), tags[], likes_count, created_at, updated_at.
- `gallery_sections`: id, gallery_id (fk), heading, body, order_index (for multi-section articles).
- `gallery_comments`: id, gallery_id (fk), author_name, message, created_at, status (pending/approved/rejected).
- `brands`: id (slug), name, relationship, category, logo_mark (text/url), hero_image_url, summary.
- `brand_highlights`: id, brand_id (fk), title, body, order_index.
- `brand_metrics`: id, brand_id (fk), label, value, order_index.
- `timeline_events`: id, year, title, description, image_url, order_index.
- `stats`: id, label, value, suffix.
- `contacts`: id, name, email, company, message, created_at, status (new/in-progress/closed), source (web).
- `users`: id, email, name, role (admin/editor/moderator), password_hash or oauth_id, created_at.
- `likes`: id, user_id (nullable), gallery_id (fk), created_at (for deduping + audit).

## API Sketch
- `GET /api/gallery?year=&category=&q=&page=&pageSize=` → list with filters, paginated.
- `GET /api/gallery/:id` → item + sections + approved comments + like count.
- `POST /api/gallery/:id/comments` → create comment (rate-limited; captcha or auth).  
- `POST /api/gallery/:id/like` → register/undo like (cookie/session or token to prevent spam).
- `GET /api/brands` / `GET /api/brands/:slug` → brand story, highlights, metrics.
- `GET /api/timeline` → ordered events.
- `GET /api/stats` → headline stats.
- `POST /api/contact` → store lead + notify (email/slack).
- Auth: `POST /api/auth/login`, `POST /api/auth/refresh`, `POST /api/auth/logout`.
- Admin CRUD (authz: admin/editor):
  - `POST/PUT/DELETE /api/admin/gallery`
  - `POST/PUT/DELETE /api/admin/brands`
  - `POST/PUT/DELETE /api/admin/timeline`
  - `POST/PUT/DELETE /api/admin/stats`
  - `GET/PUT /api/admin/comments/:id` (moderate)
  - `GET/PUT /api/admin/contacts/:id` (status)
- Consider `GET /api/analytics/gallery/:id` for per-asset metrics.

## AuthN/AuthZ
- JWT or session cookies with refresh tokens; roles: admin, editor, moderator, viewer.
- Optional SSO (OAuth/Google) for dashboard.
- CSRF protection for cookie-based auth; rate limits on unauthenticated endpoints.

## Media Handling
- Store images in object storage (S3/compatible) with CDN; generate responsive sizes (thumb/medium/full) + webp/avif.
- Return signed upload URLs for admin/dashboard when adding gallery items/brands.

## Contact & Notifications
- `POST /api/contact` stores row in `contacts`; send email/slack webhook to ops.
- Dashboard should surface new leads with status updates and notes.

## Dashboard Requirements
- Auth-gated single-page app (can share design system with frontend).
- Views:
  - **Overview**: KPIs (new leads, comments awaiting moderation, top gallery items by likes/views).
  - **Gallery Manager**: CRUD items/sections, upload images, reorder sections, set year/category/tags.
  - **Comments Moderation**: approve/reject, ban IP/user if needed.
  - **Brands**: edit story highlights, metrics, hero images.
  - **Timeline/Stats**: reorder events; edit headline stats.
  - **Leads**: list/filter contact submissions; change status; export CSV.
  - **Settings**: roles, API keys, rate limits, webhooks.
- Instrumentation: track page views, likes, comment volume, lead conversions; display charts over time.

## Frontend Integration Notes
- Replace static imports with API calls (React Query ready). Add loading/empty states.
- Comments/likes should call backend; remove localStorage persistence once API is live.
- Contact form: POST to `/api/contact`; show toast on success/error.
- Add env config: `VITE_API_BASE_URL`, `VITE_CDN_BASE_URL`.
- Keep types in `src/types` shared with backend schema or generated from OpenAPI/TS types.
- Global content management: expose CRUD in dashboard for hero copy, homepage section headings/subcopy, footer links, and nav items; serve a `/api/content` payload (versioned) so the app can hydrate those strings without redeploys.

## Ops & Deployment (suggested)
- Stack: Node/Nest/Express + Postgres + S3-compatible storage + Redis (caching/rate-limit/queues).
- Migrations: Prisma/Knex/Flyway; seed initial timeline/brands/stats.
- Background jobs: image processing, notification fan-out, abuse checks.
- Monitoring: logs, uptime, error tracking (Sentry), metrics (likes/comments/lead rate).

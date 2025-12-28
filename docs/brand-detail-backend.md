# Brand Detail Page: Backend & Dashboard Specification (MongoDB)

## Scope
Serve brand partner stories at `/brands/:slug` with hero, highlights/chapters, metrics, and CTA. Enable admin editing and optional SEO fields.

## Data Model (MongoDB)
- `brands`
  - `_id` (ObjectId), `slug` (unique), `name`, `relationship`, `category`, `logoMark` (text/url), `heroImageUrl`, `summary`, `metaTitle`, `metaDescription`, `ogImageUrl`, `visible` (bool), `createdAt`, `updatedAt`, `updatedBy`.
- `brand_highlights`
  - `_id`, `brandId`, `title`, `body`, `order`, `visible`, `imageUrl` (optional), `updatedAt`, `updatedBy`.
- `brand_metrics`
  - `_id`, `brandId`, `label`, `value`, `order`, `visible`, `updatedAt`, `updatedBy`.
- `brand_ctas` (optional, or reuse content_blocks)
  - `_id`, `brandId`, `label`, `href`, `variant`, `visible`.
- `partners` (if separate from brands for lists)
  - Can reuse `brands` for listing; set `featured` flags for other pages.

## Public API
- `GET /api/brands/:slug`
  - Returns `{ brand, highlights, metrics, ctas }` (visible only).
  - 404 if not visible or missing.
- `GET /api/brands` (optional)
  - For lists, can include `featured` filter for home/About.

## Admin API (auth: editor/admin)
- Brand CRUD:
  - `GET /api/admin/brands/:id`
  - `POST /api/admin/brands` (create)
  - `PUT/PATCH /api/admin/brands/:id` (name, slug, relationship, category, heroImageUrl, summary, meta fields, visible)
  - `DELETE /api/admin/brands/:id`
- Highlights:
  - `POST /api/admin/brands/:id/highlights`
  - `PUT/PATCH /api/admin/brands/:id/highlights/:hid`
  - `DELETE /api/admin/brands/:id/highlights/:hid`
  - Reorder (PATCH with ordered IDs)
- Metrics:
  - `POST /api/admin/brands/:id/metrics`
  - `PUT/PATCH /api/admin/brands/:id/metrics/:mid`
  - `DELETE /api/admin/brands/:id/metrics/:mid`
  - Reorder (PATCH with ordered IDs)
- CTAs (optional):
  - `POST/PUT/DELETE /api/admin/brands/:id/ctas`
- Flags for other pages:
  - `PUT /api/admin/brands/:id/featured` (for home/About lists)

## Dashboard UI
- **Brand List**
  - Table with search/filter by category/relationship/visibility.
  - Actions: edit, toggle visible, set featured.
- **Brand Editor**
  - Fields: name, slug, relationship, category, summary, hero image, logo mark, visible toggle, meta (title/description/og).
  - Preview pane for hero.
- **Highlights/Chapters**
  - List with drag-to-reorder.
  - Fields: title, body, optional image, visible toggle.
- **Metrics**
  - Grid editor: label, value, order, visible.
- **CTAs**
  - Optional CTA editor: label, href, variant, visible.
- **Publishing**
  - Show updatedBy/updatedAt; optional draft/publish state.

## Content Management Notes
- Ensure unique slug for SEO-friendly URLs.
- Support draft/visible flags; only visible returned publicly.
- Meta fields optional; auto-fallback to name/summary/hero image if missing.

## Validation Rules
- Name ≤ 120 chars; summary ≤ 300; highlight body ≤ 800 recommended.
- Metrics values as string to allow units; limit count (e.g., max 8).
- Enforce unique slug; category/relationship from allowed list.

## Caching & Performance
- Cache `GET /api/brands/:slug` with short TTL; bust on updates.
- CDN for images; ETag/Last-Modified.
- Indexes: `slug` unique; `brand_highlights.brandId+order`; `brand_metrics.brandId+order`.

## Auth & Roles
- Admin/editor for content; audit `updatedBy`.

## Error Handling
- Standard errors `{ error: { code, message, field? } }`; 400/401/403/404/429/500.

## Frontend Integration
- Replace static brand story data with `GET /api/brands/:slug`.
- Render highlights/metrics in order; handle loading/empty/error states.
- Use React Query with aligned cache/stale times to API caching.

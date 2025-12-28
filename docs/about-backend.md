# About Page: Backend & Dashboard Specification (MongoDB)

## Scope
Manage About page content: hero copy, pillars/values, stats, partner highlights (subset), timeline/heritage references, and CTA blocks. Provide APIs and dashboard editing.

## Data Model (MongoDB)
- `content_blocks`
  - Reuse from home; keys for About: `about_hero`, `about_intro`, `about_cta_primary`, `about_cta_secondary`, `about_footer_cta`.
  - Fields: `key`, `title`, `subtitle`, `body`, `cta` ({ label, href, variant }), `media` ({ imageUrl, alt, videoUrl }), `updatedAt`, `updatedBy`.
- `pillars`
  - `_id`, `page` (`about`), `title`, `body`, `icon` (optional), `order`, `visible`, `updatedAt`, `updatedBy`.
- `stats`
  - `_id`, `label`, `value`, `suffix`, `order`, `visible`, `updatedAt`, `updatedBy`. (Shared with home; filter by `visible`.)
- `partners` (reuse collection)
  - Use existing; filter featured subset for About.
- `timeline_events` (reuse)
  - Optionally surface a short list on About (heritage block).

## Public API
- `GET /api/about`
  - Returns:
    - `hero` (content_block key: `about_hero`)
    - `intro` (content_block key: `about_intro`)
    - `pillars` (visible, ordered)
    - `stats` (visible)
    - `partners` (featured subset for About, e.g., top 4)
    - `ctaBlocks` (content_block keys: `about_cta_primary`, `about_cta_secondary`)
    - Optional `timeline` (subset of `timeline_events`)
  - Cache: `s-maxage=300, stale-while-revalidate=600`.

## Admin API (auth: editor/admin)
- Content blocks:
  - `PUT /api/admin/content/about/hero`
  - `PUT /api/admin/content/about/intro`
  - `PUT /api/admin/content/about/cta-primary`
  - `PUT /api/admin/content/about/cta-secondary`
  - `PUT /api/admin/content/about/footer-cta` (if present)
- Pillars:
  - `GET /api/admin/pillars?page=about`
  - `POST /api/admin/pillars` (body includes `page: "about"`)
  - `PUT/PATCH /api/admin/pillars/:id`
  - `DELETE /api/admin/pillars/:id`
  - Reorder (PATCH with ordered ids)
- Stats: reuse stats admin endpoints; allow visibility toggles and order.
- Partners: reuse partners admin; add `featuredAbout` flag or order for About subset.
- Timeline (optional): reuse timeline admin; allow selecting subset for About via flag (e.g., `featuredAbout`).

## Dashboard UI
- **Overview**
  - Snapshot of About hero text and count of visible pillars/stats/partners featured.
- **Hero & Intro Editor**
  - Fields: title, subtitle, body, media (image/video), CTA label/href.
  - Preview pane.
- **Pillars/Values**
  - List with drag-to-reorder; toggles for visible.
  - Form: title, body, optional icon, order.
- **Stats**
  - Select which stats show on About; reorder.
- **Partners (About feature)**
  - Choose subset (checkbox/featured flag) and order for display.
- **Timeline snippet (optional)**
  - Pick top N events, reorder; or auto-use first N from main timeline.
- **CTA Blocks**
  - Edit primary/secondary CTA text/links and a closing CTA/footer block.
- **Publishing/Versioning**
  - Show updatedBy/updatedAt; optional draft/publish mode.

## Content Management Notes
- Store About text in `content_blocks` to avoid frontend hardcoding.
- Use `visible` and optional `featuredAbout` flags to control what appears.
- Support preview mode for drafts via token query.

## Validation Rules
- Hero title ≤ 120 chars; subtitle ≤ 240; pillar body ≤ 400.
- Limit pillars to a reasonable count (e.g., max 6).
- CTA hrefs validated as absolute or internal paths.

## Caching & Performance
- Aggregate `/api/about` response; cache in memory/Redis and CDN.
- Bust cache on any About-related updates.

## Auth & Roles
- Admin/editor access for content edits; audit `updatedBy`.

## Frontend Integration Notes
- Replace hardcoded About content with `/api/about` response.
- Use React Query with sensible stale time aligned to API cache.
- Show loading/skeletons for hero, pillars, stats, partners.

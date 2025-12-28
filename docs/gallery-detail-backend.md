# Gallery Detail Page: Backend & Dashboard Specification (MongoDB)

## Scope
Serve detailed gallery entries at `/gallery/:id` with multi-section stories, likes, comments, SEO meta, and engagement metrics. Provide admin tools for content editing, moderation, and analytics.

## Data Model (MongoDB)
- `gallery_items`
  - `_id` (ObjectId or slug), `title`, `year`, `category`, `brand`, `imageUrl`, `excerpt`, `tags` (array), `likes` (number), `visible` (bool), `metaTitle`, `metaDescription`, `ogImageUrl`, `createdAt`, `updatedAt`, `updatedBy`.
- `gallery_sections`
  - `_id`, `galleryId`, `heading`, `body`, `imageUrl` (optional), `order`, `visible`, `updatedAt`, `updatedBy`.
- `gallery_comments`
  - `_id`, `galleryId`, `authorName`, `message`, `createdAt`, `status` (`pending` | `approved` | `rejected`), `sourceIp` (optional), `userId` (optional), `spamFlag` (bool), `moderatedBy`, `moderatedAt`.
- `gallery_likes`
  - `_id`, `galleryId`, `userId` (nullable), `fingerprint` (hash of IP+UA/cookie), `createdAt`.
- `gallery_views` (optional, or derive from analytics)
  - `_id`, `galleryId`, `count`, `lastViewedAt`.

## Public API
- `GET /api/gallery/:id`
  - Returns `{ item, sections, likes, comments: approvedOnly }`.
  - If not visible, return 404.
- `POST /api/gallery/:id/comments`
  - Body: `{ authorName, message }`.
  - Validation: required name/message; length caps; rate limit; optional captcha.
  - Status: if auto-approve off, create as `pending`.
- `POST /api/gallery/:id/like`
  - Add/toggle like; de-dupe via user/fingerprint; returns `{ likes, liked }`.
- `GET /api/gallery/:id/meta`
  - Optional endpoint for SEO/meta data (or include in main response).

## Admin API (auth: editor/admin/moderator)
- Item CRUD (reuse gallery admin from listing):
  - `GET /api/admin/gallery/:id`
  - `PUT/PATCH /api/admin/gallery/:id` (title, year, category, brand, imageUrl, excerpt, tags, meta fields, visible)
- Sections CRUD:
  - `POST /api/admin/gallery/:id/sections`
  - `PUT/PATCH /api/admin/gallery/:id/sections/:sectionId`
  - `DELETE /api/admin/gallery/:id/sections/:sectionId`
  - Reorder sections (PATCH with ordered IDs).
- Comments moderation:
  - `GET /api/admin/gallery/:id/comments?status=pending|approved|rejected`
  - `PUT /api/admin/gallery/:id/comments/:commentId` (update status, add moderator info)
  - `DELETE /api/admin/gallery/:id/comments/:commentId`
- Likes audit (optional):
  - `GET /api/admin/gallery/:id/likes` (for anomaly checks)
- Analytics (optional):
  - `GET /api/admin/gallery/:id/metrics` (likes/comments/views over time)

## Dashboard UI
- **Detail Editor**
  - Fields: title, year, category, brand, excerpt, tags, main image, visible toggle, meta (title/description/og image).
  - Preview pane for hero.
- **Story Sections**
  - List with drag-to-reorder; per-section edit modal/drawer.
  - Fields: heading, body, optional image, visible toggle.
- **Comments Moderation**
  - Tabs: pending/approved/rejected; approve/reject; view author/message/date/IP (if captured); spam flag.
- **Engagement**
  - Likes count; comments count; (optional) views chart if tracked.
- **SEO**
  - Meta title/description/og image upload.
- **Publishing**
  - Visible toggle; show updatedBy/updatedAt; optional draft/publish.

## Content Management Notes
- Ensure slug/ID stability for SEO-friendly URLs.
- Provide per-section anchors (front end) for deep linking; ensure sections have stable IDs/orders.
- Auto-generate meta if not provided (fallback to title/excerpt and main image).

## Validation Rules
- Title ≤ 140 chars; excerpt ≤ 240; body ≤ 1200 recommended per section.
- Tags ≤ 10; tag length ≤ 30.
- Comments: max length (e.g., 500), rate limit per IP/user.
- Likes: dedupe per user/fingerprint; cap rapid re-likes.

## Caching & Performance
- Cache `GET /api/gallery/:id` with short TTL; bust on updates.
- ETag/Last-Modified; CDN for images.
- Indexes: `gallery_items.slug`, `gallery_sections.galleryId+order`, `gallery_comments.galleryId+status+createdAt`.

## Auth & Roles
- Admin/editor for content; moderator for comments.
- Audit: `updatedBy` on items/sections; `moderatedBy` on comments; timestamps.

## Error Handling
- Standardized errors `{ error: { code, message, field? } }`.
- 400 validation, 401/403 auth, 404 missing, 429 rate limit, 500 server.

## Frontend Integration
- Replace static detail data with `GET /api/gallery/:id`.
- Use React Query; handle loading/empty/error states.
- Likes/comments: call API; optimistic updates; handle rate-limit errors gracefully.
- Sections: render in order returned; show per-section share anchors as now.

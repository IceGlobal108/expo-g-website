# Gallery & Detail Pages: Backend & Dashboard Specification (MongoDB)

## Scope
Power gallery listing (`/gallery`) and detail (`/gallery/:id`) with persisted images, stories/sections, filters, likes, comments, and curated preview. Provide admin/dashboard for content + moderation.

## Data Model (MongoDB)
- `gallery_items`
  - `_id` (ObjectId or slug), `title`, `year` (string), `category`, `brand`, `imageUrl`, `excerpt`, `tags` (array), `likes` (number, default 0), `visible` (bool), `order` (optional for curated lists), `createdAt`, `updatedAt`, `updatedBy`.
- `gallery_sections`
  - `_id`, `galleryId` (ObjectId), `heading`, `body`, `order` (number), `imageUrl` (optional), `visible` (bool).
- `gallery_comments`
  - `_id`, `galleryId`, `authorName`, `message`, `createdAt`, `status` (`pending` | `approved` | `rejected`), `sourceIp` (optional), `userId` (optional if authenticated), `spamFlag` (bool).
- `gallery_likes`
  - `_id`, `galleryId`, `userId` (nullable), `fingerprint` (hash of IP+UA/cookie), `createdAt`. (Used to de-dupe likes and prevent spam.)
- `gallery_filters` (optional if you want dynamic filter options)
  - `_id`, `type` (`year` | `category` | `brand`), `value`, `label`, `order`, `visible`.
- `gallery_previews`
  - `_id`, `galleryId` (ref), `imageOverride` (optional), `order`, `visible` (for home/preview carousels).

## Public API (REST, JSON)
- `GET /api/gallery`
  - Query params: `year`, `category`, `brand`, `q` (search title/brand/tags), `page` (default 1), `pageSize` (default 24).
  - Returns paginated items `{ items, total, page, pageSize, filters: { years, categories, brands } }`.
- `GET /api/gallery/:id`
  - Returns `{ item, sections, comments (approved), likes }`.
- `POST /api/gallery/:id/comments`
  - Body: `{ authorName, message }`. Rate-limited. Optionally require captcha. Returns pending/approved comment based on moderation mode.
- `POST /api/gallery/:id/like`
  - Toggle/add like. Use cookie/session or fingerprint to prevent duplicates; return `{ likes, liked: true/false }`.
- `GET /api/gallery/previews` (optional)
  - Curated items for home/preview strips.

## Admin API (auth required, role: editor/admin/moderator)
- Items CRUD:
  - `GET /api/admin/gallery`
  - `POST /api/admin/gallery` (create item)
  - `PUT/PATCH /api/admin/gallery/:id`
  - `DELETE /api/admin/gallery/:id`
  - Bulk reorder endpoint (PATCH with ordered ids) if using `order`.
- Sections CRUD:
  - `POST /api/admin/gallery/:id/sections`
  - `PUT/PATCH /api/admin/gallery/:id/sections/:sectionId`
  - `DELETE /api/admin/gallery/:id/sections/:sectionId`
  - Reorder sections (PATCH with ordered section ids).
- Comments moderation:
  - `GET /api/admin/gallery/:id/comments?status=pending|approved|rejected`
  - `PUT /api/admin/gallery/:id/comments/:commentId` (update status, optional note)
  - `DELETE /api/admin/gallery/:id/comments/:commentId`
- Likes admin (optional):
  - `GET /api/admin/gallery/:id/likes` (for audits)
- Filters/Previews:
  - `PUT /api/admin/gallery/filters` (manage allowed filters if not derived from data)
  - `POST/PUT/DELETE /api/admin/gallery/previews/:id`

## Dashboard UI
- **Overview**
  - KPIs: total items, visible items, pending comments, likes this week.
  - Top items by likes/comments/views.
- **Gallery Manager**
  - Table/list with search and filters (year/category/brand/visibility).
  - Inline toggle visible; reorder (if curated order used).
  - New/Edit drawer: title, year, category, brand, image upload, excerpt, tags, visible toggle, order.
- **Story/Sections Editor**
  - Per-item view: list of sections with drag-to-reorder.
  - Section fields: heading, body, optional image, visible toggle.
- **Comments Moderation**
  - Filter by status; approve/reject; view message, author, date.
  - Bulk approve/reject; spam flag.
- **Likes/Engagement (optional)**
  - Read-only list of like counts; anomaly detection flag (sudden spikes).
- **Preview Curation**
  - Choose items for home/gallery preview strips; set custom image/title if needed; reorder; visible toggle.
- **Filters Management** (if not derived dynamically)
  - Manage allowed categories/brands/years labels and order for UI chips.
- **Publishing/Versioning**
  - Show updatedBy/updatedAt per item and section; draft/publish optional.

## Content Management Notes
- Derive filters from data or manage via `gallery_filters` for controlled vocab.
- Enforce uniqueness on slug/id for SEO-friendly detail URLs.
- If SEO matters, store `metaTitle`, `metaDescription`, `ogImage` per item.

## Validation Rules
- Title ≤ 140 chars; excerpt ≤ 240; section body recommended ≤ 1200.
- Year as string to allow ranges; category/brand from allowed list.
- Comments: max length (e.g., 500 chars); rate limit per IP/user.
- Likes: de-dupe per user/fingerprint within a window.

## Caching & Performance
- Cache `GET /api/gallery` + `GET /api/gallery/:id` with short TTL and bust on writes.
- ETag/Last-Modified; CDN for images.
- Consider search indexes on `title`, `brand`, `tags`, `year`, `category`.

## Auth & Roles
- Admin/editor: CRUD items/sections.
- Moderator: comments moderation only.
- Audit: store `updatedBy`, `updatedAt` on items/sections; `moderatedBy` on comments.

## Error Handling
- Structured errors `{ error: { code, message, field? } }`.
- 400 validation, 401/403 auth, 404 missing, 429 rate limit, 500 server.

## Frontend Integration Notes
- `/gallery`: fetch `GET /api/gallery` with filters; show counts, loading states, empty states; use React Query with pagination/infinite scroll.
- Detail: `GET /api/gallery/:id` for item + sections + approved comments + likes.
- Likes/comments: replace localStorage with API calls; show optimistic UI; handle rate limit errors gracefully.
- Filters: use API-provided filters to render chips (years/categories/brands).


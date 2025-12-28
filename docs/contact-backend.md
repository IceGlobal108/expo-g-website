# Contact Page: Backend & Dashboard Specification (MongoDB)

## Scope
Power contact form submissions, contact info blocks, and CTA content. Provide admin tools for lead management and content updates.

## Data Model (MongoDB)
- `content_blocks`
  - Keys for contact page: `contact_hero`, `contact_intro`, `contact_cta_primary`, `contact_cta_secondary`, `contact_footer_cta`.
  - Fields: `key`, `title`, `subtitle`, `body`, `cta` ({ label, href, variant }), `media`, `updatedAt`, `updatedBy`.
- `contact_cards`
  - `_id`, `title` (e.g., Email/Phone/Studio/Turnaround), `value`, `hint`, `icon` (optional), `order`, `visible`, `updatedAt`, `updatedBy`.
- `contacts` (leads)
  - `_id`, `name`, `email`, `company`, `message`, `status` (`new` | `in_progress` | `closed`), `source` (`web`), `createdAt`, `updatedAt`, `notes` (array of { text, author, createdAt }), `labels` (array), `assignedTo` (userId), `ip` (optional).
- `users` (for dashboard auth)
  - Reuse existing users collection with roles.

## Public API
- `GET /api/contact-content`
  - Returns hero/intro/CTA blocks and visible contact_cards.
  - Cache: short TTL (content).
- `POST /api/contact`
  - Body: `{ name, email, company?, message }`.
  - Validation: required name/email/message; email format; message length cap.
  - Rate limit per IP/user; optional captcha.
  - Side effects: store in `contacts`, send notification (email/slack).
  - Response: `{ id, status: "new" }` or a generic success message.

## Admin API (auth: editor/admin/support)
- Content:
  - `PUT /api/admin/content/contact/hero`
  - `PUT /api/admin/content/contact/intro`
  - `PUT /api/admin/content/contact/cta-primary`
  - `PUT /api/admin/content/contact/cta-secondary`
  - `PUT /api/admin/contact-cards` (bulk update/reorder)
- Leads:
  - `GET /api/admin/contacts?status=&q=&label=&page=&pageSize=`
  - `GET /api/admin/contacts/:id`
  - `PUT /api/admin/contacts/:id` (update status, assign, add labels)
  - `POST /api/admin/contacts/:id/notes`
  - `DELETE /api/admin/contacts/:id` (soft delete or mark closed)
- Export:
  - `GET /api/admin/contacts/export?format=csv` (optional)

## Dashboard UI
- **Overview**
  - Cards: new leads this week, open leads, avg response time (if tracked).
  - Recent submissions feed.
- **Lead Inbox**
  - Table with filters (status/label/search/date).
  - Detail drawer: name, email, company, message, timeline of notes/status changes.
  - Actions: change status, assign to team member, add labels, add note.
  - Bulk actions: close, label, assign.
- **Contact Content**
  - Hero/intro/CTA editors with preview.
  - Contact cards manager: reorder, edit title/value/hint, toggle visible.
- **Notifications**
  - Toggle which channels to notify (email/slack webhook); store config in secure settings (not in Mongo).
- **Publishing/Versioning**
  - Show updatedBy/updatedAt for content; optional draft/publish.

## Validation & Security
- Rate limit `POST /api/contact` (e.g., 5/min/IP).
- Validate email format; message length (e.g., max 1000 chars).
- Captcha if spam risk.
- Sanitize inputs to prevent injection; store IP for abuse checks (optional, privacy aware).

## Caching
- Cache `GET /api/contact-content` with short TTL; bust on updates.
- No caching for POST submissions.

## Auth & Roles
- Admin/editor for content; support/ops for leads.
- Audit: store `updatedBy` on content; `notes.author` for lead notes.

## Frontend Integration
- Fetch `/api/contact-content` to hydrate hero, cards, CTAs.
- Submit form to `POST /api/contact`; show success/error toasts; disable form while submitting.
- Replace alert-based submission with API call; optionally add captcha flow.

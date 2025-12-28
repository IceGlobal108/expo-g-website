# Section Workflow Guide

When you provide a section to build or edit (e.g., Hero, Gallery, Testimonials), here’s how we’ll handle it end-to-end.

1) Confirm scope
- Clarify what content fields are needed (copy, images, links, badges, metrics).
- Identify where it lives: frontend component(s), admin editor, backend API/storage.

2) Backend (API + storage)
- Add/extend a route to fetch/update the section data (e.g., `/hero`, `/sections/:id`).
- Validate payloads (Zod) and persist in MongoDB (collections per section type).
- Protect writes with auth; support “restore defaults” via a seed or reset endpoint.
- Add seed script if defaults are required (npm run seed:<section>).

3) Frontend (display)
- Pull section data from the API with fallbacks for local data if needed.
- Render using existing components/styles; add props for dynamic content.
- Keep UX consistent (loading/fallback states minimal).

4) Admin (CMS)
- Add or extend the admin dashboard with tabs/cards for the section.
- Allow create/edit/delete for items; include preview where useful.
- Handle auth: use access token; auto-refresh on 401 via refresh token and retry.
- Provide “restore defaults” if the backend supports it.

5) Persistence & refresh flow
- Frontend/admin uses `VITE_API_BASE_URL` to reach the backend.
- On 401, try `/auth/refresh` with stored refresh token, retry the original action.
- If refresh fails, clear tokens and redirect to `/admin/login`.

6) Testing & verification
- Hit the API directly (e.g., curl/postman) to verify responses.
- Check the frontend/admin for correct rendering, edits, and save/restore flows.
- Ensure Mongo writes/updates occur and no hardcoded values remain.

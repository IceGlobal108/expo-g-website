# ICE Backend (Fastify + MongoDB + Redis + BullMQ)

## Prereqs
- Node.js >= 18
- MongoDB & Redis (use `docker-compose up -d` in this folder for local)
- Copy env: `cp .env.example .env` and fill values.

## Install & Run
```bash
cd backend
npm install         # if slow, try: npm install --prefer-offline
npm run dev         # starts Fastify on PORT (default 4000)
```

Health:
- `GET /health` and `GET /ready`

## Structure
- `src/app.ts` — Fastify bootstrap (plugins, JWT, routes)
- `src/server.ts` — entrypoint
- `src/config/env.ts` — env loader (fails on missing vars)
- `src/db/mongo.ts`, `src/db/redis.ts` — connections
- `src/plugins/*` — core plugins (cors, helmet, rate-limit, jwt)
- `src/modules/*` — route modules (auth, sections, gallery, metrics, health)
- `src/jobs/*` — BullMQ queues and worker stubs (email, image-processing, cache-warm)

## Jobs & Media
- BullMQ queues defined in `src/jobs/queues.ts`; wire workers in `src/jobs/workers/*`.
- Sharp is installed for image processing (resize/compress) inside image jobs.
- Email sends should be queued via `emailQueue` and processed in a worker (plug your provider in the worker).

## Next Steps
- Implement real auth (register/login/refresh/logout) with JWT + Redis blacklist.
- Flesh out sections/gallery routes to persist to Mongo; add validation with Zod.
- Add Swagger docs (`@fastify/swagger` is installed) with schemas.
- Write workers for email and image processing.
- Add tests (Vitest/supertest) for modules.

## Media Upload API (new)
- Env: `MEDIA_BASE_URL` (public base URL), optional `MEDIA_STORAGE_PATH` (default `storage/media`), `MEDIA_MAX_SIZE_MB` (default 10), `MEDIA_ALLOWED_TYPES`, `MEDIA_WEBP_QUALITY`, `MEDIA_THUMB_WIDTH`, `MEDIA_THUMB_HEIGHT`, `MEDIA_KEEP_ORIGINAL`.
- Routes:
  - `POST /media/upload` (auth): multipart `file` plus optional `config` JSON for variants. Generates WebP + thumbnail variants by default and returns URLs as `MEDIA_BASE_URL/<date>/<name>`.
  - `GET /media` (auth): search/list with pagination and status filter.
  - `DELETE /media/:id` (auth): marks media pending delete and enqueues physical deletion via BullMQ worker.
- Worker: `media-delete` queue deletes files from disk and marks Mongo doc as `deleted`.

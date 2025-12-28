# Backend Plan (Fastify + MongoDB + Redis)

## Tech Stack
- **Runtime:** Node.js (>=18), TypeScript
- **Framework:** Fastify (lightweight, pluggable)
- **Database:** MongoDB (collections for content, users, sessions, analytics)
- **Cache/Queue:** Redis (caching, rate limits, ephemeral tokens) + BullMQ for background job queues
- **Auth:** JWT (access/refresh) with optional email/OTP; session blacklist in Redis
- **Validation:** Zod or TypeBox with Fastify schemas
- **Env:** dotenv / node-config; secrets via process env
- **Tooling:** pnpm or npm, ESLint/Prettier, Vitest for unit tests, supertest for HTTP
- **Media:** Sharp for image processing (resize, compress, generate responsive variants)
- **Email:** provider via nodemailer/Resend/Mailgun; job-driven sends through BullMQ

## Folder Structure
```
/backend
  /src
    /app.ts                # Fastify server bootstrap
    /config                # env parsing, config defaults
    /plugins               # Fastify plugins (swagger, cors, helmet, rate-limit, jwt)
    /db
      /mongo.ts            # Mongo client + connection helper
      /redis.ts            # Redis client + connection helper
      /models              # Mongo schemas/models (e.g., User, Section, GalleryItem)
    /modules
      /auth
        /routes.ts         # /auth endpoints (login/register/refresh/logout)
        /service.ts        # business logic
        /schema.ts         # request/response validation
        /types.ts
      /sections
        /routes.ts         # CRUD for sections/content blocks
        /service.ts
        /schema.ts
      /gallery
        /routes.ts         # gallery items, comments, likes
        /service.ts
        /schema.ts
      /metrics
        /routes.ts         # stats endpoints (counts, timelines)
        /service.ts
      /common              # shared utils (pagination, errors, dto mappers)
    /jobs
      /queues.ts           # bullmq or custom Redis queues
      /workers             # background processors (email, cache warmers)
      /jobs                # job definitions (email, image processing)
    /utils                 # logger, error handling, id helpers
    /types                 # global types (Context, Env)
  /tests
    /integration           # API tests with supertest
    /unit                  # service-level tests
  package.json
  tsconfig.json
  .env.example
```

## Key Endpoints (draft)
- `POST /auth/register` — create user; hash password; optional email verification
- `POST /auth/login` — issue access/refresh; store refresh/session in Redis
- `POST /auth/refresh` — rotate tokens; check blacklist
- `POST /auth/logout` — revoke refresh in Redis
- `GET /sections` — list published sections (home page content)
- `POST /sections` — create/update section content (admin)
- `GET /gallery` — list gallery items with filters/pagination
- `GET /gallery/:id` — detail with comments/likes
- `POST /gallery/:id/like` — toggle like (store per-user or rate-limit via Redis)
- `POST /gallery/:id/comments` — add comment (moderation flags)
- `GET /metrics/overview` — counts (buyers, brands, cities, years)
- `GET /metrics/timeline` — legacy timeline data for “Legacy in Motion”

## Caching & Performance
- Redis for:
  - Hot caches: sections, stats, timeline, gallery lists
  - Rate limiting: auth, likes/comments
  - Sessions/refresh token invalidation
  - Queues for async jobs via BullMQ (email, image processing)
- Cache keys versioned; TTLs per resource; stale-while-revalidate strategy for gallery lists.

## Jobs (BullMQ)
- Queue definitions in `/jobs/queues.ts`; workers in `/jobs/workers/*`.
- Email jobs: send transactional emails (welcome, password reset), moderation alerts.
- Image jobs: use Sharp to resize/compress/generate variants for gallery uploads; store URLs/paths in Mongo.
- Cache warmers: precompute stats/timeline responses into Redis.

## Security & Ops
- Helmet, CORS, rate-limit, request logging (pino)
- Input validation on every route; strict schemas
- JWT secrets via env; hashed passwords (bcrypt/argon2)
- Mongo indexes: user email unique, gallery slug/id, createdAt for sorting
- Observability: pino transports, healthcheck `/health`, readiness `/ready`

## Dev Scripts (proposed)
- `dev`: ts-node-dev / nodemon entry
- `lint`: eslint
- `test`: vitest
- `build`: tsc

## Setup Notes
1) Add `.env.example` with MONGO_URI, REDIS_URL, JWT_SECRET, PORT.  
2) Create `docker-compose` for local Mongo + Redis (optional).  
3) Implement config loader that fails fast on missing envs.  
4) Add swagger (`@fastify/swagger`) for API docs once schemas are in place.

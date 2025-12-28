import { FastifyInstance } from "fastify";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { getDb } from "../../db/mongo";

const cofounderSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  name: z.string().min(1),
  track: z.enum(["IGE", "IGN", "IGE & IGN"]),
  title: z.string().default(""),
  focus: z.string().default(""),
  image: z.string().url(),
  highlight: z.string().default(""),
  href: z.string().default(""),
  social: z
    .object({
      linkedin: z.string().url().optional(),
      twitter: z.string().url().optional(),
      website: z.string().url().optional(),
    })
    .partial()
    .optional(),
  detail: z
    .object({
      headline: z.string().optional(),
      summary: z.string().optional(),
      heroImage: z.string().url().optional(),
      highlights: z
        .array(z.object({ title: z.string(), body: z.string() }))
        .default([]),
      metrics: z
        .array(z.object({ label: z.string(), value: z.string() }))
        .default([]),
      pullQuote: z.string().optional(),
      ctaLabel: z.string().optional(),
      ctaHref: z.string().optional(),
    })
    .optional(),
});

const payloadSchema = z.object({
  eyebrow: z.string().default(""),
  title: z.string().default(""),
  description: z.string().default(""),
  ctaLabel: z.string().default(""),
  ctaHref: z.string().default(""),
  cofounders: z.array(cofounderSchema),
});

const listQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform((v) => Number(v))
    .catch(24)
    .optional(),
  search: z.string().optional(),
  track: z.string().optional(),
});

export default async function cofoundersRoutes(app: FastifyInstance) {
  app.get("/cofounders", async () => {
    const db = await getDb();
    const col = db.collection("cofounders");
    const stored = await col.findOne<{
      eyebrow: string;
      title: string;
      description: string;
      ctaLabel: string;
      ctaHref: string;
      cofounders: any[];
    }>({ key: "default" });

    if (!stored) {
      return { eyebrow: "", title: "", description: "", ctaLabel: "", ctaHref: "", cofounders: [] };
    }

    return {
      eyebrow: stored.eyebrow ?? "",
      title: stored.title ?? "",
      description: stored.description ?? "",
      ctaLabel: stored.ctaLabel ?? "",
      ctaHref: stored.ctaHref ?? "",
      cofounders: stored.cofounders ?? [],
    };
  });

  app.get("/cofounders/list", async (request) => {
    const db = await getDb();
    const col = db.collection<z.infer<typeof cofounderSchema>>("cofounders_list");
    const parsed = listQuerySchema.safeParse(request.query);
    const query = parsed.success ? parsed.data : { limit: 24 };
    const filter: Record<string, unknown> = {};
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: "i" } },
        { title: { $regex: query.search, $options: "i" } },
        { focus: { $regex: query.search, $options: "i" } },
        { highlight: { $regex: query.search, $options: "i" } },
      ];
    }
    if (query.track) filter.track = query.track;
    if (query.cursor) {
      try {
        filter._id = { $gt: new ObjectId(query.cursor) };
      } catch {
        // ignore bad cursor
      }
    }
    const limit = Math.min(Math.max(query.limit ?? 24, 1), 200);
    const data = await col.find(filter).sort({ _id: 1 }).limit(limit).toArray();
    const next = data.length === limit ? data[data.length - 1]._id?.toString() : null;
    const tracks = await col.distinct("track");
    return { data, cursor: { next, limit }, filters: { tracks } };
  });

  app.get("/cofounders/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const db = await getDb();
    const col = db.collection<z.infer<typeof cofounderSchema>>("cofounders_list");
    const item = await col.findOne({ id });
    if (!item) return reply.code(404).send({ message: "Cofounder not found" });
    return item;
  });

  app.put(
    "/cofounders",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const parse = payloadSchema.safeParse(request.body);
      if (!parse.success) {
        request.log.warn({ issues: parse.error.issues }, "cofounders.update validation failed");
        return reply.code(400).send({ message: "Invalid payload" });
      }
      const db = await getDb();
      const col = db.collection("cofounders");
      await col.updateOne(
        { key: "default" },
        {
          $set: {
            eyebrow: parse.data.eyebrow,
            title: parse.data.title,
            description: parse.data.description,
            ctaLabel: parse.data.ctaLabel,
            ctaHref: parse.data.ctaHref,
            cofounders: parse.data.cofounders,
          },
        },
        { upsert: true }
      );
      request.log.info("cofounders.update success");
      return parse.data;
    }
  );

  app.put(
    "/cofounders/:id",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const parse = cofounderSchema.safeParse({ ...(request.body as object), id });
      if (!parse.success) {
        request.log.warn({ issues: parse.error.issues }, "cofounders.list.update validation failed");
        return reply.code(400).send({ message: "Invalid payload" });
      }
      const db = await getDb();
      const col = db.collection<z.infer<typeof cofounderSchema>>("cofounders_list");
      await col.updateOne(
        { id },
        { $set: { ...parse.data, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );
      request.log.info({ id }, "cofounders.list upserted");
      return parse.data;
    }
  );

  app.delete(
    "/cofounders/:id",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const db = await getDb();
      const col = db.collection<z.infer<typeof cofounderSchema>>("cofounders_list");
      const res = await col.deleteOne({ id });
      if (!res.deletedCount) return reply.code(404).send({ message: "Cofounder not found" });
      request.log.info({ id }, "cofounders.list deleted");
      return { message: "Deleted", id };
    }
  );

  app.post(
    "/cofounders/restore",
    { preHandler: [app.authenticate] },
    async () => {
      const empty = { eyebrow: "", title: "", description: "", ctaLabel: "", ctaHref: "", cofounders: [] as any[] };
      const db = await getDb();
      const col = db.collection("cofounders");
      await col.updateOne({ key: "default" }, { $set: empty }, { upsert: true });
      return empty;
    }
  );
}

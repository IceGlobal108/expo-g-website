import { FastifyInstance } from "fastify";
import { z } from "zod";
import { getDb } from "../../db/mongo";

const statSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  icon: z.enum(["grid", "users"]).optional(),
});

const imageSchema = z.object({
  src: z.string().url(),
  href: z.string().default(""),
});

const payloadSchema = z.object({
  eyebrow: z.string().default(""),
  title: z.string().default(""),
  description: z.string().default(""),
  ctaLabel: z.string().default(""),
  ctaHref: z.string().default(""),
  images: z.array(imageSchema),
  stats: z.array(statSchema).optional(),
});

export default async function buyerMosaicRoutes(app: FastifyInstance) {
  app.get("/buyer-mosaic", async () => {
    const db = await getDb();
    const col = db.collection("buyer_mosaic");
    const stored = await col.findOne<{
      eyebrow: string;
      title: string;
      description: string;
      ctaLabel: string;
      ctaHref: string;
      images: any[];
      stats?: any[];
    }>({ key: "default" });

    if (!stored) {
      return { eyebrow: "", title: "", description: "", ctaLabel: "", ctaHref: "", images: [], stats: [] };
    }

    return {
      eyebrow: stored.eyebrow ?? "",
      title: stored.title ?? "",
      description: stored.description ?? "",
      ctaLabel: stored.ctaLabel ?? "",
      ctaHref: stored.ctaHref ?? "",
      images: stored.images ?? [],
      stats: stored.stats ?? [],
    };
  });

  app.put(
    "/buyer-mosaic",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const parse = payloadSchema.safeParse(request.body);
      if (!parse.success) {
        request.log.warn({ issues: parse.error.issues }, "buyer-mosaic.update validation failed");
        return reply.code(400).send({ message: "Invalid payload" });
      }

      const db = await getDb();
      const col = db.collection("buyer_mosaic");
      await col.updateOne(
        { key: "default" },
        {
          $set: {
            eyebrow: parse.data.eyebrow,
            title: parse.data.title,
            description: parse.data.description,
            ctaLabel: parse.data.ctaLabel,
            ctaHref: parse.data.ctaHref,
            images: parse.data.images,
            stats: parse.data.stats ?? [],
          },
        },
        { upsert: true }
      );
      request.log.info("buyer-mosaic.update success");
      return parse.data;
    }
  );

  app.post(
    "/buyer-mosaic/restore",
    { preHandler: [app.authenticate] },
    async () => {
      const empty = { eyebrow: "", title: "", description: "", ctaLabel: "", ctaHref: "", images: [] as any[], stats: [] as any[] };
      const db = await getDb();
      const col = db.collection("buyer_mosaic");
      await col.updateOne({ key: "default" }, { $set: empty }, { upsert: true });
      return empty;
    }
  );
}

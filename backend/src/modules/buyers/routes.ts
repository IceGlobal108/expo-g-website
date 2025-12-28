import { FastifyInstance } from "fastify";
import { z } from "zod";
import { getDb } from "../../db/mongo";

const buyerSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  name: z.string().min(1),
  city: z.string().default(""),
  segment: z.string().default(""),
  quote: z.string().default(""),
  spend: z.string().default(""),
  visits: z.string().default(""),
  image: z.string().url(),
  href: z.string().default(""),
});

const payloadSchema = z.object({
  eyebrow: z.string().default(""),
  title: z.string().default(""),
  description: z.string().default(""),
  ctaLabel: z.string().default(""),
  ctaHref: z.string().default(""),
  buyers: z.array(buyerSchema),
});

export default async function buyersRoutes(app: FastifyInstance) {
  app.get("/buyers", async () => {
    const db = await getDb();
    const col = db.collection("buyers");
    const stored = await col.findOne<{
      eyebrow: string;
      title: string;
      description: string;
      ctaLabel: string;
      ctaHref: string;
      buyers: any[];
    }>({ key: "default" });

    if (!stored) {
      return { eyebrow: "", title: "", description: "", ctaLabel: "", ctaHref: "", buyers: [] };
    }

    return {
      eyebrow: stored.eyebrow ?? "",
      title: stored.title ?? "",
      description: stored.description ?? "",
      ctaLabel: stored.ctaLabel ?? "",
      ctaHref: stored.ctaHref ?? "",
      buyers: stored.buyers ?? [],
    };
  });

  app.put(
    "/buyers",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const parse = payloadSchema.safeParse(request.body);
      if (!parse.success) {
        request.log.warn({ issues: parse.error.issues }, "buyers.update validation failed");
        return reply.code(400).send({ message: "Invalid payload" });
      }

      const db = await getDb();
      const col = db.collection("buyers");
      await col.updateOne(
        { key: "default" },
        {
          $set: {
            eyebrow: parse.data.eyebrow,
            title: parse.data.title,
            description: parse.data.description,
            ctaLabel: parse.data.ctaLabel,
            ctaHref: parse.data.ctaHref,
            buyers: parse.data.buyers,
          },
        },
        { upsert: true }
      );
      request.log.info("buyers.update success");
      return parse.data;
    }
  );

  app.post(
    "/buyers/restore",
    { preHandler: [app.authenticate] },
    async () => {
      const empty = {
        eyebrow: "",
        title: "",
        description: "",
        ctaLabel: "",
        ctaHref: "",
        buyers: [] as any[],
      };
      const db = await getDb();
      const col = db.collection("buyers");
      await col.updateOne({ key: "default" }, { $set: empty }, { upsert: true });
      return empty;
    }
  );
}

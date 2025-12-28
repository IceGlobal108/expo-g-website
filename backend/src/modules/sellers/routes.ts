import { FastifyInstance } from "fastify";
import { z } from "zod";
import { getDb } from "../../db/mongo";

const sellerSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  name: z.string().min(1),
  role: z.string().default(""),
  company: z.string().default(""),
  quote: z.string().default(""),
  outcome: z.string().default(""),
  image: z.string().url(),
  href: z.string().default(""),
});

const payloadSchema = z.object({
  eyebrow: z.string().default(""),
  title: z.string().default(""),
  description: z.string().default(""),
  ctaLabel: z.string().default(""),
  ctaHref: z.string().default(""),
  sellers: z.array(sellerSchema),
});

export default async function sellersRoutes(app: FastifyInstance) {
  app.get("/sellers", async () => {
    const db = await getDb();
    const col = db.collection("sellers");
    const stored = await col.findOne<{ eyebrow: string; title: string; description: string; ctaLabel: string; ctaHref: string; sellers: any[] }>({ key: "default" });
    if (!stored) {
      return { eyebrow: "", title: "", description: "", sellers: [] };
    }
    return {
      eyebrow: stored.eyebrow ?? "",
      title: stored.title ?? "",
      description: stored.description ?? "",
      sellers: stored.sellers ?? [],
      ctaLabel: stored.ctaLabel ?? "",
      ctaHref: stored.ctaHref ?? "",
    };
  });

  app.put(
    "/sellers",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const parse = payloadSchema.safeParse(request.body);
      if (!parse.success) {
        request.log.warn({ issues: parse.error.issues }, "sellers.update validation failed");
        return reply.code(400).send({ message: "Invalid payload" });
      }
      const db = await getDb();
      const col = db.collection("sellers");
      await col.updateOne(
        { key: "default" },
        {
          $set: {
            eyebrow: parse.data.eyebrow,
            title: parse.data.title,
            description: parse.data.description,
            ctaLabel: parse.data.ctaLabel,
            ctaHref: parse.data.ctaHref,
            sellers: parse.data.sellers,
          },
        },
        { upsert: true }
      );
      request.log.info("sellers.update success");
      return parse.data;
    }
  );

  app.post(
    "/sellers/restore",
    { preHandler: [app.authenticate] },
    async () => {
      const empty = {
        eyebrow: "",
        title: "",
        description: "",
        ctaLabel: "",
        ctaHref: "",
        sellers: [] as any[],
      };
      const db = await getDb();
      const col = db.collection("sellers");
      await col.updateOne({ key: "default" }, { $set: empty }, { upsert: true });
      return empty;
    }
  );
}

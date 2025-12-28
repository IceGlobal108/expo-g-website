import { FastifyInstance } from "fastify";
import { z } from "zod";
import { getDb } from "../../db/mongo";

const celebritySchema = z.object({
  name: z.string().min(1),
  title: z.string().default(""),
  quote: z.string().default(""),
  image: z.string().url(),
  badge: z.string().default(""),
  href: z.string().default(""),
});

const payloadSchema = z.object({
  eyebrow: z.string().default(""),
  title: z.string().default(""),
  description: z.string().default(""),
  ctaLabel: z.string().default(""),
  ctaHref: z.string().default(""),
  celebrities: z.array(celebritySchema),
});

export default async function celebritiesRoutes(app: FastifyInstance) {
  app.get("/celebrities", async () => {
    const db = await getDb();
    const col = db.collection("celebrities");
    const stored = await col.findOne<{ eyebrow: string; title: string; description: string; ctaLabel: string; ctaHref: string; celebrities: any[] }>({ key: "default" });
    if (!stored) {
      return { eyebrow: "", title: "", description: "", celebrities: [] };
    }
    return {
      eyebrow: stored.eyebrow ?? "",
      title: stored.title ?? "",
      description: stored.description ?? "",
      celebrities: stored.celebrities ?? [],
      ctaLabel: stored.ctaLabel ?? "",
      ctaHref: stored.ctaHref ?? "",
    };
  });

  app.put(
    "/celebrities",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const parse = payloadSchema.safeParse(request.body);
      if (!parse.success) {
        request.log.warn({ issues: parse.error.issues }, "celebrities.update validation failed");
        return reply.code(400).send({ message: "Invalid payload" });
      }
      const db = await getDb();
      const col = db.collection("celebrities");
      await col.updateOne(
        { key: "default" },
        {
          $set: {
            eyebrow: parse.data.eyebrow,
            title: parse.data.title,
            description: parse.data.description,
            celebrities: parse.data.celebrities,
            ctaLabel: parse.data.ctaLabel,
            ctaHref: parse.data.ctaHref,
          },
        },
        { upsert: true }
      );
      request.log.info("celebrities.update success");
      return parse.data;
    }
  );

  app.post(
    "/celebrities/restore",
    { preHandler: [app.authenticate] },
    async () => {
      const empty = { eyebrow: "", title: "", description: "", celebrities: [] as any[] };
      const db = await getDb();
      const col = db.collection("celebrities");
      await col.updateOne({ key: "default" }, { $set: empty }, { upsert: true });
      return empty;
    }
  );
}

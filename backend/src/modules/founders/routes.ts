import { FastifyInstance } from "fastify";
import { z } from "zod";
import { getDb } from "../../db/mongo";

const founderSchema = z.object({
  name: z.string().min(1),
  title: z.string().default(""),
  era: z.enum(["ICE 1.0", "ICE 2.0"]),
  focus: z.string().default(""),
  image: z.string().url(),
  highlight: z.string().default(""),
  href: z.string().default(""),
});

const payloadSchema = z.object({
  eyebrow: z.string().default(""),
  title: z.string().default(""),
  description: z.string().default(""),
  ctaLabel: z.string().default(""),
  ctaHref: z.string().default(""),
  founders: z.array(founderSchema),
});

export default async function foundersRoutes(app: FastifyInstance) {
  app.get("/founders", async () => {
    const db = await getDb();
    const col = db.collection("founders");
    const stored = await col.findOne<{
      eyebrow: string;
      title: string;
      description: string;
      ctaLabel: string;
      ctaHref: string;
      founders: any[];
    }>({ key: "default" });
    if (!stored) {
      return { eyebrow: "", title: "", description: "", ctaLabel: "", ctaHref: "", founders: [] };
    }
    return {
      eyebrow: stored.eyebrow ?? "",
      title: stored.title ?? "",
      description: stored.description ?? "",
      ctaLabel: stored.ctaLabel ?? "",
      ctaHref: stored.ctaHref ?? "",
      founders: stored.founders ?? [],
    };
  });

  app.put(
    "/founders",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const parse = payloadSchema.safeParse(request.body);
      if (!parse.success) {
        request.log.warn({ issues: parse.error.issues }, "founders.update validation failed");
        return reply.code(400).send({ message: "Invalid payload" });
      }
      const db = await getDb();
      const col = db.collection("founders");
      await col.updateOne(
        { key: "default" },
        {
          $set: {
            eyebrow: parse.data.eyebrow,
            title: parse.data.title,
            description: parse.data.description,
            ctaLabel: parse.data.ctaLabel,
            ctaHref: parse.data.ctaHref,
            founders: parse.data.founders,
          },
        },
        { upsert: true }
      );
      request.log.info("founders.update success");
      return parse.data;
    }
  );

  app.post(
    "/founders/restore",
    { preHandler: [app.authenticate] },
    async () => {
      const empty = { eyebrow: "", title: "", description: "", ctaLabel: "", ctaHref: "", founders: [] as any[] };
      const db = await getDb();
      const col = db.collection("founders");
      await col.updateOne({ key: "default" }, { $set: empty }, { upsert: true });
      return empty;
    }
  );
}

import { FastifyInstance } from "fastify";
import { z } from "zod";
import { getDb } from "../../db/mongo";

const cofounderSchema = z.object({
  name: z.string().min(1),
  track: z.enum(["IGE", "IGN", "IGE & IGN"]),
  title: z.string().default(""),
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
  cofounders: z.array(cofounderSchema),
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

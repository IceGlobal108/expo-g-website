import { FastifyInstance } from "fastify";
import { z } from "zod";
import { getDb } from "../../db/mongo";

const guestSchema = z.object({
  name: z.string().min(1),
  title: z.string().default(""),
  role: z.string().default(""),
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
  guests: z.array(guestSchema),
});

export default async function vvipRoutes(app: FastifyInstance) {
  app.get("/vvips", async () => {
    const db = await getDb();
    const col = db.collection("vvips");
    const stored = await col.findOne<{
      eyebrow: string;
      title: string;
      description: string;
      ctaLabel: string;
      ctaHref: string;
      guests: any[];
    }>({ key: "default" });

    if (!stored) {
      return { eyebrow: "", title: "", description: "", ctaLabel: "", ctaHref: "", guests: [] };
    }

    return {
      eyebrow: stored.eyebrow ?? "",
      title: stored.title ?? "",
      description: stored.description ?? "",
      ctaLabel: stored.ctaLabel ?? "",
      ctaHref: stored.ctaHref ?? "",
      guests: stored.guests ?? [],
    };
  });

  app.put(
    "/vvips",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const parse = payloadSchema.safeParse(request.body);
      if (!parse.success) {
        request.log.warn({ issues: parse.error.issues }, "vvips.update validation failed");
        return reply.code(400).send({ message: "Invalid payload" });
      }

      const db = await getDb();
      const col = db.collection("vvips");
      await col.updateOne(
        { key: "default" },
        {
          $set: {
            eyebrow: parse.data.eyebrow,
            title: parse.data.title,
            description: parse.data.description,
            ctaLabel: parse.data.ctaLabel,
            ctaHref: parse.data.ctaHref,
            guests: parse.data.guests,
          },
        },
        { upsert: true }
      );
      request.log.info("vvips.update success");
      return parse.data;
    }
  );

  app.post(
    "/vvips/restore",
    { preHandler: [app.authenticate] },
    async () => {
      const empty = { eyebrow: "", title: "", description: "", ctaLabel: "", ctaHref: "", guests: [] as any[] };
      const db = await getDb();
      const col = db.collection("vvips");
      await col.updateOne({ key: "default" }, { $set: empty }, { upsert: true });
      return empty;
    }
  );
}

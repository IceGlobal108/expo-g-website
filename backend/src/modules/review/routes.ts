import { FastifyInstance } from "fastify";
import { z } from "zod";
import { getDb } from "../../db/mongo";

const reviewSchema = z.object({
  eyebrow: z.string().default(""),
  title: z.string().default(""),
  description: z.string().default(""),
  ctaLabel: z.string().default(""),
  ctaHref: z.string().default(""),
  images: z
    .array(
      z.object({
        src: z.string().url(),
        href: z.string().default(""),
      })
    )
    .default([]),
});

export default async function reviewRoutes(app: FastifyInstance) {
  app.get("/review", async () => {
    const db = await getDb();
    const col = db.collection("review");
    const stored = await col.findOne<{
      eyebrow: string;
      title: string;
      description: string;
      ctaLabel: string;
      ctaHref: string;
      images: { src: string; href: string }[];
    }>({ key: "default" });
    if (!stored) {
      return { eyebrow: "", title: "", description: "", ctaLabel: "", ctaHref: "", images: [] };
    }
    return {
      eyebrow: stored.eyebrow ?? "",
      title: stored.title ?? "",
      description: stored.description ?? "",
      ctaLabel: stored.ctaLabel ?? "",
      ctaHref: stored.ctaHref ?? "",
      images: stored.images ?? [],
    };
  });

  app.put(
    "/review",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const parse = reviewSchema.safeParse(request.body);
      if (!parse.success) {
        request.log.warn({ issues: parse.error.issues }, "review.update validation failed");
        return reply.code(400).send({ message: "Invalid payload" });
      }
      const db = await getDb();
      const col = db.collection("review");
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
          },
        },
        { upsert: true }
      );
      request.log.info("review.update success");
      return parse.data;
    }
  );

  app.post(
    "/review/restore",
    { preHandler: [app.authenticate] },
    async () => {
      const empty = {
        eyebrow: "",
        title: "",
        description: "",
        ctaLabel: "",
        ctaHref: "",
        images: [] as { src: string; href: string }[],
      };
      const db = await getDb();
      const col = db.collection("review");
      await col.updateOne({ key: "default" }, { $set: empty }, { upsert: true });
      return empty;
    }
  );
}

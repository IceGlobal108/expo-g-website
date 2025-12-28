import { FastifyInstance } from "fastify";
import { z } from "zod";
import { getDb } from "../../db/mongo";

const brandSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  logo: z.string().min(1),
  relationship: z.string().default(""),
  category: z.string().default(""),
  image: z.string().url(),
});

const brandsSchema = z.object({
  eyebrow: z.string().default(""),
  title: z.string().default(""),
  description: z.string().default(""),
  brands: z.array(brandSchema),
});

export default async function brandsRoutes(app: FastifyInstance) {
  app.get("/brands/highlights", async () => {
    const db = await getDb();
    const col = db.collection("brands_highlights");
    const stored = await col.findOne<{ eyebrow: string; title: string; description: string; brands: any[] }>({ key: "default" });
    if (!stored) {
      return { eyebrow: "", title: "", description: "", brands: [] };
    }
    return {
      eyebrow: stored.eyebrow ?? "",
      title: stored.title ?? "",
      description: stored.description ?? "",
      brands: stored.brands ?? [],
    };
  });

  app.put(
    "/brands/highlights",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const parse = brandsSchema.safeParse(request.body);
      if (!parse.success) {
        request.log.warn({ issues: parse.error.issues }, "brands.update validation failed");
        return reply.code(400).send({ message: "Invalid payload" });
      }
      const db = await getDb();
      const col = db.collection("brands_highlights");
      await col.updateOne(
        { key: "default" },
        {
          $set: {
            eyebrow: parse.data.eyebrow,
            title: parse.data.title,
            description: parse.data.description,
            brands: parse.data.brands,
          },
        },
        { upsert: true }
      );
      request.log.info("brands.update success");
      return parse.data;
    }
  );

  app.post(
    "/brands/highlights/restore",
    { preHandler: [app.authenticate] },
    async () => {
      const empty = {
        eyebrow: "",
        title: "",
        description: "",
        brands: [] as any[],
      };
      const db = await getDb();
      const col = db.collection("brands_highlights");
      await col.updateOne({ key: "default" }, { $set: empty }, { upsert: true });
      return empty;
    }
  );
}

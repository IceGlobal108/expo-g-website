import { FastifyInstance } from "fastify";
import { z } from "zod";
import { getDb } from "../../db/mongo";

const navItemSchema = z.object({
  name: z.string().min(1),
  href: z.string().min(1),
});

const heroContentSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  description: z.string().min(1),
});

const heroItemSchema = z.object({
  title: z.string().min(1),
  link: z.string().min(1),
  thumbnail: z.string().url(),
});

const heroSchema = z.object({
  navItems: z.array(navItemSchema).min(1),
  heroContent: heroContentSchema,
  heroProducts: z.array(heroItemSchema).min(1),
});

export default async function heroRoutes(app: FastifyInstance) {
  app.get("/hero", async () => {
    const db = await getDb();
    const col = db.collection("hero");
    const stored = await col.findOne<{ navItems: any; heroContent: any; heroProducts: any }>({ key: "default" });
    if (!stored) {
      return { navItems: [], heroContent: null, heroProducts: [] };
    }
    return {
      navItems: stored.navItems ?? [],
      heroContent: stored.heroContent ?? null,
      heroProducts: stored.heroProducts ?? [],
    };
  });

  app.put(
    "/hero",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const parse = heroSchema.safeParse(request.body);
      if (!parse.success) {
        request.log.warn({ issues: parse.error.issues }, "hero.update validation failed");
        return reply.code(400).send({ message: "Invalid payload" });
      }
      const db = await getDb();
      const col = db.collection("hero");
      await col.updateOne(
        { key: "default" },
        { $set: { navItems: parse.data.navItems, heroContent: parse.data.heroContent, heroProducts: parse.data.heroProducts } },
        { upsert: true }
      );
      request.log.info("hero.update success");
      return parse.data;
    }
  );

  app.post(
    "/hero/restore",
    { preHandler: [app.authenticate] },
    async () => {
      const db = await getDb();
      const col = db.collection("hero");
      await col.updateOne(
        { key: "default" },
        { $set: { navItems: [], heroContent: null, heroProducts: [] } },
        { upsert: true }
      );
      return { navItems: [], heroContent: null, heroProducts: [] };
    }
  );
}

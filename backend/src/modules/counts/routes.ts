import { FastifyInstance } from "fastify";
import { z } from "zod";
import { getDb } from "../../db/mongo";

const statSchema = z.object({
  value: z.number(),
  suffix: z.string().default(""),
  label: z.string().min(1),
});

const payloadSchema = z.object({
  stats: z.array(statSchema),
});

export default async function countsRoutes(app: FastifyInstance) {
  app.get("/counts", async () => {
    const db = await getDb();
    const col = db.collection("counts");
    const stored = await col.findOne<{ stats: any[] }>({ key: "default" });
    if (!stored) {
      return { stats: [] };
    }
    return { stats: stored.stats ?? [] };
  });

  app.put(
    "/counts",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const parse = payloadSchema.safeParse(request.body);
      if (!parse.success) {
        request.log.warn({ issues: parse.error.issues }, "counts.update validation failed");
        return reply.code(400).send({ message: "Invalid payload" });
      }
      const db = await getDb();
      const col = db.collection("counts");
      await col.updateOne({ key: "default" }, { $set: { stats: parse.data.stats } }, { upsert: true });
      request.log.info("counts.update success");
      return parse.data;
    }
  );

  app.post(
    "/counts/restore",
    { preHandler: [app.authenticate] },
    async () => {
      const empty = { stats: [] as any[] };
      const db = await getDb();
      const col = db.collection("counts");
      await col.updateOne({ key: "default" }, { $set: empty }, { upsert: true });
      return empty;
    }
  );
}

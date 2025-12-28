import { FastifyInstance } from "fastify";
import { z } from "zod";
import { getDb } from "../../db/mongo";

const milestoneSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(""),
  image: z.string().url().optional(),
});

const payloadSchema = z.object({
  eyebrow: z.string().default(""),
  title: z.string().default(""),
  description: z.string().default(""),
  milestones: z.array(milestoneSchema),
});

export default async function timelineRoutes(app: FastifyInstance) {
  app.get("/timeline", async () => {
    const db = await getDb();
    const col = db.collection("timeline");
    const stored = await col.findOne<{ eyebrow: string; title: string; description: string; milestones: any[] }>({
      key: "default",
    });
    if (!stored) {
      return { eyebrow: "", title: "", description: "", milestones: [] };
    }
    return {
      eyebrow: stored.eyebrow ?? "",
      title: stored.title ?? "",
      description: stored.description ?? "",
      milestones: stored.milestones ?? [],
    };
  });

  app.put(
    "/timeline",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const parse = payloadSchema.safeParse(request.body);
      if (!parse.success) {
        request.log.warn({ issues: parse.error.issues }, "timeline.update validation failed");
        return reply.code(400).send({ message: "Invalid payload" });
      }

      const db = await getDb();
      const col = db.collection("timeline");
      await col.updateOne(
        { key: "default" },
        {
          $set: {
            eyebrow: parse.data.eyebrow,
            title: parse.data.title,
            description: parse.data.description,
            milestones: parse.data.milestones,
          },
        },
        { upsert: true }
      );
      request.log.info("timeline.update success");
      return parse.data;
    }
  );

  app.post(
    "/timeline/restore",
    { preHandler: [app.authenticate] },
    async () => {
      const empty = { eyebrow: "", title: "", description: "", milestones: [] as any[] };
      const db = await getDb();
      const col = db.collection("timeline");
      await col.updateOne({ key: "default" }, { $set: empty }, { upsert: true });
      return empty;
    }
  );
}

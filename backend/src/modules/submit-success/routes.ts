import { FastifyInstance } from "fastify";
import { z } from "zod";
import { getDb } from "../../db/mongo";

const successSchema = z.object({
  badge: z.string().default("Success"),
  title: z.string().default("Submission received"),
  message: z.string().default("Thanks! We received your submission."),
  primaryLabel: z.string().default("Back to home"),
  primaryHref: z.string().default("/"),
  secondaryLabel: z.string().default("Contact us"),
  secondaryHref: z.string().default("/contact"),
  note: z.string().default("We typically respond within 1–2 business days."),
});

export default async function submitSuccessRoutes(app: FastifyInstance) {
  app.get("/submit-success", async () => {
    const db = await getDb();
    const col = db.collection("submit_success");
    const stored = await col.findOne({ key: "default" });
    if (!stored) return successSchema.parse({});
    const parsed = successSchema.safeParse(stored);
    if (!parsed.success) return successSchema.parse({});
    return parsed.data;
  });

  app.put(
    "/submit-success",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const parsed = successSchema.safeParse(request.body);
      if (!parsed.success) {
        request.log.warn({ issues: parsed.error.issues }, "submit-success.update validation failed");
        return reply.code(400).send({ message: "Invalid payload" });
      }
      const db = await getDb();
      const col = db.collection("submit_success");
      await col.updateOne({ key: "default" }, { $set: { key: "default", ...parsed.data } }, { upsert: true });
      request.log.info("submit-success updated");
      return parsed.data;
    }
  );
}

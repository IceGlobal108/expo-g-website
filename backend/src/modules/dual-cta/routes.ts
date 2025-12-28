import { FastifyInstance } from "fastify";
import { z } from "zod";
import { getDb } from "../../db/mongo";

const ctaSchema = z.object({
  eyebrow: z.string().default(""),
  title: z.string().default(""),
  description: z.string().default(""),
  primary: z.object({ label: z.string(), href: z.string() }),
  secondary: z.object({ label: z.string(), href: z.string() }).optional(),
});

const payloadSchema = z.object({
  sellers: ctaSchema,
  buyers: ctaSchema,
});

export default async function dualCtaRoutes(app: FastifyInstance) {
  app.get("/dual-cta", async () => {
    const db = await getDb();
    const col = db.collection("dual_cta");
    const stored = await col.findOne<{ sellers: any; buyers: any }>({ key: "default" });
    if (!stored) {
      return {
        sellers: {
          eyebrow: "",
          title: "",
          description: "",
          primary: { label: "", href: "" },
          secondary: { label: "", href: "" },
        },
        buyers: {
          eyebrow: "",
          title: "",
          description: "",
          primary: { label: "", href: "" },
          secondary: { label: "", href: "" },
        },
      };
    }
    return {
      sellers: stored.sellers ?? {},
      buyers: stored.buyers ?? {},
    };
  });

  app.put(
    "/dual-cta",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const parse = payloadSchema.safeParse(request.body);
      if (!parse.success) {
        request.log.warn({ issues: parse.error.issues }, "dual-cta.update validation failed");
        return reply.code(400).send({ message: "Invalid payload" });
      }
      const db = await getDb();
      const col = db.collection("dual_cta");
      await col.updateOne({ key: "default" }, { $set: parse.data }, { upsert: true });
      request.log.info("dual-cta.update success");
      return parse.data;
    }
  );

  app.post(
    "/dual-cta/restore",
    { preHandler: [app.authenticate] },
    async () => {
      const empty = {
        sellers: { eyebrow: "", title: "", description: "", primary: { label: "", href: "" }, secondary: { label: "", href: "" } },
        buyers: { eyebrow: "", title: "", description: "", primary: { label: "", href: "" }, secondary: { label: "", href: "" } },
      };
      const db = await getDb();
      const col = db.collection("dual_cta");
      await col.updateOne({ key: "default" }, { $set: empty }, { upsert: true });
      return empty;
    }
  );
}

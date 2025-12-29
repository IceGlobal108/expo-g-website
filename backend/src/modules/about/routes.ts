import { FastifyInstance } from "fastify";
import { z } from "zod";
import { getDb } from "../../db/mongo";

const ctaSchema = z.object({
  label: z.string().default(""),
  href: z.string().default(""),
});

const aboutSchema = z.object({
  hero: z.object({
    badge: z.string().default("About ICE"),
    title: z.string().default("Production-grade expos with festival energy"),
    body: z.string().default(
      "We engineer the arrivals, stages, booths, and broadcasts that make brands feel cinematic and buyers feel invited—online and on-ground."
    ),
    primaryCta: ctaSchema.default({ label: "Talk to production", href: "/contact" }),
    secondaryCta: ctaSchema.default({ label: "Review the moments", href: "/gallery" }),
  }),
  platforms: z
    .array(
      z.object({
        eyebrow: z.string().default(""),
        title: z.string().default(""),
        body: z.string().default(""),
        cta: ctaSchema.default({ label: "", href: "" }),
      })
    )
    .default([]),
  pillars: z
    .array(
      z.object({
        title: z.string().default(""),
        body: z.string().default(""),
      })
    )
    .default([]),
  timeline: z.object({
    badge: z.string().default("Legacy in motion"),
    title: z.string().default("Our 30-year timeline"),
    body: z.string().default("The milestones that took ICE from a single-city showcase to a hybrid platform spanning 10 cities."),
  }),
  partners: z.object({
    title: z.string().default("Partners that shape the expo"),
    body: z.string().default("Headline sponsors and indie makers co-create with us to set the tone for every edition."),
    cta: ctaSchema.default({ label: "View a partner story", href: "/brands/techvision-labs" }),
  }),
  work: z.object({
    badge: z.string().default("Work with us"),
    title: z.string().default("Let’s design your next launch"),
    body: z.string().default("Bring your product, keynote, or pavilion story. We’ll stage it, film it, and measure it."),
    bullets: z.array(z.string()).default([]),
    primaryCta: ctaSchema.default({ label: "Start a project", href: "/contact" }),
    secondaryCta: ctaSchema.default({ label: "See past highlights", href: "/gallery" }),
  }),
});

export default async function aboutRoutes(app: FastifyInstance) {
  app.get("/about", async () => {
    const db = await getDb();
    const col = db.collection("about_page");
    const stored = await col.findOne({ key: "default" });
    const data = stored?.data ?? {};
    const parsed = aboutSchema.safeParse(data);
    if (!parsed.success) {
      const fallback = aboutSchema.parse({});
      return fallback;
    }
    return parsed.data;
  });

  app.put(
    "/about",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const parsed = aboutSchema.safeParse(request.body);
      if (!parsed.success) {
        request.log.warn({ issues: parsed.error.issues }, "about.update validation failed");
        return reply.code(400).send({ message: "Invalid payload" });
      }
      const db = await getDb();
      const col = db.collection("about_page");
      await col.updateOne({ key: "default" }, { $set: { key: "default", data: parsed.data } }, { upsert: true });
      request.log.info("about.update success");
      return parsed.data;
    }
  );
}

import { FastifyInstance } from "fastify";
import { z } from "zod";
import { getDb } from "../../db/mongo";

const eventCatalog = [
  { key: "welcome", title: "Welcome email", description: "Sent when a new admin account is created." },
  { key: "otp", title: "OTP verification", description: "One-time password for secure logins." },
  { key: "password-reset", title: "Password reset", description: "Password reset / magic link flow." },
  { key: "contact-submitted", title: "Contact form", description: "Trigger when a contact form is submitted." },
  { key: "partner-submitted", title: "Partner inquiry", description: "Trigger on partner inquiry submission." },
  { key: "sponsor-submitted", title: "Sponsor inquiry", description: "Trigger on sponsor inquiry submission." },
  { key: "brand-guidelines", title: "Brand guidelines request", description: "Send assets link for brand guidelines." },
  { key: "feedback-submitted", title: "Feedback received", description: "Trigger when feedback form is submitted." },
  { key: "event-rsvp", title: "Event RSVP", description: "Confirm RSVP for an event." },
  { key: "event-update", title: "Event update", description: "Notify about event time/location updates." },
];

const settingsSchema = z.object({
  settings: z
    .array(
      z.object({
        event: z.string(),
        enabled: z.boolean(),
      })
    )
    .default([]),
});

export default async function notificationsRoutes(app: FastifyInstance) {
  app.get("/notifications/settings", async () => {
    const db = await getDb();
    const col = db.collection("notification_settings");
    const doc = await col.findOne({ _id: "global" });
    const map: Record<string, { enabled: boolean }> = doc?.map || {};

    const data = eventCatalog.map((event) => {
      const cfg = map[event.key];
      return {
        ...event,
        enabled: cfg?.enabled ?? false,
      };
    });

    return { data };
  });

  app.put(
    "/notifications/settings",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const parsed = settingsSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ message: "Invalid payload" });
      }

      const incoming = parsed.data.settings.reduce((acc, item) => {
        acc[item.event] = { enabled: item.enabled };
        return acc;
      }, {} as Record<string, { enabled: boolean }>);

      const db = await getDb();
      const col = db.collection("notification_settings");
      await col.updateOne(
        { _id: "global" },
        { $set: { map: incoming, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );

      return { message: "Saved" };
    }
  );
}

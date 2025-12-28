import { FastifyInstance } from "fastify";

export default async function sectionsRoutes(app: FastifyInstance) {
  app.get("/sections", async () => {
    return { data: [], message: "TODO: fetch sections from Mongo + cache in Redis" };
  });

  app.post("/sections", { preHandler: [app.authenticate] }, async () => {
    return { status: "not-implemented", message: "TODO: create/update section content" };
  });
}

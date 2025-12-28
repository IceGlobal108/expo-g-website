import { FastifyInstance } from "fastify";

export default async function galleryRoutes(app: FastifyInstance) {
  app.get("/gallery", async (request, reply) => {
    const page = Number((request.query as any).page ?? 1);
    const pageSize = Number((request.query as any).pageSize ?? 20);
    return {
      data: [],
      pagination: { page, pageSize, total: 0 },
      message: "TODO: fetch gallery items from Mongo, cached via Redis",
    };
  });

  app.get("/gallery/:id", async (request) => {
    const { id } = request.params as { id: string };
    return { id, data: null, message: "TODO: fetch gallery detail with comments/likes" };
  });

  app.post("/gallery/:id/like", { preHandler: [app.authenticate] }, async (request) => {
    const { id } = request.params as { id: string };
    return { id, message: "TODO: toggle like and rate-limit via Redis" };
  });

  app.post("/gallery/:id/comments", { preHandler: [app.authenticate] }, async (request) => {
    const { id } = request.params as { id: string };
    return { id, message: "TODO: add comment; optional moderation flag" };
  });
}

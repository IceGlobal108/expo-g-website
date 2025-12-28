import { FastifyInstance } from "fastify";

export default async function metricsRoutes(app: FastifyInstance) {
  app.get("/metrics/overview", async () => {
    return {
      buyers: 20_000_000,
      brands: 10_000,
      cities: 10,
      years: 30,
    };
  });

  app.get("/metrics/timeline", async () => {
    return {
      data: [
        { year: 1994, title: "First arch", city: "Mumbai" },
        { year: 2004, title: "Multi-city", city: "5 cities" },
        { year: 2014, title: "Digital layer", city: "Hybrid kiosks" },
        { year: 2019, title: "Immersive entrances", city: "All venues" },
        { year: 2024, title: "Legacy in Motion", city: "10 cities" },
      ],
    };
  });
}

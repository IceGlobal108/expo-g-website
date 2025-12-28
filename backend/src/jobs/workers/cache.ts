import { Worker } from "bullmq";
import { cacheQueue } from "../queues";
import { getRedis } from "../../db/redis";

export const cacheWorker = new Worker(
  cacheQueue.name,
  async (job) => {
    job.log(`Cache warm job: ${job.name}`);
    // TODO: fetch data from Mongo and set into Redis
  },
  { connection: getRedis() }
);

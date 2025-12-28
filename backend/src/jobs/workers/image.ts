import { Worker } from "bullmq";
import sharp from "sharp";
import { imageQueue } from "../queues";
import { getRedis } from "../../db/redis";

export const imageWorker = new Worker(
  imageQueue.name,
  async (job) => {
    const { inputPath, outputPath, width } = job.data as { inputPath: string; outputPath: string; width?: number };
    await sharp(inputPath).resize({ width: width ?? 1600 }).jpeg({ quality: 82 }).toFile(outputPath);
    job.log(`Processed image ${inputPath} -> ${outputPath}`);
  },
  { connection: getRedis() }
);

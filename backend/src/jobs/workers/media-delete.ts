import { Worker } from "bullmq";
import fs from "fs/promises";
import { ObjectId } from "mongodb";
import { mediaDeleteQueue } from "../queues";
import { getRedis } from "../../db/redis";
import { getDb } from "../../db/mongo";

export const mediaDeleteWorker = new Worker(
  mediaDeleteQueue.name,
  async (job) => {
    const { id, paths } = job.data as { id?: string; paths: string[] };
    for (const filePath of paths ?? []) {
      try {
        await fs.unlink(filePath);
        job.log(`Deleted media file ${filePath}`);
      } catch (err: any) {
        if (err && err.code === "ENOENT") {
          job.log(`Media file not found during delete: ${filePath}`);
          continue;
        }
        throw err;
      }
    }

    if (id && ObjectId.isValid(id)) {
      const db = await getDb();
      await db.collection("media").updateOne({ _id: new ObjectId(id) }, { $set: { status: "deleted", deletedAt: new Date() } });
      job.log(`Media ${id} marked deleted`);
    }
  },
  { connection: getRedis() }
);

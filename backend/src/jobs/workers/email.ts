import { Worker } from "bullmq";
import { emailQueue } from "../queues";
import { getRedis } from "../../db/redis";

export const emailWorker = new Worker(
  emailQueue.name,
  async (job) => {
    // TODO: integrate provider (Resend/Mailgun/nodemailer)
    job.log(`Sending email: ${job.name}`);
  },
  { connection: getRedis() }
);

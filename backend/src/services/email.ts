import { emailQueue } from "../jobs/queues";

export type EmailJob = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  event?: string;
  meta?: Record<string, unknown>;
};

export const queueEmail = async (payload: EmailJob) => {
  const name = payload.event || payload.subject || "email";
  await emailQueue.add(name, payload, {
    attempts: 3,
    removeOnComplete: true,
    removeOnFail: false,
  });
};


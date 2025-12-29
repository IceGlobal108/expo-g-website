import { Worker } from "bullmq";
import nodemailer from "nodemailer";
import { emailQueue } from "../queues";
import { getRedis } from "../../db/redis";
import { env } from "../../config/env";
import { EmailJob } from "../../services/email";

const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  secure: env.smtpSecure,
  auth: {
    user: env.smtpUser,
    pass: env.smtpPass,
  },
});

export const emailWorker = new Worker(
  emailQueue.name,
  async (job) => {
    const payload = job.data as EmailJob;
    const { to, subject, html, text } = payload;
    if (!to || !subject) {
      throw new Error("Missing to/subject");
    }

    const message = {
      from: env.emailFrom,
      to,
      subject,
      text: text || (html ? html.replace(/<[^>]+>/g, "") : undefined) || "",
      html,
    };

    await transporter.sendMail(message);
    job.log(`Email sent to ${Array.isArray(to) ? to.join(",") : to} with subject "${subject}"`);
  },
  { connection: getRedis() }
);

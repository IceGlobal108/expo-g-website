import { Redis } from "ioredis";
import { env } from "../config/env";

let redis: Redis | null = null;

export const getRedis = () => {
  if (!redis) {
    redis = new Redis(env.redisUrl, {
      maxRetriesPerRequest: null,
    });
  }
  return redis;
};

import dotenv from "dotenv";

dotenv.config();

const required = (value: string | undefined, key: string) => {
  if (!value) {
    throw new Error(`Missing env var: ${key}`);
  }
  return value;
};

const firstDefined = (keys: string[], requiredKey: string) => {
  for (const key of keys) {
    const val = process.env[key];
    if (val && val.length) return val;
  }
  throw new Error(`Missing env var: ${requiredKey} (checked ${keys.join(", ")})`);
};

export const env = {
  port: Number(process.env.APP_PORT ?? process.env.PORT ?? 4000),
  mongoUri: required(process.env.MONGO_URI, "MONGO_URI"),
  redisUrl: required(process.env.REDIS_URL, "REDIS_URL"),
  jwtSecret: firstDefined(["JWT_SECRET", "JWT_ACCESS_SECRET"], "JWT_SECRET/JWT_ACCESS_SECRET"),
  jwtRefreshSecret: firstDefined(["JWT_REFRESH_SECRET"], "JWT_REFRESH_SECRET"),
  adminUser: process.env.USER_NAME ?? "admin",
  adminPassword: process.env.PASSWORD ?? "admin",
};

import { MongoClient } from "mongodb";
import { env } from "../config/env";

let client: MongoClient | null = null;

export const getMongoClient = async () => {
  if (client) return client;
  client = new MongoClient(env.mongoUri);
  await client.connect();
  return client;
};

export const getDb = async () => {
  const mongo = await getMongoClient();
  return mongo.db();
};

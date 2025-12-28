import { getDb } from "../src/db/mongo";

const defaultCounts = {
  key: "default",
  stats: [
    { value: 20, suffix: "M+", label: "buyers" },
    { value: 10000, suffix: "+", label: "brands & sellers" },
    { value: 10, suffix: "", label: "cities across India" },
    { value: 30, suffix: "+", label: "years of mega exhibitions" },
  ],
};

const run = async () => {
  try {
    const db = await getDb();
    const col = db.collection("counts");
    await col.updateOne({ key: "default" }, { $set: defaultCounts }, { upsert: true });
    console.log("Counts seed applied.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

run();

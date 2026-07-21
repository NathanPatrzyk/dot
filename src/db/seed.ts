import { seed, reset } from "drizzle-seed";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

const sqlite = new Database(process.env.DATABASE_URL ?? "./data/app.db");
const dbForSeed = drizzle(sqlite);

async function main() {
  await reset(dbForSeed, schema);

  await seed(dbForSeed, schema).refine((f) => ({
    tasks: {
      columns: {
        name: f.loremIpsum({ sentencesCount: 1 }),
        isCompleted: f.boolean(),
      },
      count: 20,
    },
  }));

  console.log("Seed concluído.");
}

main();

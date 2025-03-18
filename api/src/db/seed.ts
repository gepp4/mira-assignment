import { sql, Table } from "drizzle-orm";
import { type DB, db } from "./index.js";
import * as seeds from "./seeds/index.js";
import * as schema from "./schema/index.js";

async function resetTable(db: DB, table: Table) {
  return db.execute(sql`truncate ${table} restart identity cascade;`);
}

// reset and seed the databse
async function main() {
  for (const table of [schema.playerTable]) {
    await resetTable(db, table);
  }
  await seeds.player(db);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Seeding done!");
    process.exit(0);
  });

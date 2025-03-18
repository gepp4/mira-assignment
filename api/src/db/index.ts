import { drizzle } from "drizzle-orm/node-postgres";
import  pg  from "pg";
import * as schema from "@/db/schema/index.js";
import env from "@/lib/env.js";

const pool = new pg.Pool({
	connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export type DB = typeof db;
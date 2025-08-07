import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { DATABASE_URL } from "$env/static/private";

const pool = new Pool({
  connectionString: DATABASE_URL,
  idleTimeoutMillis: 15000,
  connectionTimeoutMillis: 5000,
  max: 50,
});

export const db = drizzle(pool);

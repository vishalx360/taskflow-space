import "dotenv/config";

import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.DATABASE_URL!);

const globalForDrizzle = globalThis as unknown as {
  drizzleClient: any; // Replace 'any' with the correct type if available
};

export const drizzleDB = globalForDrizzle.drizzleClient ?? drizzle(sql);

if (!globalForDrizzle.drizzleClient) {
  globalForDrizzle.drizzleClient = drizzleDB;
}

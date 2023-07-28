import { drizzleDB } from "drizzle";
import { migrate } from 'drizzle-orm/neon-http/migrator';

await migrate(drizzleDB, { migrationsFolder: "drizzle/migrations" });
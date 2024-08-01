import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { DATABASE_URL } from "../utils/env";

const connectionString = DATABASE_URL;

if (!connectionString) {
    throw new Error("No DATABASE_URL provided");
}
// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client);

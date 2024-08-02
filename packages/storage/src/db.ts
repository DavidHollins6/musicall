import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const createDb = (connectionString: string) => {
  const client = postgres(connectionString, { prepare: false });
  return drizzle(client);
};

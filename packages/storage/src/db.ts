import { drizzle } from "drizzle-orm/node-postgres";

export const createDb = (connectionString: string) => {
    return drizzle(connectionString);
};

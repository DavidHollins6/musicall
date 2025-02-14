import { defineConfig } from "drizzle-kit";
import "dotenv";

export default defineConfig({
    dialect: "postgresql",
    schema: "../../packages/storage/src/schema.ts",
    dbCredentials: {
        url: process.env.DATABASE_URL || "",
    },
});

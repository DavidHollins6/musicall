import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().notNull(),
  email: varchar("email"),
});

export type User = typeof users.$inferSelect;

export const rooms = pgTable("rooms", {
  id: uuid("id").primaryKey().notNull(),
  ownerId: uuid("owner_id")
    .references(() => users.id)
    .notNull(),
});

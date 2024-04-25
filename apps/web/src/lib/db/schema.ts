import { pgTable, serial, varchar, integer, pgSchema, uuid } from "drizzle-orm/pg-core";

export const instrumentTypes = pgTable("instrument_types", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
});

export const triggerTypes = pgTable("trigger_types", {
    id: serial("id").primaryKey(),
    instrumentTypeId: integer("instrument_type_id")
        .notNull()
        .references(() => instrumentTypes.id),
    name: varchar("name", { length: 256 }).notNull(),
    fileName: varchar("file_name", { length: 256 }).notNull(),
    defaultMappingValue: integer("default_mapping_value").notNull(),
    order: integer("order"),
});

export type TriggerType = typeof triggerTypes.$inferSelect;

export const mappings = pgTable("mappings", {
    id: serial("id").primaryKey(),
    triggerTypeId: integer("trigger_type_id")
        .notNull()
        .references(() => triggerTypes.id),
    value: integer("value").notNull(),
    userId: uuid("user_id")
        .references(() => users.id)
        .notNull(),
});

export type Mapping = typeof mappings.$inferSelect;

export const authSchema = pgSchema("auth");

export const users = authSchema.table("users", {
    id: uuid("id").primaryKey().notNull(),
});

export const friends = authSchema.table("users", {
    id: uuid("id").primaryKey().notNull(),
    userId: uuid("user_id")
        .references(() => users.id)
        .notNull(),
    friendId: uuid("friend_id")
        .references(() => users.id)
        .notNull(),
});

export const rooms = pgTable("rooms", {
    id: serial("id").primaryKey().notNull(),
    ownerId: uuid("owner_id")
        .references(() => users.id)
        .notNull(),
});

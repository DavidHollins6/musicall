import { pgTable, serial, varchar, integer, uuid } from "drizzle-orm/pg-core";

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

export const users = pgTable("users", {
    id: uuid("id").primaryKey().notNull(),
    email: varchar("email"),
    name: varchar("name").notNull(),
});

export const rooms = pgTable("rooms", {
    id: uuid("id").primaryKey().notNull(),
    ownerId: uuid("owner_id")
        .references(() => users.id)
        .notNull(),
    name: varchar("name", { length: 256 }).notNull(),
});

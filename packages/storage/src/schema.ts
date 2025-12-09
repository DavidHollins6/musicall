import { pgTable, serial, varchar, integer, uuid, boolean, timestamp } from "drizzle-orm/pg-core";

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
    type: varchar("type").notNull(),
});

export const rooms = pgTable("rooms", {
    id: uuid("id").primaryKey().notNull(),
    ownerId: uuid("owner_id")
        .references(() => users.id)
        .notNull(),
    name: varchar("name", { length: 256 }).notNull(),
});

export const sessions = pgTable("sessions", {
    id: uuid("id").primaryKey().notNull(),
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
    teacherId: uuid("teacher_id")
        .references(() => users.id)
        .notNull(),
    type: varchar("type").notNull(),
    instrument: varchar("instrument").notNull(),
    name: varchar("name").notNull(),
    cancelled: boolean("cancelled").notNull(),
});

export const sessionsStudents = pgTable("sessions_students", {
    sessionsStudentId: uuid("sessions_students_id").primaryKey().notNull(),
    sessionId: uuid("session_id")
        .references(() => sessions.id)
        .notNull(),
    studentId: uuid("student_id")
        .references(() => users.id)
        .notNull(),
});

export const teacherStudents = pgTable("teachers_students", {
    teacherStudentId: uuid("sessions_students_id").primaryKey().notNull(),
    teacherId: uuid("teacher_id")
        .references(() => users.id)
        .notNull(),
    studentId: uuid("student_id")
        .references(() => users.id)
        .notNull(),
});

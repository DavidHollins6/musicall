import { instrumentTypes, mappings, rooms, triggerTypes, users } from "./schema";

export type User = typeof users.$inferSelect;

export type Room = typeof rooms.$inferSelect;

export type TriggerType = typeof triggerTypes.$inferSelect;

export type Mapping = typeof mappings.$inferSelect;

export type InstrumentType = typeof instrumentTypes.$inferSelect;

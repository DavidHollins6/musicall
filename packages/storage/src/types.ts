import { instrumentTypes, mappings, rooms, triggerTypes, users } from "./schema";

export type User = {
    firstName: string;
    lastName: string;
    primaryEmailAddress: string;
    id: string;
};
export type Room = typeof rooms.$inferSelect;

export type TriggerType = typeof triggerTypes.$inferSelect;

export type Mapping = typeof mappings.$inferSelect;

export type InstrumentType = typeof instrumentTypes.$inferSelect;

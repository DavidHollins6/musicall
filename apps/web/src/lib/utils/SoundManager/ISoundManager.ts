import type { Mapping, TriggerType } from "$lib/db/schema";
import type { MessageEvent } from "webmidi";

export interface ISoundManager {
    mappings: Mapping[];
    triggerTypes: TriggerType[];
    changeMappings: (_mappings: Mapping[]) => void;
    handleMidiEvent: (event: MessageEvent["message"]) => void;
}

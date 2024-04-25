import { base } from "$app/paths";
import midimessage from "midimessage";
import type { Mapping, TriggerType } from "$lib/db/schema";
import type { MessageEvent } from "webmidi";
import type { ISoundManager } from "./ISoundManager";

export class DrumSoundManager implements ISoundManager {
    mappings: Mapping[];
    triggerTypes: TriggerType[];

    constructor(_mappings: Mapping[], _triggerTypes: TriggerType[]) {
        this.mappings = _mappings;
        this.triggerTypes = _triggerTypes;
    }

    handleMidiEvent(event: MessageEvent["message"]) {
        const message = midimessage(event);
        if (message.messageType === "noteon") {
            const mapping = this.mappings.find((m) => m.value === message.key);
            let fileName: string | null | undefined = null;
            if (mapping) {
                fileName = this.triggerTypes.find((t) => t.id === mapping?.triggerTypeId)?.fileName;
            } else {
                fileName = this.triggerTypes.find((t) => t.defaultMappingValue === message.key)?.fileName;
            }
            if (fileName) {
                setTimeout(() => {
                    const sound = new Audio(`${base}/audio/${fileName}.wav`);
                    sound.volume = message.velocity / 127;
                    sound.play();
                }, 0);
            }
        }
    }

    changeMappings(_mappings: Mapping[]) {
        console.log(_mappings);
        this.mappings = _mappings;
    }
}

import type { Message } from "webmidi";

export interface ISoundManager {
    handleMidiEvent: (event: Message) => void;
    enable: () => void;
}

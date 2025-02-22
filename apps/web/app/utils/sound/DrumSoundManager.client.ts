import midimessage from "midimessage";
import { Howl } from "howler";
import type { Message } from "webmidi";
import type { ISoundManager } from "./ISoundManager";

const generalMidiStandardMappings: Record<number, string> = {
    42: "closedhihat",
    49: "crash1",
    57: "crash2",
    46: "openhihat",
    51: "ride",
    40: "rim",
    38: "snare",
    50: "tom1",
    48: "tom2",
    43: "tom3",
    35: "kick",
};

export class DrumSoundManager implements ISoundManager {
    howl: Howl;

    constructor() {
        this.howl = new Howl({
            src: ["./audio/drums/drums.mp3"],
            sprite: {
                closedhihat: [0, 394],
                crash1: [804, 4440],
                crash2: [5655, 5574],
                openhihat: [13374, 3945],
                ride: [17600, 3994],
                rim: [23529, 580],
                snare: [24404, 600],
                tom1: [25124, 1270],
                tom2: [26564, 1055],
                tom3: [27809, 1480],
                kick: [29494, 435],
            },
            html5: true,
        });
    }

    handleMidiEvent(event: Message) {
        const message = midimessage(event);

        if (message.messageType === "noteon") {
            const padName = generalMidiStandardMappings[message.key];
            console.log(padName);
            if (padName) {
                this.howl.play(padName);
            }
        }
    }

    enable() {
        const currentVolume = this.howl.volume();
        this.howl.volume(0);
        this.howl.play("kick");
        this.howl.volume(currentVolume);
    }

    changeMappings() {}
}

import midimessage from "midimessage";
import { Howl, Howler } from "howler";
import * as Tone from "tone";
import type { Message } from "webmidi";
import type { ISoundManager } from "./ISoundManager";
import { noteMidiToString } from "./noteMidiToString";

export class DrumSoundManager implements ISoundManager {
    howl: Howl;

    constructor() {
        this.howl = new Howl({
            src: ["./audio/drums/drums.webm", "./audio/drums/drums.mp3"],
            sprite: {
                clap: [0, 734.2630385487529],
                "closed-hihat": [2000, 445.94104308390035],
                crash: [4000, 1978.6848072562354],
                kick: [7000, 553.0839002267571],
                "open-hihat": [9000, 962.7664399092968],
                snare: [11000, 354.48979591836684],
            },
        });
    }

    handleMidiEvent(event: Message) {
        const message = midimessage(event);

        if (message.messageType === "noteon") {
            this.howl.play("snare");
        }
    }

    changeMappings() {}
}

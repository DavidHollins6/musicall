import midimessage from "midimessage";
import * as Tone from "tone";
import type { Message } from "webmidi";
import type { ISoundManager } from "./ISoundManager";
import { noteMidiToString } from "./noteMidiToString";

export class KeyboardSoundManager implements ISoundManager {
    synth: Tone.PolySynth<Tone.Synth<Tone.SynthOptions>>;

    constructor() {
        this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
        Tone.start();
    }

    handleMidiEvent(event: Message) {
        const message = midimessage(event);

        if (message.messageType === "noteon") {
            const note = noteMidiToString(message.key);
            this.synth.triggerAttack(note, Tone.now());
        }

        if (message.messageType === "noteoff") {
            const note = noteMidiToString(message.key);
            this.synth.triggerRelease(note, Tone.now());
        }
    }

    enable() {}

    changeMappings() {}
}

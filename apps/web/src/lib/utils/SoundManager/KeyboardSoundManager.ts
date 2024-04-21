import midimessage from "midimessage";
import * as Tone from "tone";
import type { Mapping, TriggerType } from "$lib/db/schema";
import type { Message } from "webmidi";
import type { ISoundManager } from "./ISoundManager";
import { noteMidiToString } from "../noteMidiToString";

export class KeyboardSoundManager implements ISoundManager {
    mappings: Mapping[];
    triggerTypes: TriggerType[];
    synth: Tone.PolySynth<Tone.Synth<Tone.SynthOptions>>;

    constructor(_mappings: Mapping[], _triggerTypes: TriggerType[]) {
        this.mappings = _mappings;
        this.triggerTypes = _triggerTypes;
        this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
        Tone.start();
    }

    handleMidiEvent(event: Message) {
        const message = midimessage(event);

        if (message.messageType === "noteon") {
            const note = noteMidiToString(message.key);
            console.log("attack", note);
            this.synth.triggerAttack(note, Tone.now());
        }

        if (message.messageType === "noteoff") {
            const note = noteMidiToString(message.key);
            console.log("release", note);
            this.synth.triggerRelease(note, Tone.now());
        }
    }

    changeMappings(_mappings: Mapping[]) {
        this.mappings = _mappings;
    }
}

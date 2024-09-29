import { useEffect, useRef } from "react";
import { Message, WebMidi } from "webmidi";
import { useDeviceStore } from "../store/deviceStore";
import { useEffectEvent } from "./useEffectEvent";
import { useMidiStore } from "../store/midiStore";
import { KeyboardSoundManager } from "../utils/sound/KeyboardSoundManager";

export const useMidiSoundPlayer = () => {
    const { midi } = useDeviceStore();
    const { midiInputs } = useMidiStore();
    const soundManager = useRef(new KeyboardSoundManager());

    const onMidiMessage = useEffectEvent((e: Message) => {
        soundManager.current.handleMidiEvent(e);
    });

    useEffect(() => {
        midiInputs.forEach((i) => {
            i.removeListener("midimessage");
        });

        const newInput = WebMidi.inputs.find((i) => i.id === midi.id);

        if (newInput) {
            newInput.addListener("midimessage", onMidiMessage);
        }
    }, [midiInputs.length, midi.id]);
};

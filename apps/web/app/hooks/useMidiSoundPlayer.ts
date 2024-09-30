import { useEffect } from "react";
import { Message, WebMidi } from "webmidi";
import { useDeviceStore } from "../store/deviceStore";
import { useEffectEvent } from "./useEffectEvent";
import { useMidiStore } from "../store/midiStore";
import { useSoundManager } from "./useSoundManager";

export const useMidiSoundPlayer = () => {
    const { midi } = useDeviceStore();
    const { midiInputs } = useMidiStore();
    const soundManager = useSoundManager();

    const onMidiMessage = useEffectEvent((e: Message) => {
        soundManager.handleMidiEvent(e);
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

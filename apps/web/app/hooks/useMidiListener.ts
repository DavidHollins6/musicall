import { useEffect } from "react";
import { MessageEvent, WebMidi } from "webmidi";
import { useDeviceStore } from "../store/deviceStore";
import { useEffectEvent } from "./useEffectEvent";
import { useMidiStore } from "../store/midiStore";

export const useMidiListener = (callback: (e: MessageEvent) => void) => {
    const { midi } = useDeviceStore();
    const { midiInputs } = useMidiStore();

    const onMidiMessage = useEffectEvent(callback);

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

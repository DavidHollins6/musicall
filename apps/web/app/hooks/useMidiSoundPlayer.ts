import { useEffect } from "react";
import { Message, WebMidi } from "webmidi";
import { useEffectEvent } from "./useEffectEvent";
import { useSoundManager } from "./useSoundManager";
import { useMidiState } from "./useMidiState";

export const useMidiSoundPlayer = () => {
    const soundManager = useSoundManager();
    const { devices, selectedDevice } = useMidiState();

    const onMidiMessage = useEffectEvent((e: Message) => {
        soundManager.handleMidiEvent(e);
    });

    useEffect(() => {
        devices.forEach((i) => {
            i.removeListener("midimessage");
        });

        const newInput = WebMidi.inputs.find((i) => i.id === selectedDevice);

        if (newInput) {
            newInput.addListener("midimessage", onMidiMessage);
        }
    }, [devices.length, selectedDevice]);
};

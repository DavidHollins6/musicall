import { useEffect } from "react";
import { MessageEvent, WebMidi } from "webmidi";
import { useEffectEvent } from "./useEffectEvent";
import { useMidiState } from "./useMidiState";

export const useMidiListener = (callback: (e: MessageEvent) => void) => {
    const { devices, selectedDevice } = useMidiState();
    const onMidiMessage = useEffectEvent(callback);

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

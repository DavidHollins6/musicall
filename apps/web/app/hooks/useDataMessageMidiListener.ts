import { useEffect } from "react";
import { MessageEvent, WebMidi } from "webmidi";
import { createDataMessage } from "@musicall/types/dataMessage";
import { useDeviceStore } from "../store/deviceStore";
import { usePeerStore } from "../store/peerStore";
import { useEffectEvent } from "./useEffectEvent";
import { useMidiStore } from "../store/midiStore";

export const useDataMessageMidiListener = () => {
    const { midi } = useDeviceStore();
    const { midiInputs } = useMidiStore();
    const { peers } = usePeerStore();

    const onMidiMessage = useEffectEvent((e: MessageEvent) => {
        if (midi.enabled) {
            Object.keys(peers).forEach((pId) => {
                const peer = peers[pId];
                peer.peerConnection.send(createDataMessage({ type: "midi", message: e.message }));
            });
        }
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

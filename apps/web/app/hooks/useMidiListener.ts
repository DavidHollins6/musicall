import { useEffect } from "react";
import { WebMidi } from "webmidi";
import { createDataMessage } from "@musicall/types/dataMessage";
import { useDeviceStore } from "../store/deviceStore";
import { usePeerStore } from "../store/peerStore";
import { useMidi } from "./useMidi";

export const useMidiListener = () => {
    const { midi } = useDeviceStore();
    const { getMidiInstruments } = useMidi();
    const { peers } = usePeerStore();

    useEffect(() => {
        getMidiInstruments().then((allInstruments) => {
            allInstruments.forEach((i) => {
                i.removeListener("midimessage");
            });

            const newInput = WebMidi.inputs.find((i) => i.id === midi.id);

            if (newInput) {
                newInput.addListener("midimessage", (e) => {
                    if (midi.enabled) {
                        Object.keys(peers).forEach((pId) => {
                            const peer = peers[pId];
                            peer.peerConnection.send(createDataMessage({ type: "midi", message: e.message }));
                        });
                    }
                });
            }
        });
    }, [midi.id, peers, midi.enabled, getMidiInstruments, midi]);
};

import { useEffect, useState } from "react";
import { WebMidi } from "webmidi";
import { useDevice } from "~/store/deviceContext";
import { usePeers, usePeersDispatcher } from "~/store/peersContext";

export const useMidi = () => {
    const [webMidiEnabled, setWebMidiEnabled] = useState(false);
    const { midi } = useDevice();
    const { peers } = usePeers();
    const peersDispatch = usePeersDispatcher();

    useEffect(() => {
        WebMidi.enable().then(() => {
            setWebMidiEnabled(true);
        });
    }, []);

    useEffect(() => {
        if (midi.id) {
            const input = WebMidi.inputs.find((i) => i.id === midi.id);

            if (input) {
                console.log("got an input!!!");
                input.addListener("midimessage", (e) => {
                    peersDispatch({ type: "sendData", message: JSON.stringify({ type: "midi", payload: e.message }) });
                });
            }
        }
    }, [midi.id]);

    return webMidiEnabled;
};

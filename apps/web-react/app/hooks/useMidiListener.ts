import { useEffect, useState } from "react";
import { Message, WebMidi } from "webmidi";

export const useMidiListener = (midiInputId: string, listener: (e: Message) => void) => {
    const [previousMidiInputId, setPreviousMidiInputId] = useState<string>();
    useEffect(() => {
        console.log("midi input changed");
        if (previousMidiInputId) {
            const previousInput = WebMidi.inputs.find((i) => i.id === previousMidiInputId);

            if (previousInput) {
                previousInput.removeListener("midimessage");
            }

            setPreviousMidiInputId(midiInputId);
        }

        const newInput = WebMidi.inputs.find((i) => i.id === midiInputId);

        if (newInput) {
            console.log("setting up a listener");
            newInput.addListener("midimessage", (e) => listener(e.message));
        }
    }, [midiInputId]);
};

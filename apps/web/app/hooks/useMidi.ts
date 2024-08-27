import { WebMidi } from "webmidi";

export const useMidi = () => {
    return {
        getMidiInstruments: async () => {
            await WebMidi.enable();
            return WebMidi.inputs;
        },
    };
};

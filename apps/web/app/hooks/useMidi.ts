import { WebMidi } from "webmidi";

export const useMidi = () => {
    return {
        enableMidi: async () => {
            await WebMidi.enable();
        },
    };
};

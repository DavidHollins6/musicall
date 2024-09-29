import { create } from "zustand";
import { produce } from "immer";
import { Input, WebMidi } from "webmidi";

type State = {
    midiInputs: Array<Input>;
};

type Actions = {
    setMidiInputs: (newInputs: Array<Input>) => void;
    refreshMidiInputs: () => void;
};

export const useMidiStore = create<State & Actions>((set) => ({
    midiInputs: [],
    setMidiInputs: (newInputs) => {
        set(
            produce((state: State) => {
                state.midiInputs = newInputs;
            }),
        );
    },
    refreshMidiInputs: () => {
        console.log(WebMidi.inputs);
        set({ midiInputs: WebMidi.inputs });
    },
}));

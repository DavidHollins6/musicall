import { create } from "zustand";
import { produce } from "immer";

export type InstrumentType = "drums" | "keyboard";

type State = {
    voice: {
        id?: string;
        enabled: boolean;
    };
    video: {
        id?: string;
        enabled: boolean;
    };
    midi: {
        id?: string;
        enabled: boolean;
    };
    instrumentType: InstrumentType;
};

type Actions = {
    setAudioDeviceId: (id: string) => void;
    setVideoDeviceId: (id: string) => void;
    setMidiDeviceId: (id: string) => void;
    setDeviceIds: (videoId: string, audioId: string) => void;
    setInstrumentType: (instrumentType: InstrumentType) => void;
    toggleVoice: () => void;
    toggleMidi: () => void;
    toggleVideo: () => void;
};

export const useDeviceStore = create<State & Actions>((set) => ({
    voice: {
        enabled: false,
    },
    video: {
        enabled: false,
    },
    midi: {
        enabled: false,
    },
    instrumentType: "keyboard",
    setAudioDeviceId: (id: string) => {
        set(
            produce((state: State) => {
                state.voice.id = id;
            }),
        );
    },
    setVideoDeviceId: (id: string) => {
        set(
            produce((state: State) => {
                state.video.id = id;
            }),
        );
    },
    setMidiDeviceId: (id: string) => {
        set(
            produce((state: State) => {
                state.midi.id = id;
            }),
        );
    },
    setDeviceIds: (videoId: string, audioId: string) => {
        set(
            produce((state: State) => {
                state.video.id = videoId;
                state.voice.id = audioId;
            }),
        );
    },
    setInstrumentType: (instrumentType: InstrumentType) => {
        set(
            produce((state: State) => {
                state.instrumentType = instrumentType;
            }),
        );
    },
    toggleVoice: () => {
        set(
            produce((state: State) => {
                state.voice.enabled = !state.voice.enabled;
            }),
        );
    },
    toggleMidi: () => {
        set(
            produce((state: State) => {
                state.midi.enabled = !state.midi.enabled;
            }),
        );
    },
    toggleVideo: () => {
        set(
            produce((state: State) => {
                state.video.enabled = !state.video.enabled;
            }),
        );
    },
}));

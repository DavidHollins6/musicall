import { create } from "zustand";
import { produce } from "immer";
import { Input } from "webmidi";

export type InstrumentType = "drums" | "keyboard";

type State = {
    voice: {
        id?: string;
        enabled: boolean;
        devices: Array<MediaDeviceInfo>;
        stream?: MediaStream;
    };
    video: {
        id?: string;
        enabled: boolean;
        devices: Array<MediaDeviceInfo>;
        stream?: MediaStream;
    };
    midi: {
        id?: string;
        enabled: boolean;
        devices: Array<Input>;
    };
    instrumentType: InstrumentType;
};

type Actions = {
    setAudioDeviceId: (id: string) => void;
    setMidiDeviceId: (id: string) => void;
    setDeviceIds: (videoId: string, audioId: string) => void;
    setInstrumentType: (instrumentType: InstrumentType) => void;
    toggleVoice: () => void;
    toggleMidi: () => void;
    toggleVideo: () => void;
    setVideoDevices: (devices: Array<MediaDeviceInfo>) => void;
    setNewVideo: (mediaStream: MediaStream, id: string) => void;
    setVoiceDevices: (devices: Array<MediaDeviceInfo>) => void;
    setNewVoice: (mediaStream: MediaStream, id: string) => void;
    setMidiDevices: (devices: Array<Input>) => void;
    setNewMidi: (id: string) => void;
};

export const useDeviceStore = create<State & Actions>((set) => ({
    voice: {
        enabled: false,
        devices: [],
    },
    video: {
        enabled: false,
        devices: [],
    },
    midi: {
        enabled: false,
        devices: [],
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
    setVideoDevices: (devices: Array<MediaDeviceInfo>) => {
        set(
            produce((state: State) => {
                state.video.devices = devices;
            }),
        );
    },
    setNewVideo(mediaStream, id) {
        set(
            produce((state: State) => {
                state.video.stream = mediaStream;
                state.video.id = id;
            }),
        );
    },
    setVoiceDevices: (devices: Array<MediaDeviceInfo>) => {
        set(
            produce((state: State) => {
                state.voice.devices = devices;
            }),
        );
    },
    setNewVoice(mediaStream, id) {
        set(
            produce((state: State) => {
                state.voice.stream = mediaStream;
                state.voice.id = id;
            }),
        );
    },
    setNewMidi(id) {
        set(
            produce((state: State) => {
                state.midi.id = id;
            }),
        );
    },
    setMidiDevices(devices) {
        set(
            produce((state: State) => {
                state.midi.devices = devices;
            }),
        );
    },
}));

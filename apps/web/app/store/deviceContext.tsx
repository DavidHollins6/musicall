import * as React from "react";

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

type Action =
    | { type: "setAudioDeviceId"; id: string }
    | { type: "setVideoDeviceId"; id: string }
    | { type: "setDeviceIds"; videoId: string; audioId: string }
    | { type: "setMidiDeviceId"; id: string }
    | { type: "setInstrumentType"; instrumentType: InstrumentType }
    | { type: "toggleVoice" }
    | { type: "toggleMidi" }
    | { type: "toggleVideo" };

const DeviceContext = React.createContext<{ state: State; dispatch: React.Dispatch<Action> }>({
    state: {
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
    },
    dispatch: () => undefined,
});

function deviceReducer(state: State, action: Action): State {
    switch (action.type) {
        case "setAudioDeviceId": {
            return {
                ...state,
                voice: {
                    ...state.voice,
                    id: action.id,
                },
            };
        }
        case "setVideoDeviceId": {
            return {
                ...state,
                video: {
                    ...state.video,
                    id: action.id,
                },
            };
        }
        case "setDeviceIds": {
            return {
                ...state,
                video: {
                    ...state.video,
                    id: action.videoId,
                },
                voice: {
                    ...state.voice,
                    id: action.audioId,
                },
            };
        }
        case "setMidiDeviceId": {
            return {
                ...state,
                midi: {
                    ...state.midi,
                    id: action.id,
                },
            };
        }
        case "toggleVoice": {
            return {
                ...state,
                voice: {
                    ...state.voice,
                    enabled: !state.voice?.enabled,
                },
            };
        }
        case "toggleVideo": {
            return {
                ...state,
                video: {
                    ...state.video,
                    enabled: !state.video?.enabled,
                },
            };
        }
        case "toggleMidi": {
            return {
                ...state,
                midi: {
                    ...state.midi,
                    enabled: !state.midi?.enabled,
                },
            };
        }
        case "setInstrumentType": {
            return {
                ...state,
                instrumentType: action.instrumentType,
            };
        }
        default: {
            throw new Error(`Unhandled action type`);
        }
    }
}

function DeviceProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = React.useReducer(deviceReducer, {
        voice: {
            enabled: false,
        },
        video: {
            enabled: true,
        },
        midi: {
            enabled: false,
        },
        instrumentType: "keyboard",
    });
    // NOTE: you *might* need to memoize this value
    // Learn more in http://kcd.im/optimize-context
    const value = { state, dispatch };
    return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
}

function useDevice() {
    const context = React.useContext(DeviceContext);
    if (context === undefined) {
        throw new Error("useDevice must be used within a DeviceProvider");
    }
    return context.state;
}

function useDeviceDispatcher(): React.Dispatch<Action> {
    const context = React.useContext(DeviceContext);
    if (context === undefined) {
        throw new Error("usePeers must be used within a PeersProvider");
    }

    return context.dispatch;
}

export { DeviceProvider, useDevice, useDeviceDispatcher };

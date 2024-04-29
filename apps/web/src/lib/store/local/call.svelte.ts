import type { WebRTCHandler } from "$lib/sockets/WebRTCHandler.svelte";
import { getContext, setContext } from "svelte";

const STORE_NAME = "call";

export type CallContext = {
    selectedMidiInputId: string | null;
    isVideoEnabled: boolean;
    isMicrophoneEnabled: boolean;
    isMidiEnabled: boolean;
    webRTCHandler: WebRTCHandler;
    callId: string;
};

export function createCallStore(initial: CallContext) {
    let selectedMidiInputId = $state<string | null>(initial.selectedMidiInputId);
    let isVideoEnabled = $state<boolean>(initial.isVideoEnabled);
    let isMicrophoneEnabled = $state<boolean>(initial.isMicrophoneEnabled);
    let isMidiEnabled = $state<boolean>(initial.isMidiEnabled);
    let webRTCHandler = $state(initial.webRTCHandler);

    const callId = initial.callId;

    setContext(STORE_NAME, {
        callId,
        get selectedMidiInputId() {
            return selectedMidiInputId;
        },
        set selectedMidiInputId(value) {
            selectedMidiInputId = value;
        },

        get isVideoEnabled() {
            return isVideoEnabled;
        },
        set isVideoEnabled(value) {
            isVideoEnabled = value;
        },

        get isMicrophoneEnabled() {
            return isMicrophoneEnabled;
        },
        set isMicrophoneEnabled(value) {
            isMicrophoneEnabled = value;
        },

        get isMidiEnabled() {
            return isMidiEnabled;
        },
        set isMidiEnabled(value) {
            isMidiEnabled = value;
        },

        get webRTCHandler() {
            return webRTCHandler;
        },
        set webRTCHandler(value) {
            webRTCHandler = value;
        },
    });
}

export function getCallStore() {
    return getContext<CallContext>(STORE_NAME);
}

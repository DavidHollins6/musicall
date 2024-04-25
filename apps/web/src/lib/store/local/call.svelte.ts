import type { PeerConnection } from "$lib/sockets/PeerConnection.svelte";
import { getContext, setContext } from "svelte";

const STORE_NAME = "call";

export type CallContext = {
    selectedMidiInputId: string | null;
    isVideoEnabled: boolean;
    isMicrophoneMuted: boolean;
    isMidiEnabled: boolean;
    peerConnection: PeerConnection;
    callId: string;
};

export function createCallStore(initial: CallContext) {
    let selectedMidiInputId = $state<string | null>(initial.selectedMidiInputId);
    let isVideoEnabled = $state<boolean>(initial.isVideoEnabled);
    let isMicrophoneMuted = $state<boolean>(initial.isMicrophoneMuted);
    let isMidiEnabled = $state<boolean>(initial.isMidiEnabled);
    let peerConnection = $state(initial.peerConnection);

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

        get isMicrophoneMuted() {
            return isMicrophoneMuted;
        },
        set isMicrophoneMuted(value) {
            isMicrophoneMuted = value;
        },

        get isMidiEnabled() {
            return isMidiEnabled;
        },
        set isMidiEnabled(value) {
            isMidiEnabled = value;
        },

        get peerConnection() {
            return peerConnection;
        },
        set peerConnection(value) {
            peerConnection = value;
        },
    });
}

export function getCallStore() {
    return getContext<CallContext>(STORE_NAME);
}

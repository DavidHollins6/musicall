import type { WebRTCHandler } from "$lib/sockets/WebRTCHandler";
import Peer from "simple-peer";
import { getContext, setContext } from "svelte";

const STORE_NAME = "call";

type Inputs = {
    midi: {
        id: string | null;
        enabled: boolean;
    };
    video: {
        id: string | null;
        enabled: boolean;
    };
    microphone: {
        id: string | null;
        enabled: boolean;
    };
};

type PeerConnection = {
    peerConnection: Peer.Instance;
    userId: string;
    connected: boolean;
    stream?: MediaStream;
    inputs: {
        midi: boolean;
        video: boolean;
        microphone: boolean;
    };
};

export type Context = {
    inputs: Inputs;
    webRTCHandler: WebRTCHandler;
    callId: string;
    localStream: MediaStream | null;
    peers: Record<string, PeerConnection>;
};

export function createCallStore(initial: Context) {
    let inputs = $state<Inputs>(initial.inputs);
    let webRTCHandler = $state(initial.webRTCHandler);
    let localStream = $state(initial.localStream);

    const callId = initial.callId;

    setContext(STORE_NAME, {
        callId,
        get inputs() {
            return inputs;
        },
        set inputs(value) {
            inputs = value;
        },

        get webRTCHandler() {
            return webRTCHandler;
        },
        set webRTCHandler(value) {
            webRTCHandler = value;
        },

        get localStream() {
            return localStream;
        },
        set localStream(value) {
            localStream = value;
        },
    });
}

export function getCallStore() {
    return getContext<Context>(STORE_NAME);
}

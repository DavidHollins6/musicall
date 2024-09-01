import { User } from "@musicall/storage";
import * as React from "react";
import Peer from "simple-peer";

type PeerData = {
    peerConnection: Peer.Instance;
    user: User;
    peerId: string;
    microphoneEnabled: boolean;
    cameraEnabled: boolean;
    midiEnabled: boolean;
    stream?: MediaStream;
    connected: boolean;
};

type ChatMessage = {
    from: User;
    message: string;
    timestamp: number;
};

type State = {
    peers: Record<string, PeerData>;
    localStream?: MediaStream;
    waitingList: Array<string>;
    chatMessages: Array<ChatMessage>;
};

type Action =
    | { type: "addPeer"; peerId: string; data: PeerData }
    | { type: "removePeer"; peerId: string }
    | { type: "setLocalStream"; localStream: MediaStream }
    | { type: "sendData"; message: string }
    | { type: "setWaitingList"; waitingList: Array<string> }
    | { type: "addChatMessage"; message: ChatMessage }
    | { type: "setPeerStream"; peerId: string; stream: MediaStream }
    | { type: "updateDeviceStatus"; peerId: string; voice: boolean; video: boolean; midi: boolean };

const PeersContext = React.createContext<{ state: State; dispatch: React.Dispatch<Action> }>({
    state: {
        peers: {},
        waitingList: [],
        chatMessages: [],
    },
    dispatch: () => undefined,
});

function peersReducer(state: State, action: Action) {
    switch (action.type) {
        case "addPeer": {
            return {
                ...state,
                peers: {
                    ...state.peers,
                    [action.peerId]: action.data,
                },
            };
        }
        case "removePeer": {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [action.peerId]: _, ...remainingPeers } = state.peers;
            return {
                ...state,
                peers: remainingPeers,
            };
        }
        case "setLocalStream": {
            console.log("setting local stream");
            return {
                ...state,
                localStream: action.localStream,
            };
        }
        case "setPeerStream": {
            return {
                ...state,
                peers: {
                    ...state.peers,
                    [action.peerId]: {
                        ...state.peers[action.peerId],
                        stream: action.stream,
                    },
                },
            };
        }
        case "sendData": {
            Object.keys(state.peers).forEach((k) => {
                const peer = state.peers[k];

                console.log("gonna send message");

                peer.peerConnection.send(action.message);
            });
            return state;
        }
        case "setWaitingList": {
            return { ...state, waitingList: action.waitingList };
        }
        case "addChatMessage": {
            return { ...state, chatMessages: [...state.chatMessages, action.message] };
        }
        case "updateDeviceStatus": {
            return {
                ...state,
                peers: {
                    ...state.peers,
                    [action.peerId]: {
                        ...state.peers[action.peerId],
                        microphoneEnabled: action.voice,
                        cameraEnabled: action.video,
                        midiEnabled: action.midi,
                    },
                },
            };
        }
        default: {
            throw new Error(`Unhandled action type`);
        }
    }
}

function PeersProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = React.useReducer(peersReducer, {
        peers: {},
        waitingList: [],
        chatMessages: [],
    });
    // NOTE: you *might* need to memoize this value
    // Learn more in http://kcd.im/optimize-context
    const value = { state, dispatch };
    return <PeersContext.Provider value={value}>{children}</PeersContext.Provider>;
}

function usePeers(): State {
    const context = React.useContext(PeersContext);
    if (context === undefined) {
        throw new Error("usePeers must be used within a PeersProvider");
    }
    return context.state;
}

function usePeersDispatcher(): React.Dispatch<Action> {
    const context = React.useContext(PeersContext);
    if (context === undefined) {
        throw new Error("usePeers must be used within a PeersProvider");
    }

    return context.dispatch;
}

export { PeersProvider, usePeers, usePeersDispatcher };

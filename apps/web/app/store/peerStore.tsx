import { User } from "@musicall/storage";
import Peer from "simple-peer";
import { create } from "zustand";
import { produce } from "immer";

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

type Actions = {
    addPeer: (peerId: string, data: PeerData) => void;
    removePeer: (peerId: string) => void;
    setLocalStream: (localStream: MediaStream) => void;
    setWaitingList: (waitingList: Array<string>) => void;
    addChatMessage: (message: ChatMessage) => void;
    setPeerStream: (peerId: string, stream: MediaStream) => void;
    updateDeviceStatus: (peerId: string, voice: boolean, video: boolean, midi: boolean) => void;
};

export const usePeerStore = create<State & Actions>((set) => ({
    peers: {},
    waitingList: [],
    chatMessages: [],
    addPeer: (peerId, data) => {
        set(
            produce((state: State) => {
                state.peers[peerId] = data;
            }),
        );
    },
    removePeer: (peerId) => {
        set(
            produce((state: State) => {
                delete state.peers[peerId];
            }),
        );
    },
    setLocalStream: (localStream) => {
        set(
            produce((state: State) => {
                state.localStream = localStream;
            }),
        );
    },
    setWaitingList: (waitingList) => {
        set(
            produce((state: State) => {
                state.waitingList = waitingList;
            }),
        );
    },
    addChatMessage: (message) => {
        set(
            produce((state: State) => {
                state.chatMessages.push(message);
            }),
        );
    },
    setPeerStream: (peerId, stream) => {
        set(
            produce((state: State) => {
                state.peers[peerId].stream = stream;
            }),
        );
    },
    updateDeviceStatus: (peerId, voice, video, midi) => {
        set(
            produce((state: State) => {
                state.peers[peerId].microphoneEnabled = voice;
                state.peers[peerId].cameraEnabled = video;
                state.peers[peerId].midiEnabled = midi;
            }),
        );
    },
}));

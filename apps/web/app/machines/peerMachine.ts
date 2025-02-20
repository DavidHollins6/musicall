import { useSelector } from "@xstate/react";
import { assign, createActor, setup } from "xstate";
import { createDataMessage, DataMessage } from "@musicall/types/dataMessage";
import { PeerData } from "../types/PeerData";

export const peerMachine = setup({
    types: {} as {
        context: {
            peers: Record<string, PeerData>;
            waitingList: Array<{ name: string; userId: string }>;
        };
        events:
            | {
                  type: "peer.addPeer";
                  peer: PeerData;
              }
            | { type: "peer.removePeer"; peerId: string }
            | { type: "peer.setStream"; peerId: string; stream: MediaStream }
            | { type: "peer.toggleVideo"; enabled: boolean; localStream: MediaStream }
            | { type: "peer.toggleAudio"; enabled: boolean; localStream: MediaStream }
            | { type: "peer.sendData"; peerId: string; message: DataMessage }
            | { type: "peer.sendDataToAll"; message: DataMessage; exclude?: Array<string> }
            | { type: "peer.setWaitingList"; waitingList: Array<{ name: string; userId: string }> }
            | {
                  type: "peer.setDeviceStatus";
                  peerId: string;
                  microphoneEnabled: boolean;
                  cameraEnabled: boolean;
                  midiEnabled: boolean;
              };
    },
}).createMachine({
    id: "peer",
    context: {
        peers: {},
        waitingList: [],
    },
    initial: "connected",
    states: {
        connected: {
            on: {
                "peer.addPeer": {
                    actions: assign(({ context, event }) => ({
                        peers: { ...context.peers, [event.peer.peerId]: { ...event.peer } },
                    })),
                },
                "peer.setStream": {
                    actions: assign(({ context, event }) => {
                        const peer = context.peers[event.peerId];
                        if (!peer) {
                            return {};
                        }

                        return {
                            peers: { ...context.peers, [event.peerId]: { ...peer, stream: event.stream } },
                        };
                    }),
                },
                "peer.sendData": {
                    actions: ({ context, event }) => {
                        const peer = context.peers[event.peerId];
                        if (peer) {
                            peer.peerConnection.send(
                                createDataMessage({ type: "midi", message: event.message.message }),
                            );
                        }
                    },
                },
                "peer.sendDataToAll": {
                    actions: ({ context, event }) => {
                        const peersToSendTo =
                            event.exclude && event.exclude.length > 0
                                ? Object.keys(context.peers).filter((pId) => event.exclude?.includes(pId))
                                : Object.keys(context.peers);
                        peersToSendTo.forEach((pId) => {
                            const peer = context.peers[pId];
                            if (peer) {
                                peer.peerConnection.send(
                                    createDataMessage({ type: "midi", message: event.message.message }),
                                );
                            }
                        });
                    },
                },
                "peer.removePeer": {
                    actions: assign(({ context, event }) => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { [event.peerId]: value, ...remainingPeers } = context.peers;

                        return {
                            peers: remainingPeers,
                        };
                    }),
                },
                "peer.setWaitingList": {
                    actions: assign(({ event }) => ({
                        waitingList: event.waitingList,
                    })),
                },
                "peer.setDeviceStatus": {
                    actions: assign(({ context, event }) => ({
                        peers: {
                            ...context.peers,
                            [event.peerId]: {
                                ...context.peers[event.peerId],
                                cameraEnabled: event.cameraEnabled,
                                microphoneEnabled: event.microphoneEnabled,
                                midiEnabled: event.midiEnabled,
                            },
                        },
                    })),
                },
            },
        },
    },
});

export const peerActor = createActor(peerMachine);

export const usePeerStateMachine = () => {
    const state = useSelector(peerActor, (state) => state);

    return {
        ...state,
        send: peerActor.send,
    };
};

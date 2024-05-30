import { type SyncData } from "$lib/sockets/DataMessageSchema";
import { getCallStore } from "$lib/store/local/call.svelte";

export const useMaintainPeers = () => {
    const callStore = getCallStore();

    callStore.webRTCHandler.onPeerFound = (userId, peer) => {
        callStore.peers[userId] = {
            connected: false,
            inputs: {
                microphone: false,
                midi: false,
                video: false,
            },
            peerConnection: peer,
            userId,
        };
    };

    callStore.webRTCHandler.onPeerDisconnected = (userId) => {
        delete callStore.peers[userId];
    };

    callStore.webRTCHandler.onPeerConnected = (userId) => {
        callStore.peers[userId].connected = true;
    };

    callStore.webRTCHandler.onStreamReceived = (userId, stream) => {
        callStore.peers[userId].stream = stream;
    };


};

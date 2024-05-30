import { DataMessageSchema } from "$lib/sockets/DataMessageSchema";
import { getCallStore } from "$lib/store/local/call.svelte";

export const usePeerCommunication = ({ handlers: Handlers }) => {
    const callStore = getCallStore();
    const subscriptions = {};

    callStore.webRTCHandler.onDataMessageReceived = (userId, message) => {
        const parsedData = DataMessageSchema.safeParse(JSON.parse(message));

        if (parsedData.success) {
            switch (parsedData.data.type) {
                case "midi":
                    if (this.onMidiMessageReceived)
                        this.onMidiMessageReceived(parsedData.data.event, parsedData.data.from);
                    break;
                case "call":
                    this.peers[parsedData.data.from].cameraEnabled = parsedData.data.data.video;
                    this.peers[parsedData.data.from].microphoneEnabled = parsedData.data.data.microphone;
                    break;
                case "initial-sync":
                    this.peers[parsedData.data.from].connected = true;
                    this.peers[parsedData.data.from].cameraEnabled = parsedData.data.data.video;
                    this.peers[parsedData.data.from].microphoneEnabled = parsedData.data.data.microphone;
                    break;
            }
        }
    };

    const send = (message: string) => {
        Object.keys(callStore.peers).forEach((k) => {
            callStore.peers[k].peerConnection.send(JSON.stringify(message));
        });
    };

    const subscribe = (type: string, handler: () => void) => {
        subscriptions[type]
    };

    return {
        send,
    };
};

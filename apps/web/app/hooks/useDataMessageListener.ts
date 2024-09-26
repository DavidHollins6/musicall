import { DataMessageSchema } from "@musicall/types/dataMessage";
import { useEffect, useRef } from "react";
import { usePeerStore } from "../store/peerStore";
import { useEffectEvent } from "./useEffectEvent";
import { KeyboardSoundManager } from "../utils/sound/KeyboardSoundManager";

export const useDataMessageListener = () => {
    const { peers } = usePeerStore();
    const soundManager = useRef(new KeyboardSoundManager());

    const onMessageRecieved = useEffectEvent((message: Uint8Array) => {
        const messageString = new TextDecoder().decode(message);
        const messageObject = JSON.parse(messageString);

        const result = DataMessageSchema.safeParse(messageObject);

        if (!result.success) {
            console.log("could not parse", result);
            return;
        }

        switch (result.data.type) {
            case "midi":
                soundManager.current.handleMidiEvent(result.data.message);
                break;
        }
    });

    useEffect(() => {
        Object.keys(peers).forEach((pId) => {
            const peer = peers[pId];
            peer.peerConnection.removeListener("data", onMessageRecieved);
            peer.peerConnection.addListener("data", onMessageRecieved);
        });
    }, [peers]);
};

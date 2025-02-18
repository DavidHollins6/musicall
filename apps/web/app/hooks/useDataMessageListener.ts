import { DataMessageSchema } from "@musicall/types/dataMessage";
import { useEffect, useRef } from "react";
import { useEffectEvent } from "./useEffectEvent";
import { KeyboardSoundManager } from "../utils/sound/KeyboardSoundManager";
import { usePeerStateMachine } from "../machines/peerMachine";

export const useDataMessageListener = () => {
    const peerStateMachine = usePeerStateMachine();
    const soundManager = useRef(new KeyboardSoundManager());

    const onMessageRecieved = useEffectEvent((message: Uint8Array) => {
        const messageString = new TextDecoder().decode(message);
        const messageObject = JSON.parse(messageString);

        const result = DataMessageSchema.safeParse(messageObject);

        if (!result.success) {
            console.error("could not parse", result);
            return;
        }

        switch (result.data.type) {
            case "midi":
                soundManager.current.handleMidiEvent(result.data.message);
                break;
        }
    });

    useEffect(() => {
        Object.keys(peerStateMachine.context.peers).forEach((pId) => {
            const peer = peerStateMachine.context.peers[pId];
            peer.peerConnection.removeListener("data", onMessageRecieved);
            peer.peerConnection.addListener("data", onMessageRecieved);
        });
    }, [peerStateMachine.context.peers]);
};

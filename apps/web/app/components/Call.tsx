import { MessageEvent } from "webmidi";
import { createDataMessage } from "@musicall/types/dataMessage";
import { usePeerStore } from "../store/peerStore";
import { useDataMessageListener } from "../hooks/useDataMessageListener";
import { useMidiListener } from "../hooks/useMidiListener";
import { useWebRTC } from "../hooks/useWebRTC";
import { useUserStore } from "../store/userStore";
import { useDeviceStore } from "../store/deviceStore";

export const Call = ({ roomId, children }: { roomId: string; children: React.ReactNode }) => {
    const { user } = useUserStore();
    const { peers } = usePeerStore();
    const { midi } = useDeviceStore();

    useWebRTC({ room: roomId, userId: user.id });
    useDataMessageListener();
    useMidiListener((e: MessageEvent) => {
        if (midi.enabled) {
            Object.keys(peers).forEach((pId) => {
                const peer = peers[pId];
                peer.peerConnection.send(createDataMessage({ type: "midi", message: e.message }));
            });
        }
    });
    return children;
};

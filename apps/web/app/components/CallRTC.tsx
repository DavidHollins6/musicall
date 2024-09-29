import { useDataMessageListener } from "../hooks/useDataMessageListener";
import { useDeviceListener } from "../hooks/useDeviceListener";
import { useDataMessageMidiListener } from "../hooks/useDataMessageMidiListener";
import { useWebRTC } from "../hooks/useWebRTC";
import { useUserStore } from "../store/userStore";

export const CallRTC = ({ roomId }: { roomId: string }) => {
    const { user } = useUserStore();

    useWebRTC({ room: roomId, userId: user.id });
    useDeviceListener();
    useDataMessageListener();
    useDataMessageMidiListener();
    return null;
};

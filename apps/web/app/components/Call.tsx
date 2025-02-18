import { useWebRTC } from "../hooks/useWebRTC";
import { useUserStore } from "../store/userStore";

export const Call = ({ roomId, children }: { roomId: string; children: React.ReactNode }) => {
    const { user } = useUserStore();

    useWebRTC({ room: roomId, userId: user.id });
    return children;
};

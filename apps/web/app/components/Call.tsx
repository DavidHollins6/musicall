import { useWebRTC } from "../hooks/useWebRTC";
import { useUserStore } from "../store/userStore";

export const Call = ({
    roomId,
    socketUrl,
    children,
}: {
    roomId: string;
    children: React.ReactNode;
    socketUrl?: string;
}) => {
    const { user } = useUserStore();

    useWebRTC({ room: roomId, userId: user.id, socketUrl });
    return children;
};

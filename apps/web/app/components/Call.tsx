import { useWebRTC } from "../hooks/useWebRTC";
import { useUserStore } from "../store/userStore";

export const Call = ({
    roomId,
    children,
    isOwner,
}: {
    roomId: string;
    children: React.ReactNode;
    isOwner: boolean;
}) => {
    const { user } = useUserStore();

    useWebRTC({ roomId: roomId, userId: user.id, isOwner });
    return children;
};

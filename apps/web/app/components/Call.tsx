import { socketActor } from "../machines/socketStateMachine.client";
import { useWebRTC } from "../hooks/useWebRTC";
import { useUserStore } from "../store/userStore";
import { useEffect } from "react";

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

    useEffect(() => {
        socketActor.start();
    }, []);

    useWebRTC({ roomId: roomId, userId: user.id, isOwner });
    return children;
};

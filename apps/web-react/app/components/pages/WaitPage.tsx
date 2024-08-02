import { usePartySocket } from "partysocket/react";

type Props = {
    userId: string;
    roomId: string;
};

export const WaitPage = ({ roomId, userId }: Props) => {
    const socket = usePartySocket({
        room: roomId,
        host: "localhost:1999",
        onMessage() {},
    });

    socket.onopen = () => {
        socket.send(
            JSON.stringify({
                type: "join-waiting-room",
                userId,
            }),
        );
    };

    return <div>Waiting Room</div>;
};

import { usePartySocket } from "partysocket/react";
import { useState } from "react";
import { z } from "zod";

type Props = {
    userId: string;
    roomId: string;
    allowedIntoRoom: boolean;
};

const MessageSchema = z.object({
    type: z.literal("allow-into-room"),
});

export const WaitPage = ({ roomId, userId, allowedIntoRoom }: Props) => {
    const [allowed, setAllowed] = useState(allowedIntoRoom);

    const socket = usePartySocket({
        room: roomId,
        host: "localhost:1999",
        onMessage(evt) {
            const result = MessageSchema.safeParse(JSON.parse(String(evt.data)));

            if (!result.success) {
                console.log("could not parse", result);
                return;
            }

            if (result.data.type === "allow-into-room") {
                setAllowed(true);
            }
        },
    });

    socket.onopen = () => {
        socket.send(
            JSON.stringify({
                type: "join-waiting-room",
                userId,
            }),
        );
    };

    return <div>Waiting Room {allowed ? "ALLOWED" : "NOT ALLOWED"}</div>;
};

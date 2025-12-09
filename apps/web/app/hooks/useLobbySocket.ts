import { useEffect } from "react";
import { socketActor, useSocketStateMachine } from "../machines/socketStateMachine";
import { socket } from "../utils/socket/socket";

export function useLobbySocket(roomId: string, userId: string, userName: string, onAllowed?: () => void) {
    const socketStateMachine = useSocketStateMachine();
    const socketConnected = socketStateMachine.matches("connected");

    useEffect(() => {
        socketActor.start();
        socketStateMachine.send({ type: "socket.connect" });
    }, []);

    useEffect(() => {
        if (socketConnected) {
            socketStateMachine.send({
                type: "socket.sendMessage",
                message: { type: "join-lobby", name: userName, userId: userId, roomId: roomId },
            });

            socket.on("allow-into-room", () => {
                onAllowed?.();
                console.log("Allowed into room");
            });
        }
    }, [socketConnected]);
}

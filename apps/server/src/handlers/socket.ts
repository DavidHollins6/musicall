import NodeCache from "node-cache";
import { createClientMessage } from "@musicall/types/clientMessage";
import { getUser } from "@musicall/api/user";
import { User } from "@musicall/storage";
import { Server } from "socket.io";

export const socketHandlers = (io: Server, cache: NodeCache) => {
    io.on("connection", (socket) => {
        console.log("a user connected");

        socket.on("allow-into-room", (payload: { userId: string; roomId: string }) => {
            const waiters = cache.get<Array<{ userId: string; name: string }>>(`waiters-${payload.roomId}`);
            const newWaiters = (waiters || []).filter((w) => w.userId !== payload.userId);
            cache.set(`waiters-${payload.roomId}`, newWaiters);

            const allowedPeople = cache.get<Array<string>>(`allowed-${payload.roomId}`) || [];
            allowedPeople.push(payload.userId);
            cache.set(`allowed-${payload.roomId}`, allowedPeople);

            const message = createClientMessage({
                type: "lobby-updated",
                waiters: newWaiters,
            });

            socket.broadcast.to(`owner-${payload.roomId}`).emit("lobby-updated", message);
            socket.broadcast
                .to(`lobby-${payload.roomId}`)
                .emit("allow-into-room", { userId: payload.userId, roomId: payload.roomId });
        });

        socket.on("leave-lobby", ({ roomId }: { roomId: string }) => {
            socket.leave(`lobby-${roomId}`);
        });

        socket.on("join-lobby", ({ userId, name, roomId }: { userId: string; name: string; roomId: string }) => {
            const waiters = cache.get<Array<{ userId: string; name: string }>>(`waiters-${roomId}`);
            const newWaiters = [...(waiters || []), { userId, name }];
            cache.set(`waiters-${roomId}`, newWaiters);
            socket.join(`lobby-${roomId}`);

            const message = createClientMessage({
                type: "lobby-updated",
                waiters: newWaiters,
            });

            socket.broadcast.to(`owner-${roomId}`).emit("lobby-updated", message);
        });

        socket.on(
            "join-room",
            async ({
                userId,
                voice,
                video,
                midi,
                roomId,
            }: {
                userId: string;
                roomId: string;
                voice: boolean;
                video: boolean;
                midi: boolean;
            }) => {
                const user = await getUser(userId);

                if (!user) {
                    return;
                }

                const roomName = `room-${roomId}`;
                const otherSocketIds = io.sockets.adapter.rooms.get(roomName) || new Set();

                otherSocketIds.forEach((otherSocketId) => {
                    const participantData = cache.get<{ user: User; socketId: string }>(otherSocketId);
                    if (participantData) {
                        const message = createClientMessage({
                            type: "peer",
                            peerId: otherSocketId,
                            initiator: false,
                            user: participantData.user,
                        });
                        socket.emit("peer", message); // Send directly to the sender
                    }
                });

                cache.set(socket.id, { userId, user, voice, video, midi });

                socket.join(roomName);

                const message = createClientMessage({
                    type: "peer",
                    peerId: socket.id,
                    initiator: true,
                    user: user,
                    voice,
                    video,
                    midi,
                });

                socket.to(roomName).emit("peer", message);
            },
        );

        socket.on("join-room-owner", async ({ roomId }: { roomId: string }) => {
            socket.join(`owner-${roomId}`);
        });

        socket.on("signal", ({ signal, roomId, userId }) => {
            const message = createClientMessage({
                type: "signal",
                signal: signal,
                peerId: socket.id,
                userId: userId,
            });

            socket.broadcast.to(`room-${roomId}`).emit("signal", message);
        });

        socket.on(
            "chat",
            ({
                roomId,
                message,
                from,
                timestamp,
            }: {
                roomId: string;
                message: string;
                from: User;
                timestamp: number;
            }) => {
                socket.broadcast
                    .to(`room-${roomId}`)
                    .emit("chat", createClientMessage({ type: "chat", message: message, from, timestamp }));
            },
        );

        socket.on(
            "update-device-status",
            ({ voice, video, midi, roomId }: { voice: boolean; video: boolean; midi: boolean; roomId: string }) => {
                const message = createClientMessage({
                    type: "update-device-status",
                    peerId: socket.id,
                    voice,
                    video,
                    midi,
                });

                socket.broadcast.to(`room-${roomId}`).emit("update-device-status", message);
            },
        );

        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    });
};

import NodeCache from "node-cache";
import { createClientMessage } from "@musicall/types/clientMessage";
import { Server } from "socket.io";
import type { ClerkClient, User } from "@clerk/backend";

type Waiter = {
    userId: string;
    name: string;
    allowed: boolean;
    socketId: string;
};

export const socketHandlers = (io: Server, cache: NodeCache, clerk: ClerkClient) => {
    io.on("connection", (socket) => {
        console.log("a user connected");

        socket.on("allow-into-room", (payload: { userId: string; roomId: string }) => {
            console.log("Allowing user into room:", payload);
            const waiters = cache.get<Array<Waiter>>(`waiters-${payload.roomId}`);
            const waiter = waiters?.find((w) => w.userId === payload.userId);
            if (!waiter) {
                console.log("No such waiter found");
                return;
            }

            const newWaiters: Array<Waiter> = [
                ...(waiters?.filter((w) => w.userId !== payload.userId) || []),
                { userId: payload.userId, name: waiter.name, allowed: true, socketId: waiter.socketId },
            ];

            cache.set(`waiters-${payload.roomId}`, newWaiters);

            const message = createClientMessage({
                type: "lobby-updated",
                waiters: newWaiters,
            });

            io.to(`owner-${payload.roomId}`).emit("lobby-updated", message);
            socket
                .to(`lobby-${payload.roomId}`)
                .emit("allow-into-room", { userId: payload.userId, roomId: payload.roomId });
        });

        socket.on("leave-lobby", ({ roomId }: { roomId: string }) => {
            socket.leave(`lobby-${roomId}`);
        });

        socket.on("join-lobby", ({ userId, name, roomId }: { userId: string; name: string; roomId: string }) => {
            const allowedPeople = cache.get<Array<string>>(`allowed-${roomId}`) || [];
            if (allowedPeople.includes(userId)) {
                // User is allowed, do not add to waiters
                return;
            }

            const waiters = cache.get<Array<Waiter>>(`waiters-${roomId}`);
            const existingWaiters = waiters || [];
            const newWaiters = existingWaiters.some((w) => w.userId === userId)
                ? existingWaiters
                : [...existingWaiters, { userId, name, allowed: false, socketId: socket.id }];
            cache.set(`waiters-${roomId}`, newWaiters);
            socket.join(`lobby-${roomId}`);

            const message = createClientMessage({
                type: "lobby-updated",
                waiters: newWaiters,
            });

            socket.to(`owner-${roomId}`).emit("lobby-updated", message);
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
                const user = await clerk.users.getUser(userId);

                if (!user) {
                    return;
                }

                const roomName = `room-${roomId}`;
                const otherSocketIds = io.sockets.adapter.rooms.get(roomName) || new Set();

                otherSocketIds.forEach((otherSocketId) => {
                    if (otherSocketId === socket.id) {
                        return;
                    }
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

        socket.on("join-owners-room", async ({ roomId }: { roomId: string }) => {
            const waiters = cache.get<Array<Waiter>>(`waiters-${roomId}`);

            socket.join(`owner-${roomId}`);
            const message = createClientMessage({
                type: "lobby-updated",
                waiters: waiters || [],
            });

            io.in(`owner-${roomId}`).emit("lobby-updated", message);
        });

        socket.on("signal", ({ signal, roomId, userId }) => {
            const message = createClientMessage({
                type: "signal",
                signal: signal,
                peerId: socket.id,
                userId: userId,
            });

            socket.to(`room-${roomId}`).emit("signal", message);
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
                socket
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

                socket.to(`room-${roomId}`).emit("update-device-status", message);
            },
        );

        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    });
};

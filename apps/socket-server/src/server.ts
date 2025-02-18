import type * as Party from "partykit/server";
import { allowUserIntoRoom, getRoom } from "@musicall/api/room";
import { User } from "@musicall/storage";
import { getUser } from "@musicall/api/user";
import { createClientMessage } from "@musicall/types/clientMessage";
import { ServerMessageSchema } from "@musicall/types/serverMessage";

type Participant = {
    connection: Party.Connection;
    user: User;
    voice: boolean;
    video: boolean;
    midi: boolean;
};

export default class WebSocketServer implements Party.Server {
    participants: Array<Participant> = [];
    waiters: Array<Party.Connection> = [];
    waiterUserIdsMap: Array<{ userId: string; connectionId: string; name: string }> = [];
    owner?: Party.Connection;
    roomOwnerId?: string;

    constructor(readonly room: Party.Room) {}
    async onMessage(message: string, sender: Party.Connection) {
        const result = ServerMessageSchema.safeParse(JSON.parse(message));

        if (!result.success) return;

        switch (result.data.type) {
            case "allow-into-room": {
                await allowUserIntoRoom(result.data.userId, this.room.id);
                const userId = result.data.userId;
                const userConnection = this.waiterUserIdsMap.find((w) => w.userId === userId);

                if (userConnection) {
                    const connection = this.room.getConnection(userConnection.connectionId);
                    const message = createClientMessage({ type: "allow-into-room" });
                    connection?.send(message);
                }

                this.waiters = this.waiters.filter((w) => w.id !== userConnection?.connectionId);
                this.waiterUserIdsMap = this.waiterUserIdsMap.filter(
                    (w) => w.connectionId !== userConnection?.connectionId,
                );

                const message = createClientMessage({
                    type: "lobby-updated",
                    waiters: this.waiterUserIdsMap.map((w) => ({ userId: w.userId, name: w.name })),
                });
                this.owner?.send(message);
                break;
            }

            case "join-lobby": {
                this.waiters.push(sender);
                this.waiterUserIdsMap.push({
                    userId: result.data.userId,
                    connectionId: sender.id,
                    name: result.data.name,
                });

                const message = createClientMessage({
                    type: "lobby-updated",
                    waiters: this.waiterUserIdsMap.map((w) => ({ userId: w.userId, name: w.name })),
                });

                this.owner?.send(message);
                break;
            }

            case "join-room": {
                const user = await getUser(result.data.userId);

                if (!user) {
                    break;
                }

                if (this.roomOwnerId && this.roomOwnerId === result.data.userId) {
                    const message = createClientMessage({
                        type: "lobby-updated",
                        waiters: this.waiterUserIdsMap.map((w) => ({ userId: w.userId, name: w.name })),
                    });

                    sender.send(message);

                    this.owner = sender;
                }

                const voice = result.data.voice;
                const video = result.data.video;
                const midi = result.data.midi;

                // Send myself to all of the other peers
                this.participants.forEach((participant) => {
                    const message = createClientMessage({
                        type: "peer",
                        peerId: sender.id,
                        initiator: true,
                        user: user,
                        voice,
                        video,
                        midi,
                    });
                    participant.connection.send(message);
                });

                this.participants.forEach((participant) => {
                    if (participant.connection.id !== sender.id) {
                        const message = createClientMessage({
                            type: "peer",
                            peerId: participant.connection.id,
                            initiator: false,
                            user: participant.user,
                            voice: participant.voice,
                            video: participant.video,
                            midi: participant.midi,
                        });
                        sender.send(message);
                    }
                });

                this.participants.push({
                    connection: sender,
                    user,
                    voice,
                    video,
                    midi,
                });
                break;
            }

            case "signal": {
                const connections = Array.from(this.room.getConnections());
                const peerId = result.data.peerId;

                const message = createClientMessage({
                    type: "signal",
                    signal: result.data.signal,
                    peerId: sender.id,
                    userId: result.data.userId,
                });

                this.room.broadcast(
                    message,
                    connections.filter((c) => c.id !== peerId).map((c) => c.id),
                );
                break;
            }

            case "chat": {
                const message = createClientMessage(result.data);
                this.room.broadcast(message);
                break;
            }

            case "update-device-status": {
                const newVoice = result.data.voice;
                const newVideo = result.data.video;
                const newMidi = result.data.midi;
                this.participants.forEach((p) => {
                    if (p.connection.id === sender.id) {
                        p.voice = newVoice;
                        p.video = newVideo;
                        p.midi = newMidi;
                    }
                });

                this.participants.forEach((p) => {
                    if (p.connection.id !== sender.id) {
                        const message = createClientMessage({
                            type: "update-device-status",
                            peerId: sender.id,
                            voice: newVoice,
                            video: newVideo,
                            midi: newMidi,
                        });
                        p.connection.send(message);
                    }
                });
                break;
            }
        }
    }

    async onStart() {
        const room = await getRoom(this.room.id);

        if (room) {
            this.roomOwnerId = room.ownerId;
        }
    }

    async onClose(connection: Party.Connection) {
        console.log("person left");
        const waiterUser = this.waiterUserIdsMap.find((w) => w.connectionId === connection.id);

        if (waiterUser) {
            this.waiterUserIdsMap = this.waiterUserIdsMap.filter((w) => w.connectionId !== waiterUser.connectionId);

            this.waiters = this.waiters.filter((w) => w.id !== waiterUser.connectionId);

            const message = createClientMessage({
                type: "lobby-updated",
                waiters: this.waiterUserIdsMap.map((w) => ({ userId: w.userId, name: w.name })),
            });

            this.owner?.send(message);

            const leavingMessage = createClientMessage({
                type: "client-left",
                peerId: connection.id,
            });

            this.participants.forEach((participant) => {
                if (participant.connection.id !== connection.id) {
                    connection.send(leavingMessage);
                }
            });
        }

        this.participants = this.participants.filter((p) => p.connection.id !== connection.id);
    }
}

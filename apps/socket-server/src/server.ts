import type * as Party from "partykit/server";
import type { SignalData } from "simple-peer";
import { allowUserIntoRoom, getRoom } from "@musicall/api/room";
import z from "zod";
import { User } from "@musicall/storage/types";
import { getUser } from "@musicall/api/user";

const MessageSchema = z
    .object({
        type: z.literal("signal"),
        signal: z.custom<SignalData>(),
        peerId: z.string(),
        userId: z.string(),
    })
    .or(
        z.object({
            type: z.literal("join-room"),
            userId: z.string(),
            voice: z.boolean(),
            video: z.boolean(),
            midi: z.boolean(),
        }),
    )
    .or(z.object({ type: z.literal("allow-into-room"), userId: z.string() }))
    .or(z.object({ type: z.literal("join-waiting-room"), userId: z.string() }))
    .or(
        z.object({
            type: z.literal("chat"),
            message: z.string(),
            from: z.custom<User>(),
            timestamp: z.number(),
        }),
    )
    .or(
        z.object({
            type: z.literal("update-device-status"),
            voice: z.boolean(),
            video: z.boolean(),
            midi: z.boolean(),
        }),
    );

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
    waiterUserIdsMap: Array<{ userId: string; connectionId: string }> = [];
    owner?: Party.Connection;
    roomOwnerId?: string;

    constructor(readonly room: Party.Room) {}
    async onMessage(message: string, sender: Party.Connection) {
        const result = MessageSchema.safeParse(JSON.parse(message));

        if (!result.success) return;

        switch (result.data.type) {
            case "allow-into-room": {
                await allowUserIntoRoom(result.data.userId, this.room.id);
                const userId = result.data.userId;
                const userConnection = this.waiterUserIdsMap.find((w) => w.userId === userId);

                if (userConnection) {
                    const connection = this.room.getConnection(userConnection.connectionId);
                    connection?.send(JSON.stringify({ type: "allow-into-room" }));
                }

                this.waiters = this.waiters.filter((w) => w.id !== userConnection?.connectionId);
                this.waiterUserIdsMap = this.waiterUserIdsMap.filter(
                    (w) => w.connectionId !== userConnection?.connectionId,
                );

                console.log("WAITERS: ", this.waiterUserIdsMap, this.waiters);

                this.owner?.send(
                    JSON.stringify({
                        type: "waiting-room-updated",
                        waiters: this.waiterUserIdsMap.map((w) => w.userId),
                    }),
                );
                break;
            }

            case "join-waiting-room": {
                console.log("SOMEONE JOINED WAITING ROOM");

                this.waiters.push(sender);
                this.waiterUserIdsMap.push({
                    userId: result.data.userId,
                    connectionId: sender.id,
                });

                this.owner?.send(
                    JSON.stringify({
                        type: "waiting-room-updated",
                        waiters: this.waiterUserIdsMap.map((w) => w.userId),
                    }),
                );
                break;
            }

            case "join-room": {
                const user = await getUser(result.data.userId);

                if (this.roomOwnerId && this.roomOwnerId === result.data.userId) {
                    console.log("THE OWNER HAS JOINED");
                    sender.send(
                        JSON.stringify({
                            type: "waiting-room-updated",
                            waiters: this.waiterUserIdsMap.map((w) => w.userId),
                        }),
                    );

                    this.owner = sender;
                }

                console.log("someone has joined", sender.id, result.data.userId);
                const voice = result.data.voice;
                const video = result.data.video;
                const midi = result.data.midi;

                // Send myself to all of the other peers
                this.participants.forEach((participant) => {
                    participant.connection.send(
                        JSON.stringify({
                            type: "peer",
                            peerId: sender.id,
                            initiator: true,
                            user: user,
                            voice,
                            video,
                            midi,
                        }),
                    );
                });

                this.participants.forEach((participant) => {
                    if (participant.connection.id !== sender.id) {
                        console.log("send their peer id to me: ", sender.id, participant.connection.id);
                        sender.send(
                            JSON.stringify({
                                type: "peer",
                                peerId: participant.connection.id,
                                initiator: false,
                                user: participant.user,
                                voice: participant.voice,
                                video: participant.video,
                                midi: participant.midi,
                            }),
                        );
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

                this.room.broadcast(
                    JSON.stringify({
                        type: "signal",
                        signal: result.data.signal,
                        peerId: sender.id,
                        userId: result.data.userId,
                    }),
                    connections.filter((c) => c.id !== peerId).map((c) => c.id),
                );
                break;
            }

            case "chat": {
                console.log("got a chat!!!", result.data);
                this.room.broadcast(JSON.stringify(result.data));
                break;
            }

            case "update-device-status": {
                console.log(result.data);
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
                        p.connection.send(
                            JSON.stringify({
                                type: "update-device-status",
                                peerId: sender.id,
                                voice: newVoice,
                                video: newVideo,
                                midi: newMidi,
                            }),
                        );
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
        const waiterUser = this.waiterUserIdsMap.find((w) => w.connectionId === connection.id);

        if (waiterUser) {
            this.waiterUserIdsMap = this.waiterUserIdsMap.filter((w) => w.connectionId !== waiterUser.connectionId);

            this.waiters = this.waiters.filter((w) => w.id !== waiterUser.connectionId);

            this.owner?.send(
                JSON.stringify({
                    type: "waiting-room-updated",
                    waiters: this.waiterUserIdsMap.map((w) => w.userId),
                }),
            );
        }

        this.participants = this.participants.filter((p) => p.connection.id !== connection.id);
    }
}

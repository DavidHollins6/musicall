import type * as Party from "partykit/server";
import type { SignalData } from "simple-peer";
import { allowUserIntoRoom, getRoom } from "@musicall/api/room";
import z from "zod";

const MessageSchema = z
  .object({
    type: z.literal("signal"),
    signal: z.custom<SignalData>(),
    peerId: z.string(),
    userId: z.string(),
  })
  .or(z.object({ type: z.literal("join-room"), userId: z.string() }))
  .or(z.object({ type: z.literal("allow-into-room"), userId: z.string() }))
  .or(z.object({ type: z.literal("join-waiting-room"), userId: z.string() }))
  .or(
    z.object({
      type: z.literal("chat"),
      message: z.string(),
      from: z.string(),
      timestamp: z.number(),
    })
  );

export default class WebSocketServer implements Party.Server {
  participants: Array<Party.Connection> = [];
  waiters: Array<Party.Connection> = [];
  waiterUserIdsMap: Array<{ userId: string; connectionId: string }> = [];
  owner?: Party.Connection;
  roomOwnerId?: string;

  constructor(readonly room: Party.Room) {}
  async onMessage(message: string, sender: Party.Connection) {
    const result = MessageSchema.safeParse(JSON.parse(message));

    if (!result.success) return;

    if (result.data.type === "allow-into-room") {
      await allowUserIntoRoom(result.data.userId, this.room.id);
      const userId = result.data.userId;
      const userConnection = this.waiterUserIdsMap.find(
        (w) => w.userId === userId
      );

      if (userConnection) {
        const connection = this.room.getConnection(userConnection.connectionId);
        connection?.send(JSON.stringify({ type: "allow-into-room" }));
      }
    }

    if (result.data.type === "join-waiting-room") {
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
        })
      );
    }

    if (result.data.type === "join-room") {
      if (this.roomOwnerId && this.roomOwnerId === result.data.userId) {
        console.log("THE OWNER HAS JOINED");
        sender.send(
          JSON.stringify({
            type: "waiting-room-updated",
            waiters: this.waiterUserIdsMap.map((w) => w.userId),
          })
        );

        this.owner = sender;
      }

      console.log("someone has joined", sender.id, result.data.userId);
      const senderUserId = result.data.userId;
      this.participants.forEach((participant) => {
        participant.send(
          JSON.stringify({
            type: "peer",
            peerId: sender.id,
            initiator: true,
            userId: senderUserId,
          })
        );
      });

      this.participants.forEach((participant) => {
        if (participant.id !== sender.id) {
          console.log("send their peer id to me: ", sender.id);
          sender.send(
            JSON.stringify({
              type: "peer",
              peerId: participant.id,
              initiator: false,
              userId: senderUserId,
            })
          );
        }
      });

      this.participants.push(sender);
    }

    if (result.data.type === "signal") {
      const connections = Array.from(this.room.getConnections());
      const peerId = result.data.peerId;

      this.room.broadcast(
        JSON.stringify({
          type: "signal",
          signal: result.data.signal,
          peerId: sender.id,
          userId: result.data.userId,
        }),
        connections.filter((c) => c.id !== peerId).map((c) => c.id)
      );
    }

    if (result.data.type === "chat") {
      this.room.broadcast(JSON.stringify(result.data));
    }
  }

  async onStart() {
    const room = await getRoom(this.room.id);

    if (room) {
      this.roomOwnerId = room.ownerId;
    }
  }

  async onClose(connection: Party.Connection) {
    const waiterUser = this.waiterUserIdsMap.find(
      (w) => w.connectionId === connection.id
    );

    if (waiterUser) {
      this.waiterUserIdsMap = this.waiterUserIdsMap.filter(
        (w) => w.connectionId !== waiterUser.connectionId
      );

      this.waiters = this.waiters.filter(
        (w) => w.id !== waiterUser.connectionId
      );

      this.owner?.send(
        JSON.stringify({
          type: "waiting-room-updated",
          waiters: this.waiterUserIdsMap.map((w) => w.userId),
        })
      );
    }
  }
}

import type * as Party from "partykit/server";
import type { SignalData } from "simple-peer";
import z from "zod";
import { db } from "./database/db";
import { rooms } from "./database/schema";
import { eq } from "drizzle-orm";
import { redis } from "./cache/redis";

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
      await redis.set(`allow-${this.room.id}-${result.data.userId}`, "", {
        EX: 30 * 60,
      });
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
      console.log("room owner Id", this.roomOwnerId);
      if (this.roomOwnerId && this.roomOwnerId === result.data.userId) {
        console.log("NEED TO SET THE OWNER IN STORAGE");
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
    const roomsResult = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, this.room.id));

    console.log("room starting!!!", roomsResult[0].ownerId);

    if (roomsResult.length === 1) {
      this.roomOwnerId = roomsResult[0].ownerId;
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

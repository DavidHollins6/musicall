import type * as Party from "partykit/server";
import type { SignalData } from "simple-peer";
import z from "zod";

const MessageSchema = z
  .object({
    type: z.literal("signal"),
    signal: z.custom<SignalData>(),
    peerId: z.string(),
  })
  .or(z.object({ type: z.literal("join-room"), userId: z.string() }));

export default class WebSocketServer implements Party.Server {
  constructor(readonly room: Party.Room) {}
  async onMessage(message: string, sender: Party.Connection) {
    const result = MessageSchema.safeParse(JSON.parse(message));

    if (!result.success) return;

    if (result.data.type === "join-room") {
      console.log("someone has joined", sender.id, result.data.userId);
      this.room.broadcast(
        JSON.stringify({
          type: "peer",
          peerId: sender.id,
          initiator: true,
          userId: result.data.userId,
        }),
        [sender.id]
      );

      for (const peer of this.room.getConnections()) {
        if (peer.id !== sender.id) {
          console.log("send their peer id to me: ", sender.id);
          sender.send(
            JSON.stringify({
              type: "peer",
              peerId: peer.id,
              initiator: false,
              userId: result.data.userId,
            })
          );
        }
      }
    }

    if (result.data.type === "signal") {
      const connections = Array.from(this.room.getConnections());
      const peerId = result.data.peerId;

      this.room.broadcast(
        JSON.stringify({
          type: "signal",
          signal: result.data.signal,
          peerId: sender.id,
        }),
        connections.filter((c) => c.id !== peerId).map((c) => c.id)
      );
    }
  }

  async onConnect(connection: Party.Connection) {
    // return onConnect(connection, this.room, {});
  }
}

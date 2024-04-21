import type * as Party from "partykit/server";
import type { SignalData } from "simple-peer";
import z from "zod";

const MessageSchema = z.object({
  type: z.literal("signal"),
  signal: z.custom<SignalData>(),
  peerId: z.string(),
});

export default class WebSocketServer implements Party.Server {
  constructor(readonly room: Party.Room) {}
  onMessage(message: string, sender: Party.Connection) {
    const result = MessageSchema.safeParse(JSON.parse(message));

    if (!result.success) return;

    if (result.data.type === "signal") {
      const recipient = this.room.getConnection(result.data.peerId);

      if (!recipient) return;

      recipient.send(
        JSON.stringify({
          type: "signal",
          signal: result.data.signal,
          peerId: sender.id,
        })
      );
    }
  }

  async onConnect(connection: Party.Connection, ctx: Party.ConnectionContext) {
    this.room.broadcast(
      JSON.stringify({
        type: "peer",
        peerId: connection.id,
        initiator: true,
      }),
      [connection.id]
    );

    for (const peer of this.room.getConnections()) {
      if (peer.id !== connection.id) {
        connection.send(
          JSON.stringify({ type: "peer", peerId: peer.id, initiator: false })
        );
      }
    }
  }
}

import PartySocket from "partysocket";
import Peer, { type SignalData } from "simple-peer";
import { z } from "zod";

const USE_TRICKLE = true;
const CONFIG = {
    iceServers: [
        { urls: ["STUN:freeturn.net:3478", "STUN:freeturn.net:5349"] },
        {
            urls: "TURN:freeturn.net:3478",
            username: "free",
            credential: "free",
        },
        {
            urls: "TURN:freeturn.net:5349",
            username: "free",
            credential: "free",
        },
        {
            urls: "turn:openrelay.metered.ca:80",
            username: "openrelayproject",
            credential: "openrelayproject",
        },
    ],
};

const MessageSchema = z
    .object({
        type: z.literal("signal"),
        signal: z.custom<SignalData>(),
        peerId: z.string(),
    })
    .or(
        z.object({
            type: z.literal("peer"),
            peerId: z.string(),
            initiator: z.boolean(),
            userId: z.string(),
        }),
    )
    .or(
        z.object({
            type: z.literal("chat"),
            message: z.string(),
            from: z.string(),
            timestamp: z.number(),
        }),
    );

export class WebRTCHandler {
    socket;
    private peers: Record<string, Peer.Instance>;
    onPeerConnected?: (userId: string) => void;
    onPeerFound?: (userId: string, peer: Peer.Instance) => void;
    onStreamReceived?: (userId: string, stream: MediaStream) => void;
    onPeerDisconnected?: (userId: string) => void;
    onDataMessageReceived?: (userId: string, message: string) => void;

    constructor(socket: PartySocket, userId: string) {
        this.socket = socket;
        this.peers = {};

        this.startHandlingMessages();

        this.socket.send(
            JSON.stringify({
                type: "join-room",
                userId,
            }),
        );
    }

    private startHandlingMessages() {
        this.socket.onmessage = (event: MessageEvent) => {
            const result = MessageSchema.safeParse(JSON.parse(String(event.data)));

            if (!result.success) {
                console.log("could not parse", result);
                return;
            }

            if (result.data.type === "peer") {
                const peerId = result.data.peerId;

                this.addPeer(peerId, result.data.initiator, result.data.userId);
            }

            if (result.data.type === "signal") {
                this.peers[result.data.peerId].signal(result.data.signal);
            }
        };
    }

    private addPeer(id: string, initiator: boolean, userId: string) {
        this.peers[id] = new Peer({
            initiator: initiator,
            config: CONFIG,
            trickle: USE_TRICKLE,
        });

        if (this.onPeerFound) {
            this.onPeerFound(userId, this.peers[id]);
        }

        this.peers[id].on("signal", (data) => {
            this.socket.send(
                JSON.stringify({
                    type: "signal",
                    signal: data,
                    peerId: id,
                }),
            );
        });

        this.peers[id].on("connect", () => {
            if (this.onPeerConnected) {
                this.onPeerConnected(userId);
            }
        });

        this.peers[id].on("end", () => {
            this.removePeer(id);
            if (this.onPeerDisconnected) {
                this.onPeerDisconnected(userId);
            }
        });

        this.peers[id].on("stream", (stream) => {
            if (this.onStreamReceived) {
                this.onStreamReceived(userId, stream);
            }
        });

        this.peers[id].on("data", (data) => {
            const message = new TextDecoder().decode(data);
            if (this.onDataMessageReceived) {
                this.onDataMessageReceived(userId, message);
            }
        });
    }

    private removePeer(id: string) {
        if (this.peers[id]) {
            this.peers[id].destroy();
            delete this.peers[id];
        }
    }
}

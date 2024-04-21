import PartySocket from "partysocket";
import Peer, { type SignalData } from "simple-peer";
import { createSocket } from "./partysockets.svelte";
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
        }),
    );

export class PeerConnection {
    localStream = $state<MediaStream>();
    otherStreams = $state<Record<string, MediaStream>>({});
    socket = $state<PartySocket>();
    peers = $state<Record<string, Peer.Instance>>({});
    peer = $state<Peer.Instance>();
    videoDeviceId = $state<string>();
    audioDeviceId = $state<string>();
    checkedUserMediaPermissions = $state<boolean>(false);
    onDataReceived: ((msg: string) => void) | null = null;

    constructor(roomId: string) {
        this.socket = createSocket(roomId);

        this.socket.onmessage = (event: MessageEvent) => {
            const result = MessageSchema.safeParse(JSON.parse(String(event.data)));

            if (!result.success) return;

            if (result.data.type === "peer") {
                const peerId = result.data.peerId;
                console.log("peer connected", peerId);

                this.addPeer(event.data.peerId, false);

                // this.peer.on("signal", (data) => {
                //     console.log("Advertising signalling data", data, "to Peer ID:", peerId);

                //     this.socket?.send(
                //         JSON.stringify({
                //             type: "signal",
                //             signal: data,
                //             peerId: peerId,
                //         }),
                //     );
                // });

                // this.peer.on("connect", () => {
                //     console.log("Peer connection established");
                //     if (this.yourStream) {
                //         this.yourStream?.getTracks().forEach((t) => {
                //             this.peer?.addTrack(t, this.yourStream as MediaStream);
                //         });
                //     }
                // });
            }

            if (result.data.type === "signal") {
                console.log("Received signalling data", result.data.peerId, "from Peer ID:", result.data.peerId);
                this.peers[result.data.peerId].signal(result.data.signal);
            }
        };

        navigator.mediaDevices
            .getUserMedia({
                video: {
                    width: { min: 640, ideal: 1920, max: 1920 },
                    height: { min: 480, ideal: 1080, max: 1080 },
                },
                audio: true,
            })
            .then(async (stream) => {
                const videoDeviceId = stream.getVideoTracks()[0]?.getSettings().deviceId;
                const audioDeviceId = stream.getAudioTracks()[0]?.getSettings().deviceId;

                if (videoDeviceId && audioDeviceId) {
                    this.videoDeviceId = videoDeviceId;
                    this.audioDeviceId = audioDeviceId;

                    this.setVideoInput(videoDeviceId);
                    this.setAudioInput(audioDeviceId);

                    this.checkedUserMediaPermissions = true;
                }
            })
            .catch(() => {
                this.checkedUserMediaPermissions = true;
            });
    }

    addPeer(id: string, initiator: boolean) {
        console.log("making new peer");
        this.peers[id] = new Peer({
            initiator: initiator,
            stream: this.localStream,
            config: CONFIG,
        });

        this.peers[id].on("signal", (data) => {
            console.log("Advertising signalling data", data, "to Peer ID:", id);

            this.socket?.send(
                JSON.stringify({
                    type: "signal",
                    signal: data,
                    peerId: id,
                }),
            );
        });

        this.peers[id].on("stream", (stream) => {
            this.otherStreams[id] = stream;
        });

        this.peers[id].on("data", (data) => {
            const string = new TextDecoder().decode(data);
            if (this.onDataReceived) {
                this.onDataReceived(string);
            }
        });
    }

    removePeer(id: string) {
        if (this.peers[id]) {
            this.peers[id].destroy();
            delete this.peers[id];
        }
    }

    sendData(msg: string) {
        Object.keys(this.peers).forEach((k) => {
            this.peers[k].send(msg);
        });
    }

    async setVideoInput(deviceId: string) {
        this.videoDeviceId = deviceId;
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                deviceId,
                width: { min: 640, ideal: 1920, max: 1920 },
                height: { min: 480, ideal: 1080, max: 1080 },
            },
        });

        stream.getVideoTracks().forEach((t) => {
            this.peer?.addTrack(t, stream);
        });

        this.yourStream = stream;
    }

    async setAudioInput(deviceId: string) {
        this.audioDeviceId = deviceId;
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                deviceId,
            },
        });

        stream.getAudioTracks().forEach((t) => {
            this.peer?.addTrack(t, stream);
        });

        this.yourStream = stream;
    }

    async toggleCamera(enabled: boolean) {
        const videoTrack = this.yourStream?.getTracks().find((track) => track.kind === "video");

        if (videoTrack) {
            videoTrack.enabled = enabled;
        }
    }

    async toggleMic(enabled: boolean) {
        const audioTrack = this.yourStream?.getTracks().find((track) => track.kind === "audio");

        if (audioTrack) {
            audioTrack.enabled = enabled;
        }
    }
}

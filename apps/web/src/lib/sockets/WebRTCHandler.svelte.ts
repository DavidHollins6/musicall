import PartySocket from "partysocket";
import Peer, { type SignalData } from "simple-peer";
import { type MessageEvent as MidiMessageEvent } from "webmidi";
import { z } from "zod";
import { DataMessageSchema, type DataMessage } from "./DataMessageSchema";

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
    );

export class WebRTCHandler {
    localStream = $state<MediaStream>(new MediaStream());
    socket;
    peers = $state<
        Record<
            string,
            {
                peerConnection: Peer.Instance;
                userId: string;
                microphoneEnabled: boolean;
                cameraEnabled: boolean;
                stream?: MediaStream;
                connected: boolean;
            }
        >
    >({});
    localVideoDeviceId = $state<string>();
    localAudioDeviceId = $state<string>();
    checkedUserMediaPermissions = $state<boolean>(false);
    onMidiMessageReceived: ((event: MidiMessageEvent["message"], from: string) => void) | null = null;
    onChatMessageReceived: ((event: string, from: string, timestamp: number) => void) | null = null;

    constructor(socket: PartySocket, userId: string) {
        this.socket = socket;

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
                this.localStream = stream;
                this.toggleMic(false);

                if (videoDeviceId && audioDeviceId) {
                    this.localVideoDeviceId = videoDeviceId;
                    this.localAudioDeviceId = audioDeviceId;
                    this.checkedUserMediaPermissions = true;
                }

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
                        this.peers[result.data.peerId].peerConnection.signal(result.data.signal);
                    }
                };

                this.socket.send(
                    JSON.stringify({
                        type: "join-room",
                        userId,
                    }),
                );
            })
            .catch(() => {
                console.error("there was an error here for some reason");
                this.checkedUserMediaPermissions = true;
            });
    }

    addPeer(id: string, initiator: boolean, userId: string) {
        this.peers[id] = {
            userId,
            peerConnection: new Peer({
                initiator: initiator,
                config: CONFIG,
                trickle: USE_TRICKLE,
                stream: this.localStream,
            }),
            cameraEnabled: false,
            microphoneEnabled: false,
            connected: false,
        };

        this.peers[id].peerConnection.on("signal", (data) => {
            this.socket.send(
                JSON.stringify({
                    type: "signal",
                    signal: data,
                    peerId: id,
                }),
            );
        });

        this.peers[id].peerConnection.on("connect", () => {
            Object.keys(this.peers).forEach((k) => {
                if (this.peers[k].peerConnection.streams.length === 0) {
                    this.peers[k].peerConnection.addStream(this.localStream);
                }
            });

            this.sendData({
                type: "initial-sync",
                data: {
                    microphone: false,
                    video: true,
                },
                from: this.socket.id,
            });
        });

        this.peers[id].peerConnection.on("end", () => {
            this.removePeer(id);
        });

        this.peers[id].peerConnection.on("stream", (stream) => {
            this.peers[id].stream = stream;
        });

        this.peers[id].peerConnection.on("data", (data) => {
            const string = new TextDecoder().decode(data);
            const parsedData = DataMessageSchema.safeParse(JSON.parse(string));

            if (parsedData.success) {
                switch (parsedData.data.type) {
                    case "midi":
                        if (this.onMidiMessageReceived)
                            this.onMidiMessageReceived(parsedData.data.event, parsedData.data.from);
                        break;
                    case "call":
                        this.peers[parsedData.data.from].cameraEnabled = parsedData.data.data.video;
                        this.peers[parsedData.data.from].microphoneEnabled = parsedData.data.data.microphone;
                        break;
                    case "initial-sync":
                        this.peers[parsedData.data.from].connected = true;
                        this.peers[parsedData.data.from].cameraEnabled = parsedData.data.data.video;
                        this.peers[parsedData.data.from].microphoneEnabled = parsedData.data.data.microphone;
                        break;
                    case "chat":
                        if (this.onChatMessageReceived)
                            this.onChatMessageReceived(
                                parsedData.data.message,
                                parsedData.data.from,
                                parsedData.data.timestamp,
                            );
                        break;
                }
            }
        });
    }

    removePeer(id: string) {
        if (this.peers[id]) {
            this.peers[id].peerConnection.destroy();
            delete this.peers[id];
        }
    }

    sendData(msg: DataMessage) {
        Object.keys(this.peers).forEach((k) => {
            this.peers[k].peerConnection.send(JSON.stringify(msg));
        });
    }

    async setVideoInput(deviceId: string) {
        this.localVideoDeviceId = deviceId;
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                deviceId,
                width: { min: 640, ideal: 1920, max: 1920 },
                height: { min: 480, ideal: 1080, max: 1080 },
            },
        });

        stream.getVideoTracks().forEach((t) => {
            Object.keys(this.peers).forEach((k) => {
                this.peers[k].peerConnection.addTrack(t, stream);
            });
        });

        this.localStream = stream;
    }

    async setAudioInput(deviceId: string) {
        this.localVideoDeviceId = deviceId;
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                deviceId,
            },
        });

        stream.getAudioTracks().forEach((t) => {
            Object.keys(this.peers).forEach((k) => {
                this.peers[k].peerConnection.addTrack(t, stream);
            });
        });

        this.localStream = stream;
    }

    async toggleCamera(enabled: boolean) {
        const videoTrack = this.localStream?.getTracks().find((track) => track.kind === "video");

        if (videoTrack) {
            videoTrack.enabled = enabled;
        }
    }

    async toggleMic(enabled: boolean) {
        const audioTrack = this.localStream?.getTracks().find((track) => track.kind === "audio");

        if (audioTrack) {
            audioTrack.enabled = enabled;
        }
    }

    getPeer(peerId: string) {
        const peer = this.peers[peerId];
        if (!peer) {
            return null;
        }

        return peer;
    }
}

import Peer from "simple-peer";
import { io } from "socket.io-client";

const USE_TRICKLE = true;

export class PeerConnection {
    yourStream = $state<MediaStream>();
    theirStream = $state<MediaStream>();
    socket = $state(io("localhost:3000"));
    peers = $state<Record<string, Peer.Instance>>({});
    peer = $state<Peer.Instance>();
    videoDeviceId = $state<string>();
    audioDeviceId = $state<string>();
    checkedUserMediaPermissions = $state<boolean>(false);
    onDataReceived: ((msg: string) => void) | null = null;

    connect(roomId: string) {
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

        this.socket.on("connect", () => {
            this.socket.emit("join-room", { roomId });
            console.log("Connected to signalling server, Peer ID: %s", this.socket.id);
        });

        this.socket.on("peer", (data: { peerId: string; initiator: boolean }) => {
            const peerId = data.peerId;
            this.peer = new Peer({
                initiator: data.initiator,
                trickle: USE_TRICKLE,
                config: {
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
                },
            });

            console.log("Peer available for connection discovered from signalling server, Peer ID: %s", peerId);

            this.socket.on("signal", (data: { peerId: string; signal: string | Peer.SignalData }) => {
                if (data.peerId == peerId) {
                    console.log("Received signalling data", data, "from Peer ID:", peerId);
                    this.peer?.signal(data.signal);
                }
            });

            this.peer.on("signal", (data) => {
                console.log("Advertising signalling data", data, "to Peer ID:", peerId);
                this.socket.emit("signal", {
                    signal: data,
                    peerId: peerId,
                });
            });
            this.peer.on("error", (e) => {
                console.log("Error sending connection to peer %s:", peerId, e);
            });

            this.peer.on("connect", () => {
                console.log("Peer connection established");
                if (this.yourStream) {
                    this.yourStream?.getTracks().forEach((t) => {
                        this.peer?.addTrack(t, this.yourStream as MediaStream);
                    });
                }
            });
            this.peer.on("data", (data) => {
                const string = new TextDecoder().decode(data);
                if (this.onDataReceived) {
                    this.onDataReceived(string);
                }
            });

            this.peer.on("stream", (stream) => {
                // got remote video stream, now let's show it in a video tag
                this.theirStream = stream;
            });

            this.peers[peerId] = this.peer;
        });
    }

    sendData(msg: string) {
        this.peer?.send(msg);
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

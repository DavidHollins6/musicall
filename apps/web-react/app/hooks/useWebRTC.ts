import { useEffect } from "react";
import { usePartySocket } from "partysocket/react";
import Peer, { type SignalData } from "simple-peer";
import z from "zod";
import { usePeers, usePeersDispatcher } from "../store/peersContext";
import { useDevice, useDeviceDispatcher } from "../store/deviceContext";
import { useMessageHandler } from "./useMessageHandler";

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

type Props = {
    room: string;
    userId: string;
};

const MessageSchema = z
    .object({
        type: z.literal("signal"),
        signal: z.custom<SignalData>(),
        peerId: z.string(),
        userId: z.string(),
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
            type: z.literal("waiting-room-updated"),
            waiters: z.string().array(),
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

export const useWebRTC = ({ room, userId }: Props) => {
    const { peers, localStream } = usePeers();
    const peersDispatch = usePeersDispatcher();

    const deviceDispatch = useDeviceDispatcher();
    const messageHandler = useMessageHandler();
    const { voice, video } = useDevice();

    const socket = usePartySocket({
        room: room,
        host: "localhost:1999",
        onMessage(evt) {
            const result = MessageSchema.safeParse(JSON.parse(String(evt.data)));

            if (!result.success) {
                console.log("could not parse", result);
                return;
            }

            if (result.data.type === "peer") {
                addPeer(result.data.peerId, result.data.initiator, result.data.userId);
            }

            if (result.data.type === "signal") {
                console.log("got a signal, ", result);
                peers[result.data.peerId].peerConnection.signal(result.data.signal);
            }

            if (result.data.type === "waiting-room-updated") {
                console.log("someone joined the waiting room!", result.data);
                peersDispatch({ type: "setWaitingList", waitingList: result.data.waiters });
            }

            if (result.data.type === "chat") {
                peersDispatch({ type: "addChatMessage", message: result.data });
            }
        },
    });

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({
                video: {
                    width: { min: 640, ideal: 1920, max: 1920 },
                    height: { min: 480, ideal: 1080, max: 1080 },
                },
                audio: true,
            })
            .then(async (stream) => {
                stream.getAudioTracks().forEach((track) => (track.enabled = voice.enabled));
                stream.getVideoTracks().forEach((track) => (track.enabled = video.enabled));
                peersDispatch({ type: "setLocalStream", localStream: stream });
                const videoDeviceId = stream.getVideoTracks()[0]?.getSettings().deviceId;
                const audioDeviceId = stream.getAudioTracks()[0]?.getSettings().deviceId;

                if (videoDeviceId && audioDeviceId) {
                    deviceDispatch({ type: "setVideoDeviceId", id: videoDeviceId });
                    deviceDispatch({ type: "setAudioDeviceId", id: audioDeviceId });
                }

                socket.send(
                    JSON.stringify({
                        type: "join-room",
                        userId,
                    }),
                );
            })
            .catch((e) => {
                console.error("there was an error here for some reason", e);
                socket.send(
                    JSON.stringify({
                        type: "join-room",
                        userId,
                    }),
                );
            });
    }, []);

    const addPeer = (peerId: string, initiator: boolean, peerUserId: string) => {
        const peerConnection = new Peer({
            initiator: initiator,
            config: CONFIG,
            trickle: USE_TRICKLE,
            stream: localStream,
        });

        peerConnection.on("signal", (data) => {
            socket.send(
                JSON.stringify({
                    type: "signal",
                    signal: data,
                    peerId,
                    userId: userId,
                }),
            );
        });

        peerConnection.on("error", (e) => {
            console.log(e);
        });

        peerConnection.on("connect", () => {
            console.log("peer connected");
            Object.keys(peers).forEach((k) => {
                if (peers[k].peerConnection.streams.length === 0 && localStream) {
                    peers[k].peerConnection.addStream(localStream);
                }
            });

            // this.sendData({
            //     type: "initial-sync",
            //     data: {
            //         microphone: false,
            //         video: true,
            //     },
            //     from: this.socket.id,
            // });
        });

        peerConnection.on("close", () => {
            if (peers[peerUserId]) {
                peerConnection.destroy();
            }
            peersDispatch({ type: "removePeer", peerId });
        });

        peerConnection.on("stream", (stream) => {
            peersDispatch({ type: "setPeerStream", stream, peerId });
        });

        // this.peers[id].peerConnection.on("data", (data) => {
        //     const string = new TextDecoder().decode(data);
        //     const parsedData = DataMessageSchema.safeParse(JSON.parse(string));

        //     if (parsedData.success) {
        //         switch (parsedData.data.type) {
        //             case "midi":
        //                 if (this.onMidiMessageReceived)
        //                     this.onMidiMessageReceived(parsedData.data.event, parsedData.data.from);
        //                 break;
        //             case "call":
        //                 this.peers[parsedData.data.from].cameraEnabled = parsedData.data.data.video;
        //                 this.peers[parsedData.data.from].microphoneEnabled = parsedData.data.data.microphone;
        //                 break;
        //             case "initial-sync":
        //                 this.peers[parsedData.data.from].connected = true;
        //                 this.peers[parsedData.data.from].cameraEnabled = parsedData.data.data.video;
        //                 this.peers[parsedData.data.from].microphoneEnabled = parsedData.data.data.microphone;
        //                 break;
        //         }
        //     }
        // });

        peerConnection.on("data", (message) => {
            const string = new TextDecoder().decode(message);
            messageHandler(string);
        });

        peersDispatch({
            type: "addPeer",
            data: {
                cameraEnabled: false,
                connected: false,
                microphoneEnabled: false,
                peerConnection,
                peerId,
                userId: peerUserId,
            },
            peerId,
        });
    };

    return { socket };
};

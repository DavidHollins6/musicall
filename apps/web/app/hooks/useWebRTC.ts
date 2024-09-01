import { usePartySocket } from "partysocket/react";
import Peer, { type SignalData } from "simple-peer";
import z from "zod";
import { usePeers, usePeersDispatcher } from "../store/peersContext";
import { useDevice, useDeviceDispatcher } from "../store/deviceContext";
import { useMessageHandler } from "./useMessageHandler";
import { useCamera } from "./useCamera";
import { useEffect } from "react";
import { useMicrophone } from "./useMicrophone";
import { User } from "@musicall/storage/types";

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
            user: z.custom<User>(),
            voice: z.boolean(),
            video: z.boolean(),
            midi: z.boolean(),
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
            from: z.custom<User>(),
            timestamp: z.number(),
        }),
    )
    .or(
        z.object({
            type: z.literal("update-device-status"),
            peerId: z.string(),
            voice: z.boolean(),
            video: z.boolean(),
            midi: z.boolean(),
        }),
    );

export const useWebRTC = ({ room, userId }: Props) => {
    const { peers, localStream } = usePeers();
    const peersDispatch = usePeersDispatcher();
    const deviceDispatch = useDeviceDispatcher();

    const messageHandler = useMessageHandler();
    const { voice, video, midi } = useDevice();
    const { getStreamById: getVideoStreamById, getDefaultId: getVideoDefaultId } = useCamera();
    const { getStreamById: getAudioStreamById, getDefaultId: getAudioDefaultId } = useMicrophone();

    useEffect(() => {
        socket.send(
            JSON.stringify({
                type: "join-room",
                userId,
                voice: voice.enabled,
                video: video.enabled,
                midi: midi.enabled,
            }),
        );
    }, []);

    useEffect(() => {
        const initializeIds = async () => {
            await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            const videoDeviceId = await getVideoDefaultId();
            const audioDeviceId = await getAudioDefaultId();

            if (videoDeviceId && audioDeviceId) {
                deviceDispatch({ type: "setDeviceIds", videoId: videoDeviceId, audioId: audioDeviceId });
            }
        };

        initializeIds();
    }, []);

    useEffect(() => {
        if (localStream) {
            Object.keys(peers).forEach((pId) => {
                const peer = peers[pId];
                peer.peerConnection.addStream(localStream);
            });
        }
    }, [localStream]);

    useEffect(() => {
        const initializeStream = async () => {
            if (!video.id || !voice.id) {
                return;
            }

            const videoStream = await getVideoStreamById(video.id);
            const audioStream = await getAudioStreamById(voice.id);

            const newLocalStream = new MediaStream();

            if (videoStream) {
                console.log("enabled", video.enabled);
                videoStream.getVideoTracks().forEach((track) => {
                    track.enabled = video.enabled;
                    newLocalStream.addTrack(track);
                });
            }

            if (audioStream) {
                audioStream.getAudioTracks().forEach((track) => {
                    track.enabled = voice.enabled;
                    newLocalStream.addTrack(track);
                });
            }
            peersDispatch({ type: "setLocalStream", localStream: newLocalStream });
        };

        initializeStream();
    }, [video.id, voice.id]);

    const socket = usePartySocket({
        room: room,
        host: "localhost:1999",
        onMessage(evt) {
            const result = MessageSchema.safeParse(JSON.parse(String(evt.data)));

            if (!result.success) {
                console.log("could not parse", result);
                return;
            }

            switch (result.data.type) {
                case "peer":
                    addPeer(
                        result.data.peerId,
                        result.data.initiator,
                        result.data.user,
                        result.data.voice,
                        result.data.video,
                        result.data.midi,
                    );
                    break;
                case "signal":
                    peers[result.data.peerId].peerConnection.signal(result.data.signal);
                    break;
                case "waiting-room-updated":
                    console.log("someone joined the waiting room!", result.data);
                    peersDispatch({ type: "setWaitingList", waitingList: result.data.waiters });
                    break;
                case "chat":
                    peersDispatch({ type: "addChatMessage", message: result.data });
                    break;
                case "update-device-status":
                    peersDispatch({
                        type: "updateDeviceStatus",
                        peerId: result.data.peerId,
                        voice: result.data.voice,
                        video: result.data.video,
                        midi: result.data.midi,
                    });
                    break;
            }
        },
    });

    const addPeer = (peerId: string, initiator: boolean, user: User, voice: boolean, video: boolean, midi: boolean) => {
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
            console.error(e);
        });

        peerConnection.on("connect", () => {
            console.log("peer connected");
            Object.keys(peers).forEach((k) => {
                if (peers[k].peerConnection.streams.length === 0 && localStream) {
                    peers[k].peerConnection.addStream(localStream);
                }
            });
        });

        peerConnection.on("close", () => {
            console.log("it has closed!!");
            if (peers[user.id]) {
                peerConnection.destroy();
            }
            peersDispatch({ type: "removePeer", peerId });
        });

        peerConnection.on("stream", (stream) => {
            peersDispatch({ type: "setPeerStream", stream, peerId });
        });

        peerConnection.on("data", (message) => {
            const string = new TextDecoder().decode(message);
            messageHandler(string);
        });

        peersDispatch({
            type: "addPeer",
            data: {
                cameraEnabled: video,
                connected: false,
                microphoneEnabled: voice,
                midiEnabled: midi,
                peerConnection,
                peerId,
                user,
            },
            peerId,
        });
    };

    return { socket };
};

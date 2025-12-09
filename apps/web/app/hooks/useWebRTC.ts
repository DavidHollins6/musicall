"use client";

import Peer, { SignalData } from "simple-peer";
import { User } from "@musicall/storage";
import { createServerMessage } from "@musicall/types/serverMessage";
import { useMidiStateMachine } from "../machines/midiMachine.client";
import { useChatStateMachine } from "../machines/chatMachine";
import { usePeerStateMachine } from "../machines/peerMachine";
import { useVideoStateMachine } from "../machines/videoMachine";
import { useVoiceStateMachine } from "../machines/voiceMachine";
import { useSocketStateMachine } from "../machines/socketStateMachine";
import { useStreamStateMachine } from "../machines/streamMachine";
import { DataMessageSchema } from "@musicall/types/dataMessage";
import { useSoundStateMachine } from "../machines/soundMachine.client";
import { useEffect } from "react";
import { socket } from "../utils/socket/socket";

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
    roomId: string;
    userId: string;
    isOwner: boolean;
};

export const useWebRTC = ({ roomId, userId, isOwner }: Props) => {
    const chatStateMachine = useChatStateMachine();
    const peerStateMachine = usePeerStateMachine();
    const videoStateMachine = useVideoStateMachine();
    const voiceStateMachine = useVoiceStateMachine();
    const socketStateMachine = useSocketStateMachine();
    const midiStateMachine = useMidiStateMachine();
    const soundStateMachine = useSoundStateMachine();
    const streamStateMachine = useStreamStateMachine();
    const isSocketConnected = socketStateMachine.matches("connected");

    useEffect(() => {
        if (isSocketConnected) {
            videoStateMachine.send({ type: "video.scanAvailableDevices" });
            voiceStateMachine.send({ type: "voice.scanAvailableDevices" });
            midiStateMachine.send({ type: "midi.scanInputs" });
            const message = createServerMessage({
                type: "join-room",
                userId,
                voice: voiceStateMachine.context.enabled,
                video: videoStateMachine.context.enabled,
                midi: midiStateMachine.context.enabled,
                roomId,
            });
            socketStateMachine.send({ type: "socket.sendMessage", message });

            if (isOwner) {
                socketStateMachine.send({
                    type: "socket.sendMessage",
                    message: createServerMessage({
                        type: "join-owners-room",
                        userId,
                    }),
                });
            }

            socket.on(
                "peer",
                (data: {
                    peerId: string;
                    initiator: boolean;
                    user: User;
                    voice: boolean;
                    video: boolean;
                    midi: boolean;
                }) => {
                    addPeer(data.peerId, data.initiator, data.user, data.voice, data.video, data.midi, roomId);
                },
            );

            socket.on("signal", (data: { peerId: string; signal: SignalData }) => {
                peerStateMachine.context.peers[data.peerId].peerConnection.signal(data.signal);
            });

            socket.on("lobby-updated", (data: { waiters: Array<{ userId: string; name: string }> }) => {
                peerStateMachine.send({ type: "peer.setWaitingList", waitingList: data.waiters });
            });

            socket.on("chat", (data: { message: string; from: User; timestamp: number; roomId: string }) => {
                chatStateMachine.send({ type: "chat.sendMessage", message: data });
            });

            socket.on(
                "update-device-status",
                (data: { peerId: string; voice: boolean; video: boolean; midi: boolean }) => {
                    peerStateMachine.send({
                        type: "peer.setDeviceStatus",
                        cameraEnabled: data.video,
                        microphoneEnabled: data.voice,
                        midiEnabled: data.midi,
                        peerId: data.peerId,
                    });
                },
            );
        }
    }, [isSocketConnected]);

    const addPeer = (
        peerId: string,
        initiator: boolean,
        user: User,
        voice: boolean,
        video: boolean,
        midi: boolean,
        roomId: string,
    ) => {
        const peerConnection = new Peer({
            initiator: initiator,
            config: CONFIG,
            trickle: USE_TRICKLE,
            stream: streamStateMachine.context.stream,
        });

        peerConnection.on("signal", (data) => {
            const message = createServerMessage({
                type: "signal",
                signal: data,
                peerId,
                userId: userId,
                roomId,
            });
            socketStateMachine.send({ type: "socket.sendMessage", message });
        });

        peerConnection.on("error", (e) => {
            console.log(e);
        });

        peerConnection.on("connect", () => {
            Object.keys(peerStateMachine.context.peers).forEach((k) => {
                if (
                    peerStateMachine.context.peers[k].peerConnection.streams.length === 0 &&
                    streamStateMachine.context.stream
                ) {
                    streamStateMachine.context.stream.getTracks().forEach((track) => {
                        peerStateMachine.context.peers[k].peerConnection.addTrack(
                            track,
                            streamStateMachine.context.stream as MediaStream,
                        );
                    });
                }
            });
        });

        peerConnection.on("close", () => {
            if (peerStateMachine.context.peers[user.id]) {
                peerConnection.destroy();
            }
            peerStateMachine.send({ type: "peer.removePeer", peerId });
        });

        peerConnection.on("end", () => {
            console.log("ended");
        });

        peerConnection.on("data", (data) => {
            const messageString = new TextDecoder().decode(data);
            const messageObject = JSON.parse(messageString);

            const result = DataMessageSchema.safeParse(messageObject);

            if (!result.success) {
                console.log("could not parse", result);
                return;
            }

            switch (result.data.type) {
                case "midi":
                    soundStateMachine.send({
                        type: "sound.playSound",
                        message: result.data.message.message,
                        instrument: result.data.message.instrument,
                    });
                    break;
            }
        });

        peerConnection.on("stream", (stream) => {
            peerStateMachine.send({ type: "peer.setStream", peerId, stream });
        });

        peerStateMachine.send({
            type: "peer.addPeer",
            peer: {
                cameraEnabled: video,
                connected: false,
                microphoneEnabled: voice,
                midiEnabled: midi,
                peerConnection,
                peerId,
                user,
            },
        });
    };
};

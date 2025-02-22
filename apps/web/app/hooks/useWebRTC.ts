"use client";

import { usePartySocket } from "partysocket/react";
import Peer from "simple-peer";
import { User } from "@musicall/storage";
import { createServerMessage } from "@musicall/types/serverMessage";
import { ClientMessageSchema } from "@musicall/types/clientMessage";
import { useMidiStateMachine } from "../machines/midiMachine";
import { useChatStateMachine } from "../machines/chatMachine";
import { usePeerStateMachine } from "../machines/peerMachine";
import { useVideoStateMachine } from "../machines/videoMachine";
import { useVoiceStateMachine } from "../machines/voiceMachine";
import { useSocketStateMachine } from "../machines/socketStateMachine";
import { useStreamStateMachine } from "../machines/streamMachine";
import { DataMessageSchema } from "@musicall/types/dataMessage";

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

export const useWebRTC = ({ room, userId }: Props) => {
    const chatStateMachine = useChatStateMachine();
    const peerStateMachine = usePeerStateMachine();
    const videoStateMachine = useVideoStateMachine();
    const voiceStateMachine = useVoiceStateMachine();
    const socketStateMachine = useSocketStateMachine();
    const midiStateMachine = useMidiStateMachine();
    const streamStateMachine = useStreamStateMachine();

    const socket = usePartySocket({
        room: room,
        host: process.env.NEXT_PUBLIC_SOCKET_URL,
        onMessage(evt) {
            const result = ClientMessageSchema.safeParse(JSON.parse(String(evt.data)));

            if (!result.success) {
                console.error("could not parse", result);
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
                    peerStateMachine.context.peers[result.data.peerId].peerConnection.signal(result.data.signal);
                    break;
                case "lobby-updated":
                    peerStateMachine.send({ type: "peer.setWaitingList", waitingList: result.data.waiters });
                    break;
                case "chat":
                    chatStateMachine.send({ type: "chat.sendMessage", message: result.data });
                    break;
                case "update-device-status":
                    peerStateMachine.send({
                        type: "peer.setDeviceStatus",
                        cameraEnabled: result.data.video,
                        microphoneEnabled: result.data.voice,
                        midiEnabled: result.data.midi,
                        peerId: result.data.peerId,
                    });
                    break;
                case "client-left":
                    console.log("someone left");
                    break;
            }
        },
        onOpen() {
            socketStateMachine.send({
                type: "socket.initialized",
                socket,
            });
            videoStateMachine.send({ type: "video.scanAvailableDevices" });
            voiceStateMachine.send({ type: "voice.scanAvailableDevices" });
            midiStateMachine.send({ type: "midi.scanInputs" });
            const message = createServerMessage({
                type: "join-room",
                userId,
                voice: voiceStateMachine.context.enabled,
                video: videoStateMachine.context.enabled,
                midi: midiStateMachine.context.enabled,
            });
            socketStateMachine.send({ type: "socket.sendMessage", message });
        },
    });

    const addPeer = (peerId: string, initiator: boolean, user: User, voice: boolean, video: boolean, midi: boolean) => {
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
                    midiStateMachine.send({ type: "midi.playSound", message: result.data.message });
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

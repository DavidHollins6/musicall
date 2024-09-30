import { usePartySocket } from "partysocket/react";
import Peer from "simple-peer";
import { useEffect } from "react";
import { User } from "@musicall/storage";
import { createServerMessage } from "@musicall/types/serverMessage";
import { ClientMessageSchema } from "@musicall/types/clientMessage";
import { usePeerStore } from "../store/peerStore";
import { useSocketStore } from "../store/socketStore";
import { useCameraState } from "./useCameraState";
import { useMicrophoneState } from "./useMicrophoneState";
import { useMidiState } from "./useMidiState";

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
    const {
        peers,
        localStream,
        setLocalStream,
        setWaitingList,
        addChatMessage,
        updateDeviceStatus,
        setPeerStream,
        addPeer: addPeerToStore,
        removePeer,
    } = usePeerStore();

    const { setSocket } = useSocketStore();
    const {
        mediaStream: videoStream,
        selectedDevice: selectedVideoDevice,
        camera,
        defaultCameraOn,
        defaultCameraDevice,
        devices: videoDevices,
        select: selectVideo,
    } = useCameraState();

    const {
        mediaStream: voiceStream,
        selectedDevice: selectedVoiceDevice,
        microphone,
        defaultMicrophoneOn,
        defaultMicrophoneDevice,
        devices: voiceDevices,
        select: selectVoice,
    } = useMicrophoneState();

    const { defaultMidiOn } = useMidiState();

    useEffect(() => {
        const initializeIds = async () => {
            selectVideo(defaultCameraDevice || videoDevices[0].deviceId);
            selectVoice(defaultMicrophoneDevice || voiceDevices[0].deviceId);
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
            if (!selectedVideoDevice || !selectedVoiceDevice) {
                return;
            }

            const newLocalStream = new MediaStream();

            if (videoStream) {
                videoStream.getVideoTracks().forEach((track) => {
                    track.enabled = !camera.isMute;
                    newLocalStream.addTrack(track);
                });
            }

            if (voiceStream) {
                voiceStream.getAudioTracks().forEach((track) => {
                    track.enabled = !microphone.isMute;
                    newLocalStream.addTrack(track);
                });
            }

            setLocalStream(newLocalStream);
        };

        initializeStream();
    }, [selectedVideoDevice, selectedVoiceDevice]);

    const socket = usePartySocket({
        room: room,
        host: "https://localhost:1999",
        onMessage(evt) {
            const result = ClientMessageSchema.safeParse(JSON.parse(String(evt.data)));

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
                case "lobby-updated":
                    setWaitingList(result.data.waiters);
                    break;
                case "chat":
                    addChatMessage(result.data);
                    break;
                case "update-device-status":
                    updateDeviceStatus(result.data.peerId, result.data.voice, result.data.video, result.data.midi);
                    break;
            }
        },
        onOpen() {
            setSocket(socket);
            const message = createServerMessage({
                type: "join-room",
                userId,
                voice: defaultMicrophoneOn,
                video: defaultCameraOn,
                midi: defaultMidiOn,
            });
            socket.send(message);
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
            const message = createServerMessage({
                type: "signal",
                signal: data,
                peerId,
                userId: userId,
            });
            socket.send(message);
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
            removePeer(peerId);
        });

        peerConnection.on("stream", (stream) => {
            setPeerStream(peerId, stream);
        });

        addPeerToStore(peerId, {
            cameraEnabled: video,
            connected: false,
            microphoneEnabled: voice,
            midiEnabled: midi,
            peerConnection,
            peerId,
            user,
        });
    };

    return { socket };
};

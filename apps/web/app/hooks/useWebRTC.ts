import { usePartySocket } from "partysocket/react";
import Peer from "simple-peer";
import { useCamera } from "./useCamera";
import { useEffect } from "react";
import { useMicrophone } from "./useMicrophone";
import { User } from "@musicall/storage";
import { createServerMessage } from "@musicall/types/serverMessage";
import { ClientMessageSchema } from "@musicall/types/clientMessage";
import { useDeviceStore } from "../store/deviceStore";
import { usePeerStore } from "../store/peerStore";
import { useSocketStore } from "../store/socketStore";

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

    const { voice, video, midi } = useDeviceStore();
    const { getStreamById: getVideoStreamById } = useCamera();
    const { getStreamById: getAudioStreamById } = useMicrophone();
    const { setSocket } = useSocketStore();

    useEffect(() => {
        const initializeIds = async () => {};

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

            setLocalStream(newLocalStream);
        };

        initializeStream();
    }, [video.id, voice.id]);

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
                case "waiting-room-updated":
                    console.log("someone joined the waiting room!", result.data);
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
                voice: voice.enabled,
                video: video.enabled,
                midi: midi.enabled,
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

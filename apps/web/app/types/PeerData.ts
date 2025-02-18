import { User } from "@musicall/storage";
import Peer from "simple-peer";

export type PeerData = {
    peerConnection: Peer.Instance;
    user: User;
    peerId: string;
    microphoneEnabled: boolean;
    cameraEnabled: boolean;
    midiEnabled: boolean;
    stream?: MediaStream;
    connected: boolean;
};

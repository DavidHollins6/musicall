import { z } from "zod";
import { SignalData } from "simple-peer";
import { User } from "@musicall/storage";

export type ClientSignal = {
    type: "signal";
    signal: SignalData;
    peerId: string;
    userId: string;
};

export type ClientPeer = {
    type: "peer";
    peerId: string;
    initiator: boolean;
    user: User;
    voice?: boolean;
    video?: boolean;
    midi?: boolean;
};

export type ClientWaitingRoomUpdated = {
    type: "lobby-updated";
    waiters: Array<{ userId: string; name: string }>;
};

export type ClientChat = {
    type: "chat";
    message: string;
    from: User;
    timestamp: number;
};

export type ClientUpdateDeviceStatus = {
    type: "update-device-status";
    peerId: string;
    voice: boolean;
    video: boolean;
    midi: boolean;
};

export type ClientAllowIntoRoom = {
    type: "allow-into-room";
    userId: string;
    roomId: string;
};

export type ClientLeft = {
    type: "client-left";
    peerId: string;
};

export const ClientMessageSchema = z
    .custom<ClientSignal>()
    .or(z.custom<ClientPeer>())
    .or(z.custom<ClientWaitingRoomUpdated>())
    .or(z.custom<ClientChat>())
    .or(z.custom<ClientUpdateDeviceStatus>())
    .or(z.custom<ClientAllowIntoRoom>())
    .or(z.custom<ClientLeft>());

export type ClientMessages =
    | ClientSignal
    | ClientPeer
    | ClientWaitingRoomUpdated
    | ClientChat
    | ClientUpdateDeviceStatus
    | ClientAllowIntoRoom
    | ClientLeft;

export const createClientMessage = (message: ClientMessages) => {
    return message;
};

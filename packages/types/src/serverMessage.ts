import { z } from "zod";
import type { SignalData } from "simple-peer";
import { User } from "@musicall/storage";

export type ServerSignalMessage = {
    type: "signal";
    signal: SignalData;
    peerId: string;
    userId: string;
};

export type ServerJoinRoomMessage = {
    type: "join-room";
    userId: string;
    voice: boolean;
    video: boolean;
    midi: boolean;
};

export type ServerAllowIntoRoomMessage = {
    type: "allow-into-room";
    userId: string;
};

export type ServerJoinWaitingRoomMessage = {
    type: "join-waiting-room";
    userId: string;
    name: string;
};

export type ServerChatMessage = {
    type: "chat";
    message: string;
    from: User;
    timestamp: number;
};

export type ServerUpdateDeviceStatusMessage = {
    type: "update-device-status";
    voice: boolean;
    video: boolean;
    midi: boolean;
};

export const ServerMessageSchema = z
    .custom<ServerSignalMessage>()
    .or(z.custom<ServerJoinRoomMessage>())
    .or(z.custom<ServerAllowIntoRoomMessage>())
    .or(z.custom<ServerJoinWaitingRoomMessage>())
    .or(z.custom<ServerChatMessage>())
    .or(z.custom<ServerUpdateDeviceStatusMessage>());

export type ServerMessages =
    | ServerSignalMessage
    | ServerJoinRoomMessage
    | ServerAllowIntoRoomMessage
    | ServerJoinWaitingRoomMessage
    | ServerChatMessage
    | ServerUpdateDeviceStatusMessage;

export const createServerMessage = (message: ServerMessages) => {
    return JSON.stringify(message);
};

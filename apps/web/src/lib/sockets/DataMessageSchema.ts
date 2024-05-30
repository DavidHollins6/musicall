import z from "zod";
import { type MessageEvent as MidiMessageEvent } from "webmidi";

export type MidiData = { type: "midi"; event: MidiMessageEvent["message"]; from: string };
export type CallData = { type: "call"; microphone?: boolean; video?: boolean; from: string };
export type SyncData = { type: "sync"; microphone: boolean; video: boolean; midi: boolean; from: string };
export type ChatData = { type: "chat"; from: string; message: string; timestamp: number };

export type DataMessage = MidiData | CallData | SyncData | ChatData;

export const DataMessageSchema = z.custom<DataMessage>();

export type MessageHandler = (data: DataMessage) => void;

export type DataMessageHandlers = {
    midi: Array<MessageHandler>;
    call: Array<MessageHandler>;
    sync: Array<MessageHandler>;
    chat: Array<MessageHandler>;
};

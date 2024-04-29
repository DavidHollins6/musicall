import z from "zod";
import { type MessageEvent as MidiMessageEvent } from "webmidi";

export type DataMessage =
    | { type: "midi"; event: MidiMessageEvent["message"]; from: string }
    | { type: "call"; data: { microphone: boolean; video: boolean }; from: string }
    | { type: "initial-sync"; data: { microphone: boolean; video: boolean }; from: string };

export const DataMessageSchema = z.custom<DataMessage>();

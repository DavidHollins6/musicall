import { z } from "zod";
import type { MessageEvent } from "webmidi";

export type DataMidiMessage = {
    type: "midi";
    message: MessageEvent["message"];
};

export const DataMessageSchema = z.custom<DataMidiMessage>();

export type DataMessage = DataMidiMessage;

export const createDataMessage = (message: DataMessage) => {
    return JSON.stringify(message);
};

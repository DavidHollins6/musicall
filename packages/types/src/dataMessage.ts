import { z } from "zod";
import type { MessageEvent } from "webmidi";

export type DataMessage = {
    type: "midi" | "other";
    message: {
        message: MessageEvent["message"];
        instrument: "keyboard" | "drums";
    };
};

export const DataMessageSchema = z.custom<DataMessage>();

export const createDataMessage = (message: DataMessage) => {
    return JSON.stringify(message);
};

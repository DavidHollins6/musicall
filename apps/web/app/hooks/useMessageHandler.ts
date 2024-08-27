import { Message } from "webmidi";
import { z } from "zod";
import { useSoundManager } from "./useSoundManager";

const MessageSchema = z.object({
    type: z.literal("midi"),
    payload: z.custom<Message>(),
});

export const useMessageHandler = () => {
    const soundManager = useSoundManager();

    return (rawMessage: string) => {
        const message = MessageSchema.safeParse(JSON.parse(rawMessage));

        if (!message.success) {
            return;
        }

        switch (message.data.type) {
            case "midi":
                console.log("got a midi message!", message.data.payload);
                soundManager.handleMidiEvent(message.data.payload);
                break;
        }
    };
};

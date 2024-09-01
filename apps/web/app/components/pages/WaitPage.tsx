import { usePartySocket } from "partysocket/react";
import { useState } from "react";
import { z } from "zod";
import { Button, Stepper, Stack, Group, Card } from "@mantine/core";
import { User } from "@musicall/storage";
import { MidiSetup } from "../midi/MidiSetup";
import { VideoSetup } from "../Video/VideoSetup";
import { MicrophoneSetup } from "../audio/MicrophoneSetup";
import { useNavigate } from "@remix-run/react";
import { createServerMessage } from "@musicall/types/serverMessage";

type Props = {
    userId: string;
    roomId: string;
    allowedIntoRoom: boolean;
    roomOwner: User;
};

const MessageSchema = z.object({
    type: z.literal("allow-into-room"),
});

export const WaitPage = ({ roomId, userId, allowedIntoRoom, roomOwner }: Props) => {
    const [allowed, setAllowed] = useState(allowedIntoRoom);
    const [active, setActive] = useState(0);
    const navigate = useNavigate();

    const socket = usePartySocket({
        room: roomId,
        host: "localhost:1999",
        onOpen() {
            const message = createServerMessage({
                type: "join-waiting-room",
                userId,
            });
            socket.send(message);
        },
        onMessage(evt) {
            const result = MessageSchema.safeParse(JSON.parse(String(evt.data)));

            if (!result.success) {
                console.log("could not parse", result);
                return;
            }

            if (result.data.type === "allow-into-room") {
                setAllowed(true);
            }
        },
    });

    return (
        <Stack h="100%">
            <Card
                shadow="lg"
                withBorder
                pos="relative"
                radius="lg"
                w="50%"
                mt={20}
                mx="auto"
                style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            >
                <Stepper
                    active={active}
                    style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                    onStepClick={setActive}
                    styles={{
                        content: {
                            flexGrow: 1,
                        },
                    }}
                >
                    <Stepper.Step label="Video">
                        <VideoSetup
                            onComplete={() => {
                                setActive(1);
                            }}
                        />
                    </Stepper.Step>

                    <Stepper.Step label="Microphone">
                        <MicrophoneSetup
                            onComplete={() => {
                                setActive(2);
                            }}
                        />
                    </Stepper.Step>

                    <Stepper.Step label="Instrument">
                        <MidiSetup
                            onComplete={() => {
                                setActive(3);
                            }}
                        />
                    </Stepper.Step>

                    <Stepper.Completed>Completed, click back button to get to previous step</Stepper.Completed>
                </Stepper>
            </Card>
            <Group justify="flex-end" flex={0}>
                {allowed ? "You may enter!" : `Waiting for ${roomOwner.name} to let you in...`}
                <Button
                    disabled={!allowed}
                    m={20}
                    onClick={() => {
                        navigate(`/call?roomId=${roomId}`);
                    }}
                >
                    Enter Room
                </Button>
            </Group>
        </Stack>
    );
};

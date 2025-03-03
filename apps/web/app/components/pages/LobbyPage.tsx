import { usePartySocket } from "partysocket/react";
import { useRef, useState } from "react";
import { z } from "zod";
import { Button, Stepper, Stack, Group, Card, useMatches, Switch, Title, Center } from "@mantine/core";
import { User } from "@musicall/storage";
import { MidiSetup } from "../midi/MidiSetup";
import { VideoSetup } from "../Video/VideoSetup";
import { MicrophoneSetup } from "../audio/MicrophoneSetup";
import { createServerMessage } from "@musicall/types/serverMessage";
import { useUserStore } from "../../store/userStore";
import { useSocketStateMachine } from "../../machines/socketStateMachine";

type Props = {
    userId: string;
    roomId: string;
    allowedIntoRoom: boolean;
    roomOwner: User;
    socketUrl?: string;
};

const MessageSchema = z.object({
    type: z.literal("allow-into-room"),
});

export const LobbyPage = ({ roomId, allowedIntoRoom, roomOwner, socketUrl }: Props) => {
    const [autoJoin, setAutoJoin] = useState(false);
    const [allowed, setAllowed] = useState(allowedIntoRoom);
    const [active, setActive] = useState(0);
    const linkRef = useRef<HTMLAnchorElement | null>(null);
    const { user } = useUserStore();
    const socketStateMachine = useSocketStateMachine();
    const cardBorder = useMatches({
        sm: false,
        lg: true,
    });
    const cardShadow = useMatches({
        sm: "",
        lg: "lg",
    });

    const mobileView = useMatches({
        base: true,
        lg: false,
    });

    const socket = usePartySocket({
        room: roomId,
        host: socketUrl,
        onOpen() {
            socketStateMachine.send({
                type: "socket.initialized",
                socket,
            });

            const message = createServerMessage({
                type: "join-lobby",
                userId: user.id,
                name: user.name,
            });
            socket.send(message);
        },
        onMessage(evt) {
            const result = MessageSchema.safeParse(JSON.parse(String(evt.data)));

            if (!result.success) {
                console.error("could not parse", result);
                return;
            }

            if (result.data.type === "allow-into-room") {
                if (autoJoin && linkRef.current) {
                    linkRef.current.click();
                } else {
                    setAllowed(true);
                }
            }
        },
    });

    return (
        <Stack h="100%">
            <Title m="20px">{roomOwner.name}&#39;s Waiting Room</Title>
            <Card
                shadow={cardShadow}
                withBorder={cardBorder}
                pos="relative"
                radius="lg"
                w={{ lg: "50%", xs: "100%" }}
                mx={{ lg: "auto" }}
                mt={{ lg: "20px" }}
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
                    <Stepper.Step label={mobileView ? (active === 0 ? "Video" : "") : "Video"}>
                        <VideoSetup
                            onComplete={() => {
                                setActive(1);
                            }}
                        />
                    </Stepper.Step>

                    <Stepper.Step label={mobileView ? (active === 1 ? "Mic" : "") : "Mic"}>
                        <MicrophoneSetup
                            onComplete={() => {
                                setActive(2);
                            }}
                        />
                    </Stepper.Step>

                    <Stepper.Step label={mobileView ? (active === 2 ? "Instrument" : "") : "Instrument"}>
                        <MidiSetup
                            onComplete={() => {
                                setActive(3);
                            }}
                        />
                    </Stepper.Step>

                    <Stepper.Completed>
                        <Center mt={50}>You&#39;re good to go!</Center>
                    </Stepper.Completed>
                </Stepper>
            </Card>
            <Group justify="flex-end" grow={mobileView} m={mobileView ? 20 : 0} flex={0}>
                <Switch
                    label="Auto-join room"
                    checked={autoJoin}
                    onChange={(event) => setAutoJoin(event.currentTarget.checked)}
                />
                <Button ref={linkRef} component="a" href={`/call?roomId=${roomId}`} disabled={!allowed} m={20}>
                    Enter Room
                </Button>
            </Group>
        </Stack>
    );
};

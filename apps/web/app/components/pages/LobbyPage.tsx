import { useRef, useState } from "react";
import { Button, Stepper, Stack, Group, Card, useMatches, Switch, Title, Center } from "@mantine/core";
import { User } from "@musicall/storage";
import { MidiSetup } from "../midi/MidiSetup";
import { VideoSetup } from "../Video/VideoSetup";
import { MicrophoneSetup } from "../audio/MicrophoneSetup";
import { useUserStore } from "../../store/userStore";
import { useLobbySocket } from "../../hooks/useLobbySocket";

type Props = {
    userId: string;
    roomId: string;
    allowedIntoRoom: boolean;
    roomOwner: User;
};

export const LobbyPage = ({ roomId, allowedIntoRoom, roomOwner }: Props) => {
    const [autoJoin, setAutoJoin] = useState(false);
    const [allowed, setAllowed] = useState(allowedIntoRoom);
    const [active, setActive] = useState(0);
    const linkRef = useRef<HTMLAnchorElement | null>(null);
    const { user } = useUserStore();

    useLobbySocket(roomId, user.id, user.firstName, () => {
        if (autoJoin && linkRef.current) {
            linkRef.current.click();
        } else {
            setAllowed(true);
        }
    });

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

    return (
        <Stack h="100%">
            <Title m="20px">{roomOwner.firstName}&#39;s Waiting Room</Title>
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

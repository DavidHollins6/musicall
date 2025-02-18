"use client";

import { Avatar, Button, Card, Divider, Group, Stack, Text, Title } from "@mantine/core";
import { createServerMessage } from "@musicall/types/serverMessage";
import { useUserStore } from "../../store/userStore";
import { usePeerStateMachine } from "../../machines/peerMachine";
import { useSocketStateMachine } from "../../machines/socketStateMachine";

export const ParticipantsDrawer = () => {
    const peerStateMachine = usePeerStateMachine();
    const { user } = useUserStore();

    const socketStateMachine = useSocketStateMachine();

    return (
        <Stack>
            <Stack>
                <Title order={3}>Waiting List</Title>
                {peerStateMachine.context.waitingList.map((w) => (
                    <Card key={w.userId}>
                        <Group>
                            <Avatar />
                            <Text>{w.name}</Text>
                            <Button
                                onClick={() => {
                                    const message = createServerMessage({ type: "allow-into-room", userId: w.userId });
                                    socketStateMachine.send({ type: "socket.sendMessage", message });
                                }}
                            >
                                Allow into room
                            </Button>
                        </Group>
                    </Card>
                ))}
                <Divider />
            </Stack>
            <Stack>
                <Title order={3}>Participants</Title>
                <Card>
                    <Group>
                        <Avatar />
                        <Text>{user.name} (You)</Text>
                    </Group>
                </Card>
                {Object.keys(peerStateMachine.context.peers).map((p) => {
                    const peer = peerStateMachine.context.peers[p];
                    return (
                        <Card key={p}>
                            <Group>
                                <Avatar />
                                <Text>{peer.user.name}</Text>
                            </Group>
                        </Card>
                    );
                })}
            </Stack>
        </Stack>
    );
};

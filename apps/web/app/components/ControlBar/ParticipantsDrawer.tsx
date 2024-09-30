import { Avatar, Button, Card, Divider, Group, Stack, Text, Title } from "@mantine/core";
import { createServerMessage } from "@musicall/types/serverMessage";
import { usePeerStore } from "../../store/peerStore";
import { useSocketStore } from "../../store/socketStore";
import { useUserStore } from "../../store/userStore";

export const ParticipantsDrawer = () => {
    const { waitingList, peers } = usePeerStore();
    const { user } = useUserStore();
    const { socket } = useSocketStore();

    return (
        <Stack>
            <Stack>
                <Title order={3}>Waiting List</Title>
                {waitingList.map((w) => (
                    <Card key={w.userId}>
                        <Group>
                            <Avatar />
                            <Text>{w.name}</Text>
                            <Button
                                onClick={() => {
                                    const message = createServerMessage({ type: "allow-into-room", userId: w.userId });
                                    if (socket) {
                                        socket.send(message);
                                    }
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
                {Object.keys(peers).map((p) => {
                    const peer = peers[p];
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

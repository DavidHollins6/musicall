import { Avatar, Button, Card, Group, Stack, Text } from "@mantine/core";
import { createServerMessage } from "@musicall/types/serverMessage";
import { usePeerStore } from "../../store/peerStore";
import { useSocketStore } from "../../store/socketStore";

export const WaitingListDrawer = () => {
    const { waitingList } = usePeerStore();
    const { socket } = useSocketStore();

    if (waitingList.length === 0) {
        return <Text>No one is waiting to join</Text>;
    }

    return (
        <Stack>
            {waitingList.map((w) => (
                <Card key={w}>
                    <Group>
                        <Avatar />
                        <Text>{w}</Text>
                        <Button
                            onClick={() => {
                                const message = createServerMessage({ type: "allow-into-room", userId: w });
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
        </Stack>
    );
};

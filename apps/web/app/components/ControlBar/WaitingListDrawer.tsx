import { Avatar, Button, Card, Group, Stack, Text } from "@mantine/core";
import PartySocket from "partysocket";
import { usePeers } from "../../store/peersContext";

export const WaitingListDrawer = ({ socket }: { socket: PartySocket }) => {
    const { waitingList } = usePeers();

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
                                socket.send(JSON.stringify({ type: "allow-into-room", userId: w }));
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
